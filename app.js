// HTML Elements
const gameContainer = document.getElementById("game");
const card = document.querySelectorAll("card");
const tallyScore = document.querySelector(".score");
const showBestScore = document.querySelector(".best-score");
const reset = document.querySelector(".reset");
const winner = document.querySelector("#win");
const winReset = document.querySelector(".win-reset");
const finalScore = document.querySelector(".final-score");

// Game variables
let score = 0;
let cardCount= 0;
let matches = 0;
let lockBoard = false;
let cardsToCompare = [];

// Best score initialization 
let bestScoreString = localStorage.getItem("bestScore");
let bestScore = JSON.parse(bestScoreString) ?? 0;
showBestScore.innerText = bestScore;
tallyScore.innerText = `${score}`;

function checkBestScore() {
  if (bestScore === 0 || score < bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
}

// Card colors via CSS classes
const COLORS = [
  "pink",
  "blue",
  "yellow",
  "peach",
  "purple",
  "teal",
  "pink",
  "blue",
  "yellow",
  "peach",
  "purple",
  "teal"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    //add classes for CSS styling and animations
    newDiv.classList.add("card");
    newDiv.classList.add("front");

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  console.log("you just clicked", event.target);

  let currentCard = event.target;

  // if the card is already flipped do nothing
  if (!currentCard.classList.contains("front")) return;
 
  // flip a card on click
  function flipCard() {
     // if lockBoard is true do nothing
    if (lockBoard) return;
    //flip the card
    currentCard.classList.toggle("flipped");
    //timeout for animations
    setTimeout(() => {
      currentCard.classList.remove("front");
    }, 270)
    currentCard.classList.add("back");
    //add it to comparison array
    cardsToCompare.push(currentCard);
    //increase the counts
    cardCount++;
    score++;
    // update the score
    tallyScore.innerText = `${score}`;
  }

  flipCard();

  if (cardCount === 2) {
    lockBoard = true;
    checkForMatch();
  }

  // check for matches
  function checkForMatch() {
    // compare the first class of each card in the array
    const card1 = cardsToCompare[0];
    console.log(card1, "CARD 1"); 
    const card2 = cardsToCompare[1];
    console.log(card2, "CARD 2")
    if (card1.classList[0] === card2.classList[0]) {
      console.log("Match!");
      matches ++;
      cardsToCompare = [];
      lockBoard = false;
      cardCount = 0;
    }
    else {
      // if no match unflip cards and empty array
      setTimeout(() => {
          console.log("Not matched");
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          setTimeout(() => {
            card1.classList.remove("back");
            card2.classList.remove("back");
            card1.classList.add("front");
            card2.classList.add("front");}, 300);
          setTimeout(()=> {
            lockBoard = false;
          }, 600);
          cardsToCompare= [];
          cardCount = 0;
      }, 1000);
    }
  }

  // if the game is won, show #win popup and update bestScore
  if (matches === 6) {
    setTimeout(() =>
    { lockBoard = true;
      winner.classList.remove("hidden");
      winReset.addEventListener("click", reloadPage);
      finalScore.innerText = `${score}`;
    }, 500);
    checkBestScore();
  }
} // end checkForMatch

// reset button
reset.onclick = reloadPage;
function reloadPage() {
  window.location.reload();
}

// when the DOM loads
createDivsForColors(shuffledColors);