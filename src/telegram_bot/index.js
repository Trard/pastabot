var sqlite3 = require("sqlite3").verbose();

const winston = require("winston");
const { Telegraf } = require("telegraf");

require("dotenv").config();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "logs/telegram_bot/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/telegram_bot/combined.log",
    }),
  ],
});

const db = new sqlite3.Database("./db/paste.db", (err) => {
  if (err) {
    logger.error(err);
  } else {
    logger.info("Connected to the database.");
  }
});

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

//logger middleware
bot.use(async (ctx, next) => {
  await next();
  logger.info(ctx);
});

bot.command("paste", (ctx) => {
  db.get(
    "SELECT * FROM 'paste2' ORDER BY RANDOM() LIMIT 1;",
    async (err, res) => {
      let content = res.content
      for (let part = 0; part < content.length; part = part + 4096) {
        await ctx.reply(content.slice(part, part+4096));
        await new Promise(r => setTimeout(r, 100)); //for the correct sequence of messages
      }
    }
  );
});

module.exports = bot;
