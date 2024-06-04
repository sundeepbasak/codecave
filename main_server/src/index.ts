import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import langRoutes from './routes/lang.routes'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Main Server')
})

app.route('/lang', langRoutes)

const port = 5001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

// fs.chmod(path.join(__dirname, './scripts/run.sh'), 0o770, (err) => {
//   if (err) throw err;
//   console.log('The permissions for file "my_file.txt" have been changed!');
// });