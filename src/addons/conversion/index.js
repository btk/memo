import React, { Component } from 'react';
import './style.css';
import API from '../../js/api';

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
              <svg className="AddonConfigure" viewBox="0 0 24 24" width="15" height="15">
                <path d="M9 4.58V4c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v.58a8 8 0 0 1 1.92 1.11l.5-.29a2 2 0 0 1 2.74.73l1 1.74a2 2 0 0 1-.73 2.73l-.5.29a8.06 8.06 0 0 1 0 2.22l.5.3a2 2 0 0 1 .73 2.72l-1 1.74a2 2 0 0 1-2.73.73l-.5-.3A8 8 0 0 1 15 19.43V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.58a8 8 0 0 1-1.92-1.11l-.5.29a2 2 0 0 1-2.74-.73l-1-1.74a2 2 0 0 1 .73-2.73l.5-.29a8.06 8.06 0 0 1 0-2.22l-.5-.3a2 2 0 0 1-.73-2.72l1-1.74a2 2 0 0 1 2.73-.73l.5.3A8 8 0 0 1 9 4.57zM7.88 7.64l-.54.51-1.77-1.02-1 1.74 1.76 1.01-.17.73a6.02 6.02 0 0 0 0 2.78l.17.73-1.76 1.01 1 1.74 1.77-1.02.54.51a6 6 0 0 0 2.4 1.4l.72.2V20h2v-2.04l.71-.2a6 6 0 0 0 2.41-1.4l.54-.51 1.77 1.02 1-1.74-1.76-1.01.17-.73a6.02 6.02 0 0 0 0-2.78l-.17-.73 1.76-1.01-1-1.74-1.77 1.02-.54-.51a6 6 0 0 0-2.4-1.4l-.72-.2V4h-2v2.04l-.71.2a6 6 0 0 0-2.41 1.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
              </svg>
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
