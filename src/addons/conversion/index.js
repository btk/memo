import React, { Component } from 'react';
import './style.css';
import API from '../../js/api';

const cog = require("./icon-cog.svg");
const addon = require("./addon.json");

const DEFAULT_CURRENCY = "try";
const DEFAULT_CURRENCY_SYMBOL = "₺";

let currencies = [
  {
    ticker: "usd",
    symbol: "$",
    usdFactor: 1
  },{
    ticker: "eur",
    symbol: "€",
    usdFactor: 0.91
  },
  {
    ticker: "try",
    symbol: "₺",
    usdFactor: 5.85
  },
  {
    ticker: "cad",
    symbol: "c$",
    usdFactor: 1.33
  }
];

API.getConversions().then(conv => {
  currencies = [
    {
      ticker: "usd",
      symbol: "$",
      usdFactor: 1
    },{
      ticker: "eur",
      symbol: "€",
      usdFactor: Number(conv.rates["EUR"]).toFixed(2)
    },
    {
      ticker: "try",
      symbol: "₺",
      usdFactor: Number(conv.rates["TRY"]).toFixed(2)
    },
    {
      ticker: "cad",
      symbol: "c$",
      usdFactor: Number(conv.rates["CAD"]).toFixed(2)
    }
  ];
});


let toArray = [];
currencies.forEach(currency1 => {
  currencies.forEach(currency2 => {
    if(currency1 != currency2){
      toArray.push(`${currency1.ticker} to ${currency2.ticker}`);
    }
  });
});

let inArray = [];
currencies.forEach(currency1 => {
  currencies.forEach(currency2 => {
    if(currency1 != currency2){
      inArray.push(`${currency1.ticker} in ${currency2.ticker}`);
    }
  });
});

class App extends Component {
  state = {
    text: ""
  }

  componentDidMount(){
    API.event.on("lineFocused", (line) => {
      this.setState({
        text: line.text,
        lineId: line.lineId,
        index: line.index
      });
    });

    API.event.on("lineChanged", (text) => {
      if(currencies.some((curr) => text.includes(curr.ticker) || text.includes(curr.symbol))){
        this.setState({text});
      }
    });
  }

  parseConversion(text){
    if (text.length < 6){
      return;
    }
    let parseableArray = [];
    text = text.toLowerCase();
    inArray.forEach((inText, i) => {
      text = text.replace(new RegExp(inText, 'g'), toArray[i]);
    });

    let i = 0;
    while(i < toArray.length){
      if(text.includes(toArray[i])){
        let splittedParser = text.split(toArray[i]);
        let j = 0;
        while (j < splittedParser.length - 1) {

          let splittedSpace = splittedParser[j].trim().split(/\s+/);
          let amount = 0;
          if(splittedSpace[splittedSpace.length - 1]){
            let numberString = splittedSpace[splittedSpace.length - 1].replace(",", ".");

            if(numberString.split(".")[1]){
              if(numberString.split(".")[1].length == 3){
                numberString = numberString.replace(".", "");
              }
            }
            amount = Number(numberString);
          }else{
            let numberString = splittedSpace[splittedSpace.length - 2].replace(",", ".");

            if(numberString.split(".")[1]){
              if(numberString.split(".")[1].length == 3){
                numberString = numberString.replace(".", "");
              }
            }
            amount = Number(numberString);
          }
          if(amount && !isNaN(amount) && amount != 0){
            parseableArray.push({amount: amount, from: toArray[i].split(" to ")[0].toLowerCase(), to: toArray[i].split(" to ")[1].toLowerCase()});
          }

          j++;
        }
      }
      i++;
    }

    toArray.forEach((toText, i) => {
      text = text.replace(new RegExp(toText, 'g'), "");
    });
    i = 0;

    while(i < currencies.length){
      if(text.includes(currencies[i].ticker) && currencies[i].ticker != DEFAULT_CURRENCY){
        let splittedParser = text.split(currencies[i].ticker);
        let j = 0;
        while (j < splittedParser.length - 1) {
          let splittedSpace = splittedParser[j].trim().split(/\s+/);
          let amount = 0;
          if(splittedSpace[splittedSpace.length - 1]){
            let numberString = splittedSpace[splittedSpace.length - 1].replace(",", ".");

            if(numberString.split(".")[1]){
              if(numberString.split(".")[1].length == 3){
                numberString = numberString.replace(".", "");
              }
            }
            amount = Number(numberString);
          }else{
            let numberString = splittedSpace[splittedSpace.length - 2].replace(",", ".");

            if(numberString.split(".")[1]){
              if(numberString.split(".")[1].length == 3){
                numberString = numberString.replace(".", "");
              }
            }
            amount = Number(numberString);
          }
          if(amount && !isNaN(amount) && amount != 0){
            parseableArray.push({amount: amount, from: currencies[i].ticker, to: DEFAULT_CURRENCY});
          }
          j++;
        }
      }
      i++;
    }

    i = 0;
    while(i < currencies.length){
      if(text.includes(currencies[i].symbol) && currencies[i].symbol != DEFAULT_CURRENCY_SYMBOL){
        let splittedParser = text.split(currencies[i].symbol);
        console.log(splittedParser);
        let j = 1;
        while (j < splittedParser.length) {
          let splittedSpace = splittedParser[j].trim().split(/\s+/);
          let amount = 0;
          if(splittedSpace[0]){
            let numberString = splittedSpace[0].replace(",", ".");

            if(numberString.split(".")[1]){
              if(numberString.split(".")[1].length == 3){
                numberString = numberString.replace(".", "");
              }
            }
            amount = Number(numberString);
          }else if(splittedSpace[1]){
            let numberString = splittedSpace[1].replace(",", ".");

            if(numberString.split(".")[1]){
              if(numberString.split(".")[1].length == 3){
                numberString = numberString.replace(".", "");
              }
            }
            amount = Number(numberString);
          }
          if(amount && !isNaN(amount) && amount != 0){
            parseableArray.push({amount: amount, from: currencies[i].ticker, to: DEFAULT_CURRENCY});
          }
          j++;
        }
      }
      i++;
    }

    return parseableArray.map((conversion, i) => {
      return (
        <div className="conversionNode" key={i}>{String(conversion.amount).replace(".", ",")} {conversion.from.toUpperCase()} = {(conversion.amount / currencies.filter(c => c.ticker == conversion.from)[0].usdFactor * currencies.filter(c => c.ticker == conversion.to)[0].usdFactor).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} {conversion.to.toUpperCase()}</div>
      );
    });
  }

  render() {
    if(this.state.text){
      let parsed = this.parseConversion(this.state.text);
      if(parsed.length){
        return (
          <>
            <div className="AddonItem">
              <img className="AddonConfigure" src={cog} width={16} height={16}/>
              <h5>{addon.display}</h5>
              <p>{parsed}</p>
            </div>
          </>
        );
      }else{
        return null;
      }
    }else{
      return null;
    }
  }
}

export default App;
