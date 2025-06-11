import winston, { createLogger, format, transports } from "winston";
import { addColors } from "winston/lib/winston/config";
const { combine, timestamp, printf, colorize } = format;
export const myFormat = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp}] [${level}] [${label}]: ${message}`;
});

type LogLevel = "error" | "warn" | "info" | "debug" | "verbose" | "silly";

export default class Logger {
  logger: winston.Logger;
  constructor(level: LogLevel = "debug") {
    const transportsList: winston.transport[] = [new transports.Console()];
    this.logger = createLogger({
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 4,
        verbose: 5,
        silly: 6,
      },
      level,
      format: combine(
        timestamp({ format: "dd HH:mm:ss" }),
        myFormat,
        colorize({ all: true })
      ),
      transports: transportsList,
    });
    addColors({
      info: "bold green",
      warn: "italic yellow",
      error: "bold red",
      debug: "blue",
      verbose: "cyan",
      silly: "white",
    });
  }
  log(data: { level: string; label: string; message: string }) {
    this.logger.log(data);
  }
}
