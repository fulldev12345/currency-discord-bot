const axios = require("axios");
const Discord = require("discord.js");
const express = require('express')
const app = express()

require("dotenv").config();

const PORT = process.env.PORT || 4000;

const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate",  (msg) => {
  if (msg.content.startsWith("!crypto_price")) {
    cryptoPrice(msg)
  } else {
    switch (msg.content) {
      case "!help" || "!commands":
        getHelp(msg);
        break;
      case "!currencies":
       getSupportedCurrencies(msg);
        break;
    }
  }
});


client.on("messageCreate",  async (msg) => {

  switch (msg.content) {
    case "!help" || "!commands":
      const embed1 = new Discord.MessageEmbed()
      .setTitle("Command list")
      .setDescription(
        '**!help** or **!commands** - shows the command list \n\n' +
        '**!currencies** to get all the suppported currencies. \n\n' +
        '**!crypto_price** *<currencies>* *<cryptocurrencies>* to get the value of the cryptocurrency in another currency, to use it first type the **currency** and then the **cryptocurrency** e.g. (**!crypto_price usd bitcoin**), can also add more currencies and cryptos separating them with commas but without spaces e.g. (**!crypto_price usd,eur,btc bitcoin,ethereum**) \n\n'
      );

    msg.channel.send({ embeds: [embed1] });
      break;
    case "!currencies":
      const res = await axios.get("https://api.coingecko.com/api/v3/simple/supported_vs_currencies");

      const currencies = res.data.map((currency) => `*${currency}*`)
    
      const embed2 = new Discord.MessageEmbed()
        .setTitle("Supported Currencies")
        .setDescription(currencies.join(", "))
        .setColor("#0099ff")
        .setFooter("Powered by CoinGecko");
    
      msg.channel.send({ embeds: [embed2] });
      break;
  }
});

const cryptoPrice = (msg) => {
  const currencies = msg.content.split(" ")[1];
  const cryptoCurrencies = msg.content.split(" ")[2];

  if (cryptoCurrencies === undefined || currencies === undefined) {
    const embed = new Discord.MessageEmbed()
      .setTitle("Error")
      .setDescription("Please provide a currency and a cryptocurrency")
      .setColor("#ff0000");

    msg.channel.send({ embeds: [embed] });
    return
  }

  axios.get( `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCurrencies}&vs_currencies=${currencies}`)
  .then((res) => {
    if (res) {

      //if res is empty
      if(Object.keys(res.data).length === 0) {
        const embed = new Discord.MessageEmbed()
        .setTitle("Error")
        .setDescription("Please enter the **currency** and the **cryptocurrency** you want to convert to, remember to separate them with commas but without spaces e.g. (*!crypto_price usd,eur,btc bitcoin,ethereum*).")
        .setColor("#ff0000");

        msg.channel.send({ embeds: [embed] });
      }

      const response = res.data;

      for (let cryptoCurrency in response) {
        for (let currency in response[cryptoCurrency]) {
          const embed = new Discord.MessageEmbed()
          .setDescription(`**${cryptoCurrency}** price in **${currency.toUpperCase()}** ➡️ ${response[cryptoCurrency][currency]}`)

          msg.channel.send({ embeds: [embed] });
        }
      }
    }
  })
}

const getHelp = (msg) => {
  const embed1 = new Discord.MessageEmbed()
          .setTitle("Command list")
          .setDescription(
            '**!help** or **!commands** - shows the command list \n\n' +
            '**!currencies** to get all the suppported currencies. \n\n' +
            '**!crypto_price** *<currencies>* *<cryptocurrencies>* to get the value of the cryptocurrency in another currency, to use it first type the **currency** and then the **cryptocurrency** e.g. (**!crypto_price usd bitcoin**), can also add more currencies and cryptos separating them with commas but without spaces e.g. (**!crypto_price usd,eur,btc bitcoin,ethereum**) \n\n'
          );

        msg.channel.send({ embeds: [embed1] });
}

const getSupportedCurrencies = async (msg) => {
  const res = await axios.get(
    "https://api.coingecko.com/api/v3/simple/supported_vs_currencies"
  );



  const currencies = res.data.map((currency) => `*${currency}*`)

  const embed2 = new Discord.MessageEmbed()
    .setTitle("Supported Currencies")
    .setDescription(currencies.join(", "))
    .setColor("#0099ff")
    .setFooter("Powered by CoinGecko");

  msg.channel.send({ embeds: [embed2] });
};

client.login(process.env.BOT_TOKEN);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});