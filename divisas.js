// Definir el arreglo para las divisas
const currency = [
  ['USD','D&oacute;lar',0],
  ['EUR','Euro',0],
  ['GBP','Libra',0],
  ['CNY','Yuan&nbsp;Chino',0],
]; // Divisas iniciales
const currenciesStart=currency.length; // Con cuántas divisas se inicia
const apik='03af175c1ab04913abc77a89118bf4cd'; // api key

/** listAllCurrencies()
  * esta función toma los datos que vienen de OpenExchange rates para armar la lista de adicionales
  */
function listallCurrencies() {
  let allCurrenciesSymbols='';
  let allCurrenciesURL=`https://openexchangerates.org/api/currencies.json?app_id=${apik}` // Armar el URL de la API

  fetch(allCurrenciesURL)
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    if(data) {
      updateAllCurrenciesList(data);
    }
  })
  .catch(function(err) {
    console.log(err);
  }); // Se invoca la API según se investigó  
}

/** updateAllCurrenciesList()
  * crea la lista de todas las monedas disponibles
  */
function updateAllCurrenciesList(currList) {
  let formCurrencySelect=document.getElementById("addCurrency");     // Apuntador al menú de selección
  for(oneKey in currList) {
    switch(oneKey) {
      case 'COP':                                                    // Ya están, no se agregan
      case 'USD':                                                    // Ya están, no se agregan
      case 'EUR':                                                    // Ya están, no se agregan
      case 'GBP':                                                    // Ya están, no se agregan
      case 'CNY':                                                    // Ya están, no se agregan
        break;
      default:
        let oneOption = document.createElement("option");
        oneOption.value=oneKey;
        oneOption.innerHTML=currList[oneKey];
        formCurrencySelect.append(oneOption);
    } // switch(oneKey)
  } // for(oneKey in currList)  
} // updateAllCurrenciesList

/** displayData()
  * esta función toma los datos que vienen de OpenExchangeRates en el atributo rates y los pone en las celdas
  * de la tabla. Toma el valor del dolar en pesos y lo usa para calcular el valor final de las otras divisas
  */
function displayData(data) {
  if(data.rates) { // Solo si lo que viene de afuera es válido
    let rates=data.rates;
    let currencyIndex=0; // en el JSON vienen las divisas contando de 0, pero la tabla cuenta de 1
    let oneId, oneValue, I, currencyLabel;
    for(oneKey in Object.keys(rates)) {
      if(Object.keys(rates)[oneKey]!=='COP') {                       // usa el valor COP para calcular lo demás
        oneId=Object.keys(rates)[oneKey];
        oneValue=data.rates.COP/(rates[Object.keys(rates)[oneKey]]); // Convierte a pesos usando la tasa del COP
        oneValue=(oneValue).toFixed(2);                              // Usa solo dos decimales
        I=currencyIndex+1;
        console.log(I+' '+oneId+' '+oneValue);
        currencyLabel=Object.keys(rates)[oneKey];                    // Inicialize con el ID
        currency.forEach(curr => {                                  // Trate de buscar si tenemos el texto
          if(curr[0]===Object.keys(rates)[oneKey]) {
            currencyLabel=curr[1];                                   // si el id de la moneda es, copie el texto de la moneda
          } // if(curr==Object...[oneKey])
        }); // forEach(curr ...)
        document.getElementById('currency'+I).innerHTML=`
        <td class="currencyname${I}">${currencyLabel}</td><td class="currencyvalue${I}">COP$ ${oneValue}</td>
        `;                                                           // Actualiza el precio de la celda
        currencyIndex++;
      } // if(Object.keys())
    } // for(oneKey in Object.keys)
    // Agregar una fila para la forma de selección de divisa adicional
    let tablaDivisas=document.getElementById("tabladivisas");        // Apuntador a la tabla
    let filasTablaDivisas=tablaDivisas.rows.length;                  // Cuántas filas tiene la tabla
    let nuevaFila=tablaDivisas.insertRow(-1);                        // Intenta agregar una fila antes de la última
    let nuevaFilaCeldaIzq=nuevaFila.insertCell(0);                   // Intenta agregar la celda izquierda
    let nuevaFilaCeldaDer=nuevaFila.insertCell(1);                   // Intenta agregar la celda derecha
    let numNuevaFila=filasTablaDivisas-1;
    nuevaFilaCeldaIzq.innerHTML=`<td class="currencyname"${numNuevaFila}>Nueva Divisa</td>`;
    nuevaFilaCeldaDer.innerHTML=`<td class="currencyvalue"${numNuevaFila}>
    <form method="post" action="divisas.html">
    <select name="addCurrency" id="addCurrency">
    </select>
    <input type="hidden" name="currCurrencies" value="">
    <input type="submit" name="add" value="Agregar">
    </form>
    </td>`;
    // Agregar una fila para la forma de selección de divisa adicional
    listallCurrencies();
  } // if(data.rates)
} // function displayData()

/** refresCurrencues()
  * esta función se conecta a OpenExchangeRates y usa la API para traer los valores. Devuelve un JSON donde
  * el campo o registro 'rates' es la lista de nombres y precios de divisas
  * si funciona invoca displayData. Recibe la key que se obtiene en OpenExchangeRates
  */
function refreshBaseCurrencies(theApiKey=apik) {
  // console.log("window.onload() -> refreshCurrencies("+apik+")");
  let currenciesSymbols='';
  let currenciesURL=`https://openexchangerates.org/api/latest.json?app_id=${apik}&symbols=` // Armar el URL de la API
  for(let i=0; i<currency.length; i++) {
      currenciesSymbols=currenciesSymbols+currency[i][0]+',';
  } // Arma el URL usando el arreglo currency global de arriba. Así es variable.
  currenciesSymbols=currenciesSymbols+'COP'; // Se agrega COP para tener para calcular en pesos
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
  }); // Se invoca la API según se investigó
} // function refreshCurrencies()

// Se hace que la ventana apenas cargue refresque los precios de las divisas usando la API
window.onload = function() {
  refreshBaseCurrencies(apik);
}
