// Definir el arreglo para las divisas
const currency = [
  ['USD','D&oacute;lar',0],
  ['EUR','Euro',0],
  ['GBP','Libra',0],
  ['CNY','Yuan Chino',0],
]; // Divisas iniciales
const currenciesStart=currency.length; // Con cuántas divisas se inicia
const apik='03af175c1ab04913abc77a89118bf4cd'; // api key

function displayData(data) {
  if(data.rates) {
    let rates=data.rates;
    let currencyIndex=0;
    let oneId, oneValue, I;
    for(oneKey in Object.keys(rates)) {
      if(Object.keys(rates)[oneKey]!=='COP') {
        oneId=Object.keys(rates)[oneKey];
        oneValue=data.rates.COP/(rates[Object.keys(rates)[oneKey]]);
        oneValue=(oneValue).toFixed(2);
        I=currencyIndex+1;
        console.log(I+' '+oneId+' '+oneValue);
        currencyIndex++;
        document.getElementById('currency'+I).innerHTML=`
        <tr><td class="currencyname"${I}>${oneId}</td><td class="currencyvalue"${I}>${oneValue}</td></tr>
        `;
      }
    }
    // for(oneKey in Object.keys(rates)) {
    //   if(Object.keys(rates)[oneKey]!=='COP') {
    //     let oneValue=(rates[Object.keys(rates)[oneKey]])*data.rates.COP;
    //   } else if(Object.keys(rates)[oneKey]!=='COP') {
    //     let oneValue=data.rates.COP;
    //   }
    //   let I=currencyIndex+1;
    //   let oneCounter='currency'+(I);
    //   let oneId=Object.keys(rates)[oneKey];
    //   console.log(I+' '+oneId+' '+oneValue);
    //   currencyIndex=currencyIndex+1;
    //   document.getElementById("currency"+I).innerHTML = `
    //   <tr><td class="currencyname"${I}>${oneId}</td><td class="currencyvalue"${I}>${oneValue}</td></tr>
    //   `;
    // }
  }
  //   document.getElementById(oneId).innerHTML = `
  //   <tr><td class="${oneName}">${currency[i][0]} ${currency[i][1]}</td><td class="${oneValue}">Precio simulado ${I}</td></tr>
  //   `;  
}


function refreshCurrencies(theApiKey=apik) {
  // console.log("window.onload() -> refreshCurrencies("+apik+")");
  let currenciesSymbols='';
  let currenciesURL=`https://openexchangerates.org/api/latest.json?app_id=${apik}&symbols=`
  for(let i=0; i<currency.length; i++) {
      currenciesSymbols=currenciesSymbols+currency[i][0]+',';
  }
  currenciesSymbols=currenciesSymbols+'COP';
  currenciesURL=currenciesURL+currenciesSymbols;
  // console.log("currenciesURL="+currenciesURL);
 
  fetch(currenciesURL)
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    if(data.rates) {
      displayData(data);
    }
  })
  .catch(function(err) {
    console.log(err);
  });
}

// window.onload = refreshCurrencies(apik);
window.onload = function() {
  refreshCurrencies(apik);
}

// function status(resp) {
//   if(resp.status>=200 && resp.status <300) {
//     return Promise.resolve(resp);
//   } else {
//     return Promise.reject(new Error(resp.statusText));
//   }
// }
//
// function json(resp) {
//   return resp.json();
// }
