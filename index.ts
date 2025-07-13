import express, { Application } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { https } from 'firebase-functions'

import { logger } from './src/logger/winston'
import errorMiddleware from './src/middleware/error.middleware'
import { Routes } from './src/api/api'
import startMongo from './src/core/dataBase'
import Configurations from './src/core/configurations'
import startFirebase from './src/core/firebase'

dotenv.config()

class App {
    private readonly app: Application

    private readonly routes: Routes = new Routes()

    private readonly configurations = new Configurations()

    private readonly corsOptions = {
        origin: this.configurations.CLIENTS,
        optionsSuccessStatus: 200,
    }

    constructor() {
        startMongo(this.configurations)
        startFirebase(this.configurations)
        this.app = express()
        this.config()
        https.onRequest(this.app)
        this.routes.routes(this.app)
        this.configError()
        this.startServer(this.app, this.configurations.APP.port)
    }

    private config(): void {
        console.log(this.corsOptions.origin)
        this.app.use(cors(this.corsOptions))
        this.app.use(express.json({ limit: '50mb' }))
        this.app.use(express.urlencoded({ limit: '50mb', extended: true }))
    }

    private configError(): void {
        this.app.use(errorMiddleware)
    }

    private startServer(app: Application, PORT: string): void {
        app.listen(process.env.PORT || '3005', () => {
            logger.info(`Express server listening on port ${PORT}`)
        })
    }
}

export default new App()
