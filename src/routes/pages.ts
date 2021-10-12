import { Router } from 'https://deno.land/x/oak@v6.5.0/mod.ts'
import { renderFile } from 'https://deno.land/x/dejs/mod.ts'
import { Context } from 'https://deno.land/x/oak@v6.5.0/mod.ts'
import * as log from 'https://deno.land/std@0.92.0/log/mod.ts'

const router = new Router()
const viewDir = `${Deno.cwd()}/views`

router.get('/', async (ctx) => {
  await renderView(ctx, 'index')
})

router.get('/info', async (ctx) => {
  await renderView(ctx, 'info')
})

router.get('/monitor', async (ctx) => {
  await renderView(ctx, 'monitor')
})

async function renderView(ctx: Context, viewName: string) {
  try {
    const rendered = await renderFile(`${viewDir}/${viewName}.ejs`, { viewDir })
    ctx.response.body = rendered
  } catch (err) {
    log.error(`renderView for ${ctx.request.url} failed`)
    log.error(err)
  }
}

export default router
