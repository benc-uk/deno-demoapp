import { Application } from 'https://deno.land/x/oak@v6.5.1/mod.ts'
import { adapterFactory, engineFactory, viewEngine } from 'https://deno.land/x/view_engine@v1.5.0/mod.ts'

const app = new Application()

// Template rendering
const ejsEngine = engineFactory.getEjsEngine()
//const oakAdapter = adapterFactory.getOakAdapter()
// app.use(
//   viewEngine(oakAdapter, ejsEngine, {
//     viewRoot: 'src/views',
//     viewExt: '.ejs',
//   })
// )

await app.listen({ port: 8000, hostname: '0.0.0.0' })
