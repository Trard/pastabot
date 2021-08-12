const telegram_bot = require("./telegram_bot");
const vk_bot = require("./vk_bot");
const localtunnel = require("localtunnel");

const telegram_port = 3000;

const start_all = async () => {
    const telegram_tunnel = await localtunnel({ port: telegram_port });

    vk_bot.updates.start()

    telegram_bot.launch({
        webhook: {
            domain: telegram_tunnel.url,
            port: telegram_port
        }
    });
};

start_all();