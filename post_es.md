En este post aprenderemos a crear un bot de discord para obtener el valor de criptomonedas en moneda local, para eso estaremos usando la [API de Coingecko](https://www.coingecko.com/en/api).
 
En caso de que te interese aprender a realizar el mismo bot para Telegram has clic [aqui](https://dev.to/rtagliavia/how-to-make-a-cryptocurrency-telegram-bot-with-node-and-telegraf-4572).
 
[Me puedes contactar por telegram en caso de que necesites un Full Stack developer o si necesitas un bot de discord para tu servidor](https://t.me/rtagliajs).
 
También puedes agregarme a discord como **Appu#9136**.
 
Te dejo el [repo](https://github.com/rtagliaviaz/cryptocurrency-discord-bot) del proyecto en caso de que quieras clonarlo.

 
## Prerrequisitos
 
- [Node.js](https://nodejs.org/en/download/) instalado
- Una cuenta de Discord
 
 
## Creación del proyecto
 
1. Abre la consola y escribe los siguientes comandos.
 
```console
$ mkdir node-telegram-tut
$ cd node-telegram-tut
$ npm init --y
```
 
2. Abre el proyecto con tu editor de código de preferencia.
 
 
## Dependencias
 
- axios
- dotenv
- discord.js
 
Para instalar las dependencias abriremos la consola y nos ubicamos en la carpeta del proyecto, y luego escribiremos los siguientes comandos.
 
 
```console
$ npm i axios dotenv discord.js
```
 
Abriremos el archivo **package.json** y agregaremos esto.
 
```json
  "scripts": {
    "start": "node ./src index.js"
  },
```
 
 
## Estrucutra del proyecto

cryptocurrency-discord-bot/
├── node_modules/
├── src/
│   └── index.js
├── .env
└── package.json


## Tabla de Contenido
 
1. [Creación de nuestro servidor de Discord](#create-discord-server)
2. [Creación del bot y añadirlo a nuestro servidor](#discord-bot-token)
3. [Programando nuestro bot](#coding-our-discord-bot)
4. [Comandos del bot](#creating-commands)
5. [Conclusión](#conclusion)
 
---
 

## 1. Creación de nuestro servidor de Discord <a name="create-discord-server"></a>
 
Para poder probar nuestro bot, primero debemos crear un servidor de discord, para eso debemos seguir los siguientes pasos.
 
- Abriremos Discord.
- Haremos clic en el botón de **+** en la parte inferior izquierda.
- Seleccionaremos **Crear un servidor** y seleccionaremos la opción **para mi y mis amigos**.
 
![New server button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4v89q29k9iic8qp82jnd.png)
 
![create server option](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6dc59wszee1t66t2slgl.png)
 
Después de crear el servidor, haremos clic en el icono de engranaje para abrir los *ajustes de usuario*, luego haremos clic en la opción *Avanzado*, y activamos el **modo desarrollador**.
 
![Developer mode](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fh7dfxqp4j51c0dxv9bh.png)
 

## 2. Creacion del bot y añadirlo a nuestro servidor <a name="discord-bot-token"></a>
 
Abriremos nuestro explorador y nos dirigiremos a [Discord Developer Portal](https://discord.com/developers/applications), y haremos clic donde dice **Applications**, luego haremos clic en **New Application**, nos mostrara un *modal* donde podremos elegir el nombre de nuestra nueva aplicación.
 
![Create a new discord application](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rbdumxoo46bcg399fs4n.png)
 
Ahora en el panel izquierdo hacemos clic en **Bot** y luego en **Add Bot**. En esta parte podremos elegir el nombre y el icono que tendrá nuestro bot, abajo veremos el **token**, lo vamos a copiar y guardar en un archivo de texto, ya que lo necesitaremos más adelante.
 
![bot tab](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q9mtd7j7uokhdw6qxcya.png)
 
 
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ejf53xwz5qx38jm674p8.png)
 
Deslizamos hacia abajo y haremos clic en *Privileged Gateway Intents*, aquí tildamos algunos *intents* para que se nos haga posible interactuar con nuestro bot.
 
![discord intents](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g1o6zu0rraoq02n4higb.png)
 
Ahora iremos a **OAuth2** -> **URL Generator**, encontraremos un panel con la etiqueta **SCOPES**, tildamos donde dice **bot** y se generará una URL, la copiaremos y la pegaremos en una nueva pestaña de nuestro explorador.
 
Podremos observar algo similar a la imagen de abajo, ahora seleccionaremos nuestro servidor y haremos clic en el boton **Authorize**.
 
![oauth tab](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gpp2m6bxewihlg3kae2a.png)
 
 
![adding the bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dd3yp2f871yalsu72ikt.png)
 
Finalmente podremos ver que el bot esta en nuestro servidor, ahora podemos emepzar a programarlo.
 
 
![bot in the server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4w168dak6pz1bu8ku85b.png)
 

## 3. Programando nuestro Bot <a name="coding-our-discord-bot"></a>
 
Empezaremos a programar nuestro bot, primero crearemos un archivo **.env** en la raíz de nuestro proyecto, agregaremos una variable de entorno llamada **BOT_TOKEN** y le asignaremos el token que guardamos en la sección anterior.
 
```js
BOT_TOKEN = colocar-el-token-aqui
```
 
Ahora iremos a *index.js*, y vamos a importar los discord.js, axios y dotenv.
 
```js
const axios = require("axios");
const Discord = require("discord.js");
require("dotenv").config();
```
 
Luego crearemos un objeto client desde la clase Discord utilizando el constructor Client, y pasaremos los intents de la siguiente manera.
 
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
 
Ahora haremos que nuestro bot aparezca online usando el método *login* y agregaremos un event listener para que nos muestre un mensaje en la consola cuando el bot esté listo.
 
 
```js
client.on("ready", () => {
  console.log(`Hello my name is ${client.user.tag}!`);
});
 
client.login(process.env.BOT_TOKEN);
```
 
Deberíamos obtener un mensaje como este.
 
```console
Hello my name is cryptocurrency-bot#0235!
```
 
![Bot online](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/syxcmoytib1rh88cb9u5.png)
 
 
## 4. Creando los comandos de nuestro bot <a name="creating-commands"></a>
 
Para este ejemplo solo creare tres comandos.
 
- *!help* para obtener un listado de todos los comandos asi como una descripción.
- *!currencies* para obtener todas las monedas disponibles.
- *!crypto_price* para obtener el precio de la criptomoneda en la moneda deseada.
 
#### 1. Empecemos creando nuestro comando **!help**.
 
Usaremos el objeto cliente con el escuchador de eventos, estaremos escuchando el evento **messageCreate** que se emitirá cada vez que un mensaje sea creado, y usaremos async/await porque estaremos haciendo peticiones HTTP a la API de Coingecko.
 
Por favor asegurate de leer la documentación de [discord.js](https://discord.js.org/#/docs/discord.js/main/class/Client?scrollTo=e-messageCreate) y [discord](https://discord.com/developers/docs/topics/rpc#messagecreatemessageupdatemessagedelete)
 
Con `msg.content` podremos obtener el texto que envió el usuario, si el mensaje es igual a `!help` entonces responderemos al usuario con los comandos y la descripción de cada uno.
 
Los *Embeds* son una manera de darle formato y estilos a nuestro a mensajes, puedes encontrar mas informacion en la [documentación](https://discord.js.org/#/docs/builders/main/class/EmbedBuilder)
 
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
 
Ahora si probamos nuestro comando *!help* obtendremos algo similar a esto.
 
 
![help command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qw3qv0i8crlzl4780git.png)
 
 
### 2. Sigamos con nuestro comando **!currencies**.
 
Volvamos a nuestro codigo, y en lugar de un bloque if, usaremos un bloque switch con `msg.content` de esta manera, y de momento solo enviamos un mensaje que diga *!currencies command* cuando el usuario escriba *!currencies*.
 
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
      msg.channel.send('!currencies command')
      break;
  }
});
```
 
Ahora borraremos esta linea `msg.channel.send('!currencies command')`, y haremos una petición GET a la [API de Coingecko](https://www.coingecko.com/en/api/documentation) y obtendremos todas las monedas disponibles.
 
Utilice el método map para obtener cada moneda en cursiva y luego asignarla a una constante llamada **currencies**, luego cree un nuevo embed.
 
 
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
 
Ahora si probamos el comando *!currencies* obtendremos esto.
 
![!currencies](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/navfnclg10u8qwbiq3d6.png)
 
 
#### 3. Por último el comando *!crypto_price*.
 
Para este comando el usuario enviará un mensaje como este `!crypto_price usd,eur bitcoin`, por lo que debemos separar el string por espacios con `.split(' ')`. Esto va a separar el string en tres partes.
 
- La primera parte será `!crypto_price`.
- La segunda parte será `usd,eur`.
- La tercera parte será `bitcoin`.
 
Crearemos dos variables, una llamada **curencies** y otra llamada **cryptoCurrencies* y asignaremos a cada una los valores correspondientes.
 
Para obtener las palabras después de !crypto_proce debemos hacer uso de `msg.content.startsWith("!crypto_price")` de otra manera el comando no funcionará.
 
Antes del bloque `switch` usaremos un bloque `if`, si el mensaje empieza con `!crypto_price` entonces ejecutaremos nuestro comando:
 
 
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
 
Ahora asignamos los valores respectivos de **currencies** y **cryptoCurrencies**separando el string.
 
Necesitamos crear una condicional en caso de que el usuario coloque los datos de forma incorrecta, o en caso de que el usuario no coloque ningún dato en el comando. Si este es el caso necesitamos enviar un mensaje al usuario, en este caso enviaremos un mensaje al usuario para que recuerde cómo hacer uso del comando.
 
Ahora haremos una petición GET a la API, además debemos chequear si el objeto que recibimos de la respuesta no este vacío, en caso de estarlo es por algun dato fue escrito de forma incorrecta, en este caso enviaremos nuevamente el mismo mensaje al usuario para que haga uso adecuado del comando.
 
 
Obtendremos los datos de la siguiente manera.
 
 
```console
data: {
    bitcoin: { usd: 21816, eur: 20872 },
    ethereum: { usd: 1177.46, eur: 1126.54 }
  }
```
 
usaremos un *for loop* dentro de otro *for loop* para manipular los datos, luego usaremos un embed para darle formato al texto.
 
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
 
Si intentamos usar **!crypto_price** obtendremos algo similar a esto.
 
 
![!crypto_price command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jqms7rd18nuqeiktqoy9.png)
 

## 5. Conclusión <a name="conclusion"></a>
 
En este post aprendimos a crear un bot de criptomonedas para discord, utilizando **discord.js** y **node.js**.
 
Realmente espero que hayas podido llegar hasta aquí, en caso de que hayas tenido algún problema por favor no dudes en ponerte en contacto o dejar un comentario.
 
Puedes contactarme a traves de [Telegram](https://t.me/rtagliajs) o puedes encontrarme en Discord como **Appu#9136**.
 
 
Gracias por tu tiempo.