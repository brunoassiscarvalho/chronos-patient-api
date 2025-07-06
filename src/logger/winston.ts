import winston from "winston";

const transports = {
  file: new winston.transports.File({ filename: "error.log", level: "error" }),
  combined: new winston.transports.File({ filename: "combined.log" }),
  console: new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf((info) => {
        const { timestamp, level, message, ...args } = info;
        const ts = (timestamp as string).slice(0, 19).replace("T", " ");
        return `[${level}] ${ts}  ${message} ${
          Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
        }`;
      })
    ),
  }),
};

export const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [transports.console, transports.combined, transports.file],
});

if (process.env.NODE_ENV !== "production") {
  transports.console.level = "info";
}
