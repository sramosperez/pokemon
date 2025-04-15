document.addEventListener("DOMContentLoaded", () => {
  const playerDiv1 = document.getElementById("player1");
  const playerDiv2 = document.getElementById("player2");
  const playerDiv3 = document.getElementById("player3");
  const startButton = document.getElementById("iniciar");
  const battleButton = document.getElementById("batalla");

  startButton.addEventListener("click", initGame);
  battleButton.addEventListener("click", compareStats);

  //bandera que controla el comienzo de partida
  let isGame = false;

  let cardSelectedP1;
  let cardSelectedP2;
  let cardSelectedP3;

  let cardsP1 = [];
  let cardsP2 = [];
  let cardsP3 = [];

  function initGame() {
    if (!isGame) {
      let randomIds = new Set(); //evita duplicados

      while (randomIds.size < 18) {
        randomIds.add(Math.floor(Math.random() * 897) + 1);
      }
      let pokemonIds = Array.from(randomIds);

      //reparto los numeros aleatorios en 3 y hago las peticiones
      pokemonIds.slice(0, 6).forEach((id) => {
        getPokemonXML(`https://pokeapi.co/api/v2/pokemon/${id}`, playerDiv1);
      });
      pokemonIds.slice(6, 12).forEach((id) => {
        getPokemonFetch(`https://pokeapi.co/api/v2/pokemon/${id}`, playerDiv2);
      });
      pokemonIds.slice(12, 18).forEach((id) => {
        $.getJSON(`https://pokeapi.co/api/v2/pokemon/${id}`, function (data) {
          createPokemonCard(data, playerDiv3);
        });
      });
      isGame = true;
    } else {
      alert("Ya hay una partida en curso.");
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

    //asgino las estadisticas para luego usarlas en la batalla
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

    if (div === playerDiv1) {
      cardsP1.push(card);
    } else if (div === playerDiv2) {
      cardsP2.push(card);
    } else if (div === playerDiv3) {
      cardsP3.push(card);
    }
  }

  function compareStats() {
    //verifico que los jugadores con cartas han seleccionado una carta
    if (
      (cardsP1.length == 0 || cardSelectedP1) &&
      (cardsP2.length == 0 || cardSelectedP2) &&
      (cardsP3.length == 0 || cardSelectedP3)
    ) {
      //limpio los estilos
      cardsP1.forEach((card) => card.classList.remove("ganadora"));
      cardsP2.forEach((card) => card.classList.remove("ganadora"));
      cardsP3.forEach((card) => card.classList.remove("ganadora"));

      //tomo como referencia el valor del ataque y la defensa, si no tiene cartas asigno 0
      const statsP1 = cardsP1.length > 0 ? cardSelectedP1.attack + cardSelectedP1.defense : 0;
      const statsP2 = cardsP2.length > 0 ? cardSelectedP2.attack + cardSelectedP2.defense : 0;
      const statsP3 = cardsP3.length > 0 ? cardSelectedP3.attack + cardSelectedP3.defense : 0;

      let maxStats = Math.max(statsP1, statsP2, statsP3);
      let cardWinner;

      // Compara y determina al ganador
      if (statsP1 == maxStats && cardsP1.length > 0) {
        cardWinner = cardSelectedP1;
      } else if (statsP2 == maxStats && cardsP2.length > 0) {
        cardWinner = cardSelectedP2;
      } else if (statsP3 == maxStats && cardsP3.length > 0) {
        cardWinner = cardSelectedP3;
      }

      //añade o quita las clases
      if (cardWinner) {
        cardWinner.classList.add("ganadora");
        cardWinner.classList.remove("seleccion");
      }

      // Elimina la carta del array buscandola por el indice y del DOM si el jugador pierde
      if (cardWinner !== cardSelectedP1 && cardSelectedP1) {
        let indexP1 = cardsP1.indexOf(cardSelectedP1);
        cardsP1.splice(indexP1, 1);
        cardSelectedP1.remove();
      }
      if (cardWinner !== cardSelectedP2 && cardSelectedP2) {
        let indexP2 = cardsP2.indexOf(cardSelectedP2);
        cardsP2.splice(indexP2, 1);
        cardSelectedP2.remove();
      }
      if (cardWinner !== cardSelectedP3 && cardSelectedP3) {
        let indexP3 = cardsP3.indexOf(cardSelectedP3);
        cardsP3.splice(indexP3, 1);
        cardSelectedP3.remove();
      }

      //Restablece las cartas seleccionadas para que los jugadores puedan seleccionar una nueva carta
      cardSelectedP1 = null;
      cardSelectedP2 = null;
      cardSelectedP3 = null;

      // logica para cuando queda solo uno
      let activePlayers = 0;
      let winner;
      if (cardsP1.length > 0) {
        activePlayers++;
        winner = "Jugador 1";
      }
      if (cardsP2.length > 0) {
        activePlayers++;
        winner = "Jugador 2";
      }
      if (cardsP3.length > 0) {
        activePlayers++;
        winner = "Jugador 3";
      }

      if (activePlayers === 1) {
        alert(`${winner} ha ganado la partida`);
        isGame = false;

        setTimeout(() => {
          resetGame();
        }, 0);
      }
    } else {
      alert("Todos los jugadores deben seleccionar una carta.");
    }
  }

  function resetGame() {
    playerDiv1.innerHTML = "";
    playerDiv2.innerHTML = "";
    playerDiv3.innerHTML = "";

    cardsP1 = [];
    cardsP2 = [];
    cardsP3 = [];
  }

  //eventos que controlan el seleccionar carta
  playerDiv1.addEventListener("click", (event) => {
    let card = event.target.closest(".carta");
    if (card && !cardSelectedP1) {
      card.classList.add("seleccion");
      cardSelectedP1 = card;
    }
  });
  playerDiv2.addEventListener("click", (event) => {
    let card = event.target.closest(".carta");
    if (card && !cardSelectedP2) {
      card.classList.add("seleccion");
      cardSelectedP2 = card;
    }
  });
  playerDiv3.addEventListener("click", (event) => {
    let card = event.target.closest(".carta");
    if (card && !cardSelectedP3) {
      card.classList.add("seleccion");
      cardSelectedP3 = card;
    }
  });
});
