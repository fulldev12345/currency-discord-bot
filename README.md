# cryptocurrency-discord-bot

a cryptocurrency discord bot made with *Node*, *discord.js* and *coingecko api*
in this post we will learn how to create a cryptocurrency Discord bot to obtain the values of the cryptocurrency we want to know using [Coingecko API](https://www.coingecko.com/en/api)

To make this post I used the same example from my other post [How to make a Cryptocurrency Telegram bot with Node and Telegraf](https://dev.to/rtagliavia/how-to-make-a-cryptocurrency-telegram-bot-with-node-and-telegraf-4572)

[You can contact me by telegram if you need to hire a Full Stack developer or if you need a discord bot for your server](https://t.me/rtagliajs)

You can also contact me by **discord Appu#9136**

[You can clone the repo if you want.](https://github.com/rtagliaviaz/cryptocurrency-discord-bot)

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) installed
- you will need a Discord account


## Creating Our Project

1. open your terminal and type the following
2. mkdir discord-cryptocurrency-bot
3. cd discord-cryptocurrency-bot
4. npm init --y
5. code .


## Dependencies

- axios
- dotenv
- discord.js

To install dependencies go to your project folder open a terminal and type the following

```console
npm I axios dotenv discord.js
```

Now go to your package.json and add this

```console
  "scripts": {
    "start": "node ./src index.js"
  },
```

## Project File Structure

discord-cryptocurrency-bot/
├── node_modules/
├── src/
│   └── index.js
├── .env
└── package.json


## Table of Contents

1. [Creating our own discord server](#create-discord-server)
2. [Creating our bot and adding it to our server](#discord-bot-token)
3. [Coding our Bot](#coding-our-discord-bot)
4. [Creating the bot commands](#creating-commands)
5. [Deploying it to Heroku](#deploy-to-heroku)
6. [Conclusion](#conclusion)

---

## 1. Creating our own discord server <a name="create-discord-server"></a>

In order to test our bot we need to create a server, this step is easy, just open your discord and click the **+** on the left panel, it will show a window with the **create my own** option, click it, and for this example select **for my and my friends**.


![New server button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4v89q29k9iic8qp82jnd.png)

![create server option](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6dc59wszee1t66t2slgl.png)

After create your server, go and click the wheel icon to open the user settings, go to app settings and click *Advanced*, now activate the developer mode.


![Developer mode](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fh7dfxqp4j51c0dxv9bh.png)


## 2. Creating our bot and adding it to our server <a name="discord-bot-token"></a>

Now open your browser and go to [Discord Developer Portal](https://discord.com/developers/) be sure to be in the **Applications** tab, and click the **New Application** button, it will show a modal where you can choose a name for your new application.


![Create a new discord application](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rbdumxoo46bcg399fs4n.png)

Now in the left panel click on **Bot**, then click on **add bot**, here you can set a name and an icon for your bot, below the name will be the **token**, copy and save it in a .txt file by the moment.



![bot tab](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q9mtd7j7uokhdw6qxcya.png)


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ejf53xwz5qx38jm674p8.png)

Now scroll down to *Privileged Gateway Intents*, here we will check some intents to be able to interact with our bot.


![discord intents](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g1o6zu0rraoq02n4higb.png)


Now go to **OAuth2** -> **URL Generator**, there will be a panel with the SCOPES label, check the bot scope, then a url will be generated, copy it, open a new tab and paste it, you will see something similar to the image below, select your server and then click the **Authorize** button.


![oauth tab](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gpp2m6bxewihlg3kae2a.png)


![adding the bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dd3yp2f871yalsu72ikt.png)

Finally the bot is in the server and we can start coding it.


![bot in the server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4w168dak6pz1bu8ku85b.png)


## 3. Coding our Bot <a name="coding-our-discord-bot"></a>

Let's start coding our bot, first let's create a **.env** file in our project root folder, lets add a BOT_TOKEN var and assign it the token we saved earlier in the previous section.

```
BOT_TOKEN = paste-the-token-here
```

Now in our index.js, import discord.js, axios and dotenv

```js
const axios = require("axios");
const Discord = require("discord.js");
require("dotenv").config();
```

Then create a client object from Discord Class using the Client constructor, we need to pass the intents like this.

```js
const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
  ],
});
```

Now we are going to make our bot online by using the *login* method and add a event listener, so that when the bot is ready it will pass a message through the console.

```js
client.on("ready", () => {
  console.log(`Hello my name is ${client.user.tag}!`);
});

client.login(process.env.BOT_TOKEN);
```

You should receive a message similar to this one.

```console
Hello my name is cryptocurrency-bot#0235!
```

![Bot online](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/syxcmoytib1rh88cb9u5.png)

## 4. Creating the bot commands <a name="creating-commands"></a>

For this example I will create only three commands, `!help` command to get all the available commands, a `!currencies` command to get all the supported currencies and a `!crypto_price` to get the price of the selected cryptocurrency in the desired currency.

- So let's start creating our **!help** command.

Let's use our client object with the event listener, it will be listening for **messageCreate** event that will be emitted whenever a message is created, and we are going to use async/await because we are going to make some HTTP requests to the Coingecko API.

Please be sure to read the documentation from [discord.js](https://discord.js.org/#/docs/discord.js/main/class/Client?scrollTo=e-messageCreate) and [discord](https://discord.com/developers/docs/topics/rpc#messagecreatemessageupdatemessagedelete)

With `msg.content` we can get what the text that the user sent, if the message is equals to `!help` then we will answer the user with the commands and a description of each one.

Embeds are a way to format our messages, you can read about it in the [documentation](https://discord.js.org/#/docs/builders/main/class/EmbedBuilder)

```js
client.on("messageCreate",  async (msg) => {
  if(msg.content === '!help'){
    const embed1 = new Discord.MessageEmbed()
      .setTitle("Command list")
      .setDescription(
        '**!help** - shows the command list \n\n' +
        '**!currencies** to get all the suppported currencies. \n\n' +
        '**!crypto_price** *<currencies>* *<cryptocurrencies>* to get the value of the cryptocurrency in another currency, to use it first type the **currency** and then the **cryptocurrency** e.g. (**!crypto_price usd bitcoin**), can also add more currencies and cryptos separating them with commas but without spaces e.g. (**!crypto_price usd,eur,btc bitcoin,ethereum**) \n\n'
      );

    msg.channel.send({ embeds: [embed1] });
  }
});
```

Now if you try the *!help* command you should get something similar to this:


![help command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qw3qv0i8crlzl4780git.png)


- Now let's create our **!currencies** command

Let's go back to our code and instead of if block lets create a switch block with the `msg.content` like this, and by the moment we are going to send `!currencies command` message when the user enters the *!currencies* command:

```js
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
      
      break;
  }
});
```

Let's code our *!currencies* command, delete this line `msg.channel.send('!currencies command')`, and first lets make a GET request to the [coingecko api](https://www.coingecko.com/en/api/documentation) and retrieve the supported currencies.

I used the map method to return each currency in italic and assign it to a constant named **curencies**, and created a new embed

```js
  const res = await axios.get("https://api.coingecko.com/api/v3/simple/supported_vs_currencies");

  const currencies = res.data.map((currency) => `*${currency}*`)

  const embed2 = new Discord.MessageEmbed()
    .setTitle("Supported Currencies")
    .setDescription(currencies.join(", "))
    .setColor("#0099ff")
    .setFooter("Powered by CoinGecko");

  msg.channel.send({ embeds: [embed2] });
```

If you try the command you will get this


![!currencies](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/navfnclg10u8qwbiq3d6.png)

Finally we will create the *!crypto_price* command

For this one as a user we will send a message like this `!crypto_price usd,eur bitcoin`, so we will split the string by spaces with `.split(' ')`. This should split the string into three parts, the first part will be the `!crypto_price`, second part `usd,eur` and third part `bitcoin`, so we will create two variables **currencies** and **cryptoCurrencies**, then we will assign the values respectively.

But to be able to get the words after !crypto_price we should use `msg.content.startsWith("!crypto_price")` otherwise we won't get the next words and the command won't work.

So before our `switch` block we will use an `if` block, if the message starts with !crypto_price then we will execute our command:

```js
client.on("messageCreate",  (msg) => {
  if (msg.content.startsWith("!crypto_price")) {

  } else {
    switch (msg.content) {
     .
     .
     .
    }
  }
});
```

So let's get **currencies** and the **cryptoCurrencies** by splitting the string.

We need to create a conditional in case the user enters the data incorrectly, or in case the user does not send any data in the command. if this is the case we need to send the user a message, in this case I want the user to remember how to use the command so I added an example.

Now we are going to make the GET request to the API, we also going to check if the object from the response is empty, if it's empty it's because there was a spelling error, or some of the data was misplaced. If this is the case we will answer again telling the user how to use the command.

We are getting the data like this.

```console
data: {
    bitcoin: { usd: 21816, eur: 20872 },
    ethereum: { usd: 1177.46, eur: 1126.54 }
  }
```

So I chose to use a *for loop* inside another *for loop* to manipulate the data, then used an embed again to format the text

```js
if (msg.content.startsWith("!crypto_price")) {
  const currencies = msg.content.split(" ")[1];
  const cryptoCurrencies = msg.content.split(" ")[2];

  if (cryptoCurrencies === undefined || currencies === undefined) {
    const embed = new Discord.MessageEmbed()
      .setTitle("Error")
      .setDescription("Please provide a currency and a cryptocurrency, remember to separate them with commas but without spaces e.g. (!crypto_price usd,eur bitcoin,ethereum)")
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
```

If you try **!crypto_price** command, you should get something like this


![!crypto_price command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jqms7rd18nuqeiktqoy9.png)


## 5. Deploying it to Heroku <a name="deploy-to-heroku"></a>

- we need to create a server

In case you want to deploy this app, we need to create a server, so let's install **express** with this command `npm I express` and create a server in our *index.js*

remember to create a **port** constant and assign this `process.env.PORT` to it (heroku will give us a port value)


```js
const express = require('express')

//initialization
const app = express()

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
```

- create an account

This is an easy step, just go to [Heroku](https://www.heroku.com/home) and click on **sign up**


![Heroku sign up](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bj79mpjg6ed93vnk7sir.png)

Fill the required fields and verify your account, then login and go to your apps and create a new one


![creating our app](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xw5v4bdbofwba0vgln74.png)

Choose a name for your new app and continue to the next part

-  install Heroku CLI

We are not going to ad a pipeline, so we can skip that part. Now for the deployment method I will use [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

![Heroku cli](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/df9woakszfyxgs2dt0ek.png)

I'll use `npm install -g heroku` to install it, then we need to open a terminal and type `heroku cli`, and you will see this message


![CLI message](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p6qj5h35pvk885e2uhma.png)

Now let's login by clicking the button in our browser

![heroku Login button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/spzsaqpritzqb9z2vidj.png)

- deploy

Now lets follow the steps below, **replace master by main** or won't let you `git push`

![deployment main -> master](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ruq0nghsjhg2zklkt2k6.png)


## 6. Conclusion <a name="conclusion"></a>

We learned how to make a cryptocurrency discord bot using **discord.js** and **node.js**.

I really hope you have been able to follow the post without any trouble, otherwise I apologize, please leave me your doubts or comments.

[You can contact me by telegram if you need to hire a Full Stack developer.](https://t.me/rtagliajs)

[You can also contact me by discord.](Appu#9136)

[You can clone the repo if you want.](https://github.com/rtagliaviaz/cryptocurrency-discord-bot)

Thanks for your time.
