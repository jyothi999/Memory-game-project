/*
 * Create a list that holds all of your cards
 */

let clockId;
let moves = 0;
let time = 0;
let paired = 0;
let openCards = [];
let clockOff = true;
const TOTAL_PAIRS = 8;
const board = document.querySelector(".deck");
const cards = document.querySelectorAll(".card");
let movesCounter = document.querySelector(".moves");
let starRating = document.querySelectorAll(".stars li");

// Shuffle function 
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
deckCardsShuffle();
board.addEventListener("click", event => {
  const clickTarget = event.target;
  if (
    clickTarget.classList.contains("card") &&
    !clickTarget.classList.contains("match") &&
    openCards.length < 2 &&
    !openCards.includes(clickTarget)
  ) {
    if (clockOff) {
      clockId = setInterval(() => {
        time++;
        displayTime();
      }, 1000);
      clockOff = false;
    }
    flipCard(clickTarget);
    openCards.push(clickTarget);
    if (openCards.length === 2) {
      moves++;
      const movesText = document.querySelector(".moves");
      movesText.innerHTML = moves;
      ratingPerformance(moves);
      checkForMatch(clickTarget);
    }
  }
});

function ratingPerformance(moves) {
  if (moves === 16 || moves === 24) {
    for (star of starRating) {
      if (star.style.display !== "none") {
        star.style.display = "none";
        break;
      }
    }
  } else if (moves > 30) {
    gameOver("gameOver");
  }
}

function flipCard(clickTarget) {
  clickTarget.classList.toggle("open");
  clickTarget.classList.toggle("show");
}

function checkForMatch() {
  if (
    openCards[0].firstElementChild.className ===
    openCards[1].firstElementChild.className
  ) {
    openCards[0].classList.toggle("match");
    openCards[1].classList.toggle("match");
    openCards = [];
    paired++;
    if (paired === TOTAL_PAIRS) {
      matchedAllFunction();
    }
  } else {
    setTimeout(() => {
      flipCard(openCards[0]);
      flipCard(openCards[1]);
      openCards = [];
    }, 700);
  }
}

//To shuffle Deck
function deckCardsShuffle() {
  const cardsToShuffle = Array.from(document.querySelectorAll(".deck li"));
  const shuffleCards = shuffle(cardsToShuffle);
  for (card of shuffleCards) {
    board.appendChild(card);
  }
}

function displayTime() {
  const clock = document.querySelector(".clock");
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  if (seconds < 10) {
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

function stopTimer() {
  clearInterval(clockId);
}

function togglepopUp() {
  const dialog = document.querySelector(".modal_div");
  popUpContent();
  dialog.classList.toggle("hide");
}

function popUpContent(status) {
  const msgStat = document.querySelector(".popUp_message");
  const timeStat = document.querySelector(".total_time");
  const clockTime = document.querySelector(".clock").innerHTML;
  const starsStat = document.querySelector(".total_stars");
  const stars = getStars();
  const movesStat = document.querySelector(".total_moves");
  if (status === "paired") {
    msgStat.innerHTML = `Matched All!!`;
  } else if (status === "gameOver") {
    msgStat.innerHTML = `Game Over!!`;
  }
  timeStat.innerHTML = `Total Time=${clockTime}`;
  starsStat.innerHTML = `Stars=${stars}`;
  movesStat.innerHTML = `Moves=${moves}`;
}

function getStars() {
  stars = document.querySelectorAll(".stars li");
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== "none") {
      starCount++;
    }
  }
  return starCount;
}

document.querySelector(".button_cancel").addEventListener("click", () => {
  togglepopUp();
});

document.querySelector(".button_replay").addEventListener("click", () => {
  resetGame();
  resetMoves();
  paired = 0;
  togglepopUp();
  resetCards();
});

document.querySelector(".restart").addEventListener("click", () => {
  clockTimeReset();
  deckCardsShuffle();
  resetCards();
  resetMoves();
  resetStars();
  paired = 0;
});

document.querySelector(".popUp_close").addEventListener("click", closePopUp);

function resetGame(params) {
  clockTimeReset();
  resetMoves();
  resetStars();
  deckCardsShuffle();
}

function clockTimeReset(params) {
  stopTimer();
  clockOff = true;
  time = 0;
  displayTime();
}

function resetMoves(params) {
  moves = 0;
  movesCounter.innerHTML = 0;
}

function resetStars(params) {
  stars = 0;
  for (star of starRating) {
    star.style.display = "inline";
  }
}

function gameOver(param) {
  stopTimer();
  paired = 0;
  popUpContent(param);
  togglepopUp();
}

function resetCards(params) {
  const cards = document.querySelectorAll(".deck li");
  for (card of cards) {
    card.className = "card";
  }
}

function closePopUp() {
  resetGame();
  togglepopUp();
  resetCards();
  resetMoves();
}

function matchedAllFunction(params) {
  stopTimer();
  popUpContent("paired");
  togglepopUp();
}
