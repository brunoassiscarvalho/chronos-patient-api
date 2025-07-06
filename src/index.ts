import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { logger } from "./logger/winston";
import errorMiddleware from "./middleware/error.middleware";
import { Routes } from "./api/api";
import startMongo from "./core/dataBase";
import Configurations from "./core/configurations";
import startFirebase from "./core/firebase";

dotenv.config();

class App {
  private app: Application;

  private PORT: string = process.env.PORT || "3005";

  private routes: Routes = new Routes();

  private configurations = new Configurations();

  private corsOptions = {
    origin: this.configurations.CLIENTS,
    optionsSuccessStatus: 200,
  };

  constructor() {
    startMongo(this.configurations);
    startFirebase(this.configurations);
    this.app = express();
    this.config();
    this.routes.routes(this.app);
    this.configError();
    this.startServer(this.app, this.PORT);
  }

  private config(): void {
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ limit: "50mb", extended: true }));
  }

  private configError(): void {
    this.app.use(errorMiddleware);
  }

  private startServer(app: Application, PORT: string): void {
    app.listen(process.env.PORT || "3005", () => {
      logger.info(`Express server listening on port ${PORT}`);
    });
  }
}

export default new App();
