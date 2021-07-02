const criptomonedasSelect = document.querySelector('#criptomonedas')
const formulario = document.querySelector('#formulario')
const monedaSelect = document.querySelector('#moneda')
const resultado = document.querySelector('#resultado')


const objBusqueda = {
    moneda: '',
    criptomoneda : ''
}


document.addEventListener('DOMContentLoaded', () => {

    consultarCriptomonedas()

    formulario.addEventListener('submit', submitFormulario)

    criptomonedasSelect.addEventListener('change', leerValor )

    monedaSelect.addEventListener('change', leerValor )

})

// crear promise
const obtenerCriptomonedas = criptomonedas => new Promise (resolve => {
    resolve(criptomonedas)
})




function consultarCriptomonedas(){

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD'

    fetch(url)
    .then(respuesta => respuesta.json())
    .then (resultado => obtenerCriptomonedas(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas))

}


function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach (cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option')
        option.value = Name;
        option.innerHTML = FullName

        criptomonedasSelect.appendChild(option)
        
    })
}

function leerValor(e){

    objBusqueda[e.target.name] = e.target.value
   

}

function submitFormulario(e){
    e.preventDefault();

    // validar 

    const {moneda , criptomoneda } = objBusqueda

    if(moneda === '' || criptomoneda ===  ''){

        mostrarAlerta('Ambos campos son obligatorios')
        return
    }

    // Consultar API con los resultados

    consultarAPI()


}


function mostrarAlerta(msg) {

    const existeError = document.querySelector('.error')

    if(!existeError){

        const alerta = document.createElement('div')
    alerta.innerHTML = msg
    alerta.classList.add('error')

    formulario.appendChild(alerta)

    setTimeout(() => {
        alerta.remove();
    }, 3000);

    }
    
    

}



function consultarAPI() {

    const {moneda , criptomoneda } = objBusqueda
    mostrarSpinner()

    setTimeout(() => {
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

        fetch(url)
        .then( respuesta => respuesta.json())
        .then (cotizacion => imprimir(cotizacion.DISPLAY[criptomoneda][moneda]))



    },1000 )


    
}

function imprimir(valor) {
    limpiarHTML()
    const {  PRICE  , HIGHDAY , LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = valor


    const {moneda , criptomoneda } = objBusqueda
    divResultado = document.createElement('div')
    divResultado.classList.add('precio')
    divResultado.innerHTML = ` 
   <h2> El Precio de ${criptomoneda} es de : ${PRICE} </h2> 
   <p class="precio">  Precio mas alto del dia:  ${HIGHDAY}  </p>
   <p class="precio">  Precio mas bajo del dia : ${LOWDAY}  </p>
   <p class="precio">  Cambio en 24H : ${CHANGEPCT24HOUR}%  </p>
   
   `
  
    resultado.appendChild(divResultado)



}

function limpiarHTML() {

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}


function mostrarSpinner() {

    limpiarHTML() 

    const spinner = document.createElement('div')
    

    spinner.innerHTML = ` <div class="spinner"></div>
    
    
    `

    resultado.appendChild(spinner)


}