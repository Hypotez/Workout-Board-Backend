import express from 'express'
import cors from "cors"

import env from './config/env'

import { apiResponseMiddleware, cookieAuth } from './middleware/middleware'
import logger from './logger/logger'
import user from './routes/user'
import auth from './routes/auth'
import HevyClient from './service/hevy/hevyClient'

import { Service } from './types/service'
import { ResponseHelpers } from './types/express'

const PORT = env.PORT
const NODE_ENV = env.NODE_ENV
const FRONTEND_URL = env.FRONTEND_URL

const HEVY_URL = env.HEVY_URL
const HEVY_API_KEY = env.HEVY_API_KEY

const app = express()

app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(express.json({ limit: '1mb' }))
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(apiResponseMiddleware)

declare module 'express-serve-static-core' {
  export interface Request {
    service: Service
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Response extends ResponseHelpers {}
}

app.use((req, _, next) => {
  req.service = {
    hevyClient: new HevyClient(HEVY_URL, HEVY_API_KEY)
  }

  next()
})

app.use('/api/v1/auth', auth)
app.use('/api/v1/user', cookieAuth, user)

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT} NODE_ENV=${NODE_ENV}`)
})