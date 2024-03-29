require('dotenv').config();

const { Client }= require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();


const bot =  new Client();

bot.login(process.env.token);
bot.on('ready',() => {
    console.log(`${bot.user.username} is up and running!`);
});


bot.on('message',async(message) => {
    if(message.author.bot) return;

    if(message.content.startsWith('!ping')){
        return message.reply('i am working');
    }
    // Reply to !help
    if (message.content.startsWith('!help')) {
    return message.reply(
      `I support 4 commands:\n
      !ping - To check if I am working\n
      !price <coin_name> <compare_currency> - To get the price of a coin with respect to another coin or currency\n
      !news - To get the latest news article related to crypto\n
      !help - For checking out what commands are available`
         ); 
     }


    if(message.content.startsWith('!news')){
        try{
            const{data} = await axios.get(
                `https://newsapi.org/v2/everything?q=crypto&from=2021-06-12&to=2021-06-12&sortBy=popularity&apiKey=${process.env.NEWSAPI}`
            );

            //structure
            const{
                title,
                source:{ name },
                description,
                url,
            }=data.articles[0];

            return message.reply(
                `Latest news related to crypto:\n
                Title: ${title}\n
                Description:${description}\n
                Source: ${name}\n
                Link to full article: ${url}`
            );            
        }catch (err){
            return message.reply('There was an error .Please try again');
        }
    }
});

bot.on('message',async(message)=> {
    // Reply to !price
  if (message.content.startsWith('!price')) {
    // Get the params
    const [command, ...args] = message.content.split(' ');

    // Check if there are two arguments present
    if (args.length !== 2) {
      return message.reply(
        'You must provide the crypto and the currency to compare with!'
      );
    } 
    else {
      const [coin, vsCurrency] = args;
      try {
        // Get crypto price from coingecko API
        const { data } = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrency}`
        );

        // Check if data exists
        if (!data[coin][vsCurrency]) throw Error();

        return message.reply(
          `The current price of 1 ${coin} = ${data[coin][vsCurrency]} ${vsCurrency}`
        );
      } catch (err) {
        return message.reply(
          'Please check your inputs. For example: !price bitcoin usd'
        );
      }
    }
}
});
  