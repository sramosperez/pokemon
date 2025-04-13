document.addEventListener("DOMContentLoaded", () => {
  const divP1 = document.getElementById("player1");
  const divP2 = document.getElementById("player2");
  const divP3 = document.getElementById("player3");
  const btnIniciar = document.getElementById("iniciar");
  const btnBattle = document.getElementById("batalla");

  btnIniciar.addEventListener("click", iniciar);
  btnBattle.addEventListener("click", compareStats);

  //bandera que controla el comienzo de partida
  let game = false;

  let cardSelectedP1;
  let cardSelectedP2;
  let cardSelectedP3;

  let cardsP1=[];
  let cardsP2=[];
  let cardsP3=[];


  function iniciar() {
    if (!game) {
      let randomIds = new Set(); //evita duplicados

      while (randomIds.size < 18) {
        randomIds.add(Math.floor(Math.random() * 897) + 1);
      }
      let pokemonIds = Array.from(randomIds);

      //reparto los numeros aleatorios en 3 y hago las peticiones
      pokemonIds.slice(0, 6).forEach((id) => {
        getPokemonXML(`https://pokeapi.co/api/v2/pokemon/${id}`, divP1);
      });
      pokemonIds.slice(6, 12).forEach((id) => {
        getPokemonFetch(`https://pokeapi.co/api/v2/pokemon/${id}`, divP2);
      });
      pokemonIds.slice(12, 18).forEach((id) => {
        $.getJSON(`https://pokeapi.co/api/v2/pokemon/${id}`, function (data) {
          createPokemonCard(data, divP3);
        });
      });
      game = true;
    } else {
      alert("Ya hay una partida en juego.");
    }
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

    //asgino las estadisticas para luego usarlas en la comparacion

    card.hp = data.stats[0].base_stat;
    card.attack = data.stats[1].base_stat;
    card.defense = data.stats[2].base_stat;

    card.classList.add("carta");

    card.innerHTML = `
        <h4>${data.name.toUpperCase()}</h4>
        <img src="${data.sprites.front_default}">
        <p>HP: ${card.hp}</p>
        <p>Ataque: ${card.attack}</p>
        <p>Defensa: ${card.defense}</p>`;
    div.appendChild(card);

    //añado las cartas cada una a su array
    
    if (div === divP1){
      cardsP1.push(card);
    }else if( div === divP2){
      cardsP2.push(card);
    }else if ( div === divP3){
      cardsP3.push(card);
    }
    
  }

  function compareStats(){

    if (cardSelectedP1 && cardSelectedP2 && cardSelectedP3) {

     cardsP1.forEach((card) => card.classList.remove("ganadora"));
     cardsP2.forEach((card) => card.classList.remove("ganadora"));
     cardsP3.forEach((card) => card.classList.remove("ganadora"));

      
      const statsP1 = cardSelectedP1.hp + cardSelectedP1.attack + cardSelectedP1.defense;
      const statsP2 = cardSelectedP2.hp + cardSelectedP2.attack + cardSelectedP2.defense;
      const statsP3 = cardSelectedP3.hp + cardSelectedP3.attack + cardSelectedP3.defense;

      let cardWinner;

      // Compara las estadísticas y determina al ganador
      if (statsP1 > statsP2 && statsP1 > statsP3) {
        cardWinner = cardSelectedP1;
      } else if (statsP2 > statsP1 && statsP2 > statsP3) {
        cardWinner = cardSelectedP2;
      } else if (statsP3 > statsP1 && statsP3 > statsP2) {
        cardWinner = cardSelectedP3;
      }

      if (cardWinner) {
        cardWinner.classList.add("ganadora");
        cardWinner.classList.remove("seleccion")
      }

      // Elimina la carta del array y del DOM si el jugador pierde
      if (cardWinner !== cardSelectedP1) {
        cardsP1.shift();
        cardSelectedP1.remove();
      }
      if (cardWinner !== cardSelectedP2) {
        cardsP2.shift();
        cardSelectedP2.remove();
      }
      if (cardWinner !== cardSelectedP3) {
        cardsP3.shift();
        cardSelectedP3.remove();
      }

      // **Restablece las cartas seleccionadas** para que los jugadores puedan seleccionar una nueva carta si quedan
      cardSelectedP1 = null;
      cardSelectedP2 = null;
      cardSelectedP3 = null;
    } else {
      alert("Todos los jugadores deben seleccionar una carta.");
    }
  
  
  }




  //eventos que controlan el seleccionar carta
  divP1.addEventListener("click", (event) => {
    let card = event.target.closest(".carta");
    if (card && !cardSelectedP1) {
      card.classList.add("seleccion");
      cardSelectedP1 = card;
    }
  });
  divP2.addEventListener("click", (event) => {
    let card = event.target.closest(".carta");
    if (card && !cardSelectedP2) {
      card.classList.add("seleccion");
      cardSelectedP2 = card;
    }
  });
  divP3.addEventListener("click", (event) => {
    let card = event.target.closest(".carta");
    if (card && !cardSelectedP3) {
      card.classList.add("seleccion");
      cardSelectedP3 = card;
    }
  });




});
