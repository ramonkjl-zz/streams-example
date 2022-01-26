import express from 'express'
import fs from 'fs'
import { resolve } from 'path'

const app = express()

app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/index.html')
})

app.get('/stream', (req, res) => {
  const range = req.headers.range
  const songPath = resolve(__dirname, 'musics', 'Eu_Serei_o_Amor.mp3')
  const songSize = fs.statSync(songPath).size

  const start = Number(range?.replace(/\D/g, ''))
  const CHUNK_SIZE = 1000
  const end = Math.min(start + CHUNK_SIZE, songSize - 1)
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${songSize}`,
    'Accept-Rangers': `bytes`,
    'Content-Type': 'audio/mpeg'
  }

  res.writeHead(206, headers)

  const songStream = fs.createReadStream(songPath, { start, end })
  return songStream.pipe(res)
})

app.listen(3000)