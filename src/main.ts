import express from 'express'
import cors from "cors"

import env from './config/env.js'
import { apiResponseMiddleware } from './middleware/middleware.js'
import logger from './logger/logger.js'

import user from './routes/user.js'

import HevyClient from './service/hevyClient.js'


import { Service, ResponseHelpers } from './types.js'

const PORT = env.PORT
const NODE_ENV = env.NODE_ENV
const FRONTEND_URL = env.FRONTEND_URL

const HEVY_URL = env.HEVY_URL
const HEVY_API_KEY = env.HEVY_API_KEY

declare module 'express-serve-static-core' {
  export interface Request {
    service: Service
  }

  export interface Response extends ResponseHelpers{}
}

const app = express()

app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(express.json({ limit: '1mb' }))
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(apiResponseMiddleware)

app.use((req, _, next) => {
  req.service = {
    hevyClient: new HevyClient(HEVY_URL, HEVY_API_KEY)
  }

  next()
})

app.use('/api/v1/user', user)


app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT} NODE_ENV=${NODE_ENV}`)
})