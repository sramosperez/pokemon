document.addEventListener("DOMContentLoaded", () => {

  const divXML = document.getElementById("xml");
  const divFetch = document.getElementById("fetch");
  const divjQuery = document.getElementById("jquery");

  
  function init() {

    let randomIds= new Set();  //evita duplicados
   
    while(randomIds.size < 18){
    randomIds.add(Math.floor(Math.random()*897)+1);  
    }

    let pokemonIds = Array.from(randomIds); 

    //reparto los numeros aleatorios en 3 y hago las peticiones

    pokemonIds.slice(0,6).forEach(id => {
      getPokemonXML(`https://pokeapi.co/api/v2/pokemon/${id}`, divXML);
    })
   
    pokemonIds.slice(6,12).forEach(id =>{
      getPokemonFetch(`https://pokeapi.co/api/v2/pokemon/${id}`, divFetch);
    })
 
    pokemonIds.slice(12,18).forEach(id => {
      $.getJSON(`https://pokeapi.co/api/v2/pokemon/${id}`, function (data) {createPokemonCard(data, divjQuery)}); 
    })
}

  function getPokemonXML(url, div) {
    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.send();
    request.addEventListener("load", () => {
      let data = JSON.parse(request.responseText); //paso los datos aqui a JSON
      createPokemonCard(data, div);
    });
  }

  function getPokemonFetch(url, div) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        createPokemonCard(data, div);
      });
  }




  
  function createPokemonCard(data, div) {

    let card = document.createElement("div");

     //hay varios tipos asi que los recorro con un bucle 
     let types = "";
     for (let i = 0; i < data.types.length; i++) {
       types += data.types[i].type.name;
       if (i < data.types.length - 1) {
         types += ",";
       }
     }
    card.classList.add("carta");

    card.innerHTML=`
    <h4>${data.name.toUpperCase()}</h4>
    <img src="${data.sprites.front_default}">
    <p>Tipo: ${types}`;

    div.appendChild(card);

  }

  window.addEventListener("load", init);
});
