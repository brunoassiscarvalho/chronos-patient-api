import { logger } from "../logger/winston";
import { connect } from "mongoose";
import Configurations from "./configurations";

export default function mongoStart(configurations: Configurations): void {
  connect(configurations.MONGO, {
    autoIndex: true, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  })
    .then(() => {
      logger.info("Banco de dados inciado");
    })
    .catch((error) => logger.error("Erro ao iniciar o BD", error));
}
