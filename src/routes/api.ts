import { Router } from 'https://deno.land/x/oak@v6.5.0/mod.ts'
import * as process from 'https://deno.land/std@0.93.0/node/process.ts'
import { exists } from 'https://deno.land/std/fs/mod.ts'

const router = new Router()
let hostname = ''
let cpuinfo = ''

router.get('/api/status', (ctx) => {
  ctx.response.body = {
    healthy: true,
  }
})

router.get('/api/info', async (ctx) => {
  let cpuModel = 'Unknown'
  let cpuCount = 'Unknown'
  let cpuSpeed = 'Unknown'

  // Cache commands in memory, only fetched once, hostname & CPUs can't change
  if (!hostname) {
    hostname = await runCommand(['hostname'])
  }
  if (!cpuinfo) {
    cpuinfo = await runCommand(['cat', '/proc/cpuinfo'])
  }

  let match = /model name\s*:\s*(.*?)$/gm.exec(cpuinfo)
  if (match) cpuModel = match[1]
  match = /siblings\s*:\s*(.*?)$/gm.exec(cpuinfo)
  if (match) cpuCount = match[1]
  match = /MHz\s*:\s*(.*?)$/gm.exec(cpuinfo)
  if (match) cpuSpeed = match[1]

  ctx.response.body = {
    hostname,
    denoVersion: Deno.version.deno,
    osRelease: Deno.osRelease(),
    osArch: Deno.build.arch,
    osPlatform: process.platform,
    cpuModel,
    cpuCount,
    cpuSpeed,
    inContainer: await exists('/.dockerenv'),
    inKubernetes: await exists('/var/run/secrets/kubernetes.io'),
  }
})

router.get('/api/env', (ctx) => {
  let envDump = Deno.env.toObject()
  for (const envName in envDump) {
    // Very simplistic attempt to filter out possible secrets
    if (envName.toLowerCase().match(/.*key.*|.*pat.*|.*passwd.*|.*secret.*|.*password.*|.*token.*/)) {
      delete envDump[envName]
    }
  }
  ctx.response.body = envDump
})

router.get('/api/metrics', (ctx) => {
  ctx.response.body = {
    memoryTotal: Deno.systemMemoryInfo().total,
    memoryFree: Deno.systemMemoryInfo().free,
    memoryAvail: Deno.systemMemoryInfo().available,
    load: Deno.loadavg(),
  }
})

async function runCommand(command: string[]): Promise<string> {
  const cmd = Deno.run({
    cmd: command,
    stdout: 'piped',
    stderr: 'piped',
  })

  const output = await cmd.output()
  const outStr = new TextDecoder().decode(output)
  return outStr
}

export default router
