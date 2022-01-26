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
  const CHUNK_SIZE = 3000
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

app.get('/video-stream', (req, res) => {
  const range = req.headers.range
  const videoPath = resolve(__dirname, 'videos', 'Cavaleiro-da-Lua_Marvel-Studios_Trailer-Oficial-Dublado_Disney+-(1080p).mp4')
  const videoSize = fs.statSync(videoPath).size

  const start = Number(range?.replace(/\D/g, ''))
  const CHUNK_SIZE = 10000
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Rangers': `bytes`,
    'Content-Type': 'video/mp4'
  }

  res.writeHead(206, headers)

  const songStream = fs.createReadStream(videoPath, { start, end })
  return songStream.pipe(res)
})

app.listen(3000)