import express from 'express'
import dotenv from 'dotenv'

import logger from './logger/logger.js'
import { Service } from './types.js'

dotenv.config()

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV

declare module 'express-serve-static-core' {
  export interface Request {
    service: Service
  }
}

const app = express()

app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(express.json({ limit: '1mb' }))

app.use((req, _, next) => {
  req.service = {
  }

  next()
})


if (PORT && NODE_ENV) {
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT} NODE_ENV=${NODE_ENV}`)
  })
}