const myModule = (() => {
  "use strict";

  let deck = [];
  const types = ["C", "D", "H", "S"],
    specialsCards = ["A", "J", "Q", "K"];

  let playersPoints = [];

  // Html references
  const btnDraw = document.querySelector("#btnDraw"),
    btnStop = document.querySelector("#btnStop"),
    btnNew = document.querySelector("#btnNew");

  const divCardsPlayers = document.querySelectorAll(".divCards"),
    pointsHtml = document.querySelectorAll("small");

  // this function initializes the game
  const startGame = (playersNumber = 2) => {
    deck = createDeck();
    playersPoints = [];
    for (let i = 0; i < playersNumber; i++) {
      playersPoints.push(0);
    }
    pointsHtml.forEach((elem) => (elem.innerText = 0));
    divCardsPlayers.forEach((elem) => (elem.innerHTML = ""));

    btnDraw.disabled = false;
    btnStop.disabled = false;
  };

  /**
   * It creates a deck of cards.
   */
  const createDeck = () => {
    deck = [];

    for (let i = 2; i <= 10; i++) {
      for (let type of types) {
        deck.push(i + type);
      }
    }

    /* Creating the special cards for each type. */
    for (let type of types) {
      for (let specialCard of specialsCards) {
        deck.push(specialCard + type);
      }
    }

    return _.shuffle(deck);
  };

  // This function is used to draw a card from the deck.

  /**
   * DrawCard() returns the last card in the deck array.
   * @returns The last card in the deck.
   */
  const drawCard = () => {
    if (deck.length === 0) {
      throw console.warn("No more cards in the deck");
    }

    return deck.pop();
  };

  /**
   * If the value of the card is not a number, then return 10, otherwise return the value of the card.
   * @param card - the card that is being evaluated
   * @returns The value of the card.
   */

  const valueCard = (card) => {
    const value = card.substring(0, card.length - 1);

    return isNaN(value) ? (value === "A" ? 11 : 10) : value * 1;
  };

  // turn:0 to first player and the last player is the computer

  const accumulatePoints = (card, turn) => {
    playersPoints[turn] = playersPoints[turn] + valueCard(card);
    pointsHtml[turn].innerText = playersPoints[turn];
    return playersPoints[turn];
  };

  const createCard = (card, turn) => {
    const imgCard = document.createElement("img");
    imgCard.src = `assets/cards/${card}.png`; //3H, JD
    imgCard.classList.add("cards");
    divCardsPlayers[turn].append(imgCard);
  };
  const whoWin = () => {
    const [minPoints, computerPoints] = playersPoints;

    setTimeout(() => {
      if (computerPoints === minPoints) {
        alert("Nobody wins: (");
      } else if (minPoints > 21) {
        alert("Computer wins");
      } else if (computerPoints > 21) {
        alert("Player wins");
      } else {
        alert("Computer wins");
      }
    }, 100);
  };

  // Computer Turn

  const computerTurn = (minPoints) => {
    let computerPoints = 0;

    do {
      const card = drawCard();
      computerPoints = accumulatePoints(card, playersPoints.length - 1);
      createCard(card, playersPoints.length - 1);
    } while (computerPoints < minPoints && minPoints <= 21);

    whoWin();
  };

  /* Calling the function valueCard and passing the value "5D" to it. */
  // const value = valueCard(drawCard());
  // console.log({value});

  // Events

  // Players Turn

  btnDraw.addEventListener("click", () => {
    const card = drawCard();
    const playerPoints = accumulatePoints(card, 0);

    createCard(card, 0);

    if (playerPoints > 21) {
      console.warn("Sorry, you lose");
      btnDraw.disabled = true;
      btnStop.disabled = true;
      computerTurn(playerPoints);
    } else if (playerPoints === 21) {
      console.warn("You win");
      btnDraw.disabled = true;
      btnStop.disabled = true;
      computerTurn(playerPoints);
    }
  });

  btnStop.addEventListener("click", () => {
    btnDraw.disabled = true;
    btnStop.disabled = true;

    computerTurn(playersPoints[0]);
  });

  return {
    newGame: startGame,
  };
})();
