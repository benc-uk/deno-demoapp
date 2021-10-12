import 'https://deno.land/x/dotenv@v2.0.0/mod.ts'
import * as log from 'https://deno.land/std@0.92.0/log/mod.ts'

import { Application } from 'https://deno.land/x/oak@v6.5.0/mod.ts'

import pageRouter from './routes/pages.ts'
import apiRouter from './routes/api.ts'

log.info(`🚀 Deno demoapp server is starting`)

// Handle config defaults
const PORT = parseInt(Deno.env.get('PORT') || '8000')
log.info(`🌐 Port: ${PORT}`)
log.info(`📁 CWD: ${Deno.cwd()}`)

// Create app
const app = new Application()

// Routes for APIs and HTML pages
app.use(pageRouter.routes())
app.use(apiRouter.routes())

// Boom, let's get this thing started...
await app.listen({ port: PORT, hostname: '0.0.0.0' })
