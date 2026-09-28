import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const storageFile = path.resolve(__dirname, 'tasks-storage.json')

function fileStoragePlugin(): Plugin {
  const handler = (req: any, res: any) => {
    if (req.method === 'POST') {
      let body = ''
      req.on('data', (chunk: any) => {
        body += chunk
      })
      req.on('end', () => {
        try {
          fs.writeFileSync(storageFile, body, 'utf-8')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, message: 'Сохранено в tasks-storage.json' }))
        } catch (e: any) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: e.message }))
        }
      })
      return
    }

    if (req.method === 'GET') {
      if (fs.existsSync(storageFile)) {
        const content = fs.readFileSync(storageFile, 'utf-8')
        res.setHeader('Content-Type', 'application/json')
        res.end(content)
      } else {
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Файл tasks-storage.json еще не создан' }))
      }
      return
    }

    res.statusCode = 405
    res.end()
  }

  return {
    name: 'file-storage-plugin',
    configureServer(server) {
      server.middlewares.use('/api/storage', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/storage', handler)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fileStoragePlugin()],
})
