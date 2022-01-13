/*
 *
 * IMPORTING THE CARDS 
 * 
 */
import { CARDS } from '../cards.js';

const cardsObject = CARDS;
let CARDDECK1 = [];
let CARDDECK2 = [];
let decksCreated = false;

/*
 *
 * HOMEPAGE
 * 
 */

// Variables
const continueGameBtn = document.querySelector('.btn-continue');
const newGameBtn = document.querySelector('.btn-new');

// localstarage items
let gameInProgress = localStorage.getItem('gameInProgress');
let decksSetting = localStorage.getItem('decks-setting');
let cardsSetting = localStorage.getItem('cards-setting');

const decksSelector = document.querySelector('#decks');
const cardsSelector = document.querySelector('#cards');


document.addEventListener('click', function(e) {
    let theTarget = e.target.classList;
    if (theTarget.contains('btn-new')) {
        startGame('new');
    } else if (theTarget.contains('btn-continue')) {
        startGame('continue');
    }
});


// Start a new/next game from the homepage
function startGame(game) {
    if (game === 'new') {
        localStorage.setItem('currentStreak', '0');
    }
    // reset previous game values
    if (cardsLeft) {
        cardsLeft = [];
    }
    if (drawnCards) {
        drawnCards = [];
    }
    if (nextGuess) {
        nextGuess = 1;
    }
    localStorage.setItem('decks-setting', decksSelector.value);
    localStorage.setItem('cards-setting', cardsSelector.value);
    window.open('./pages/higherlower.html', '_self');
}

/*
 *
 * GAME AREA
 * 
 */

// variables
let cardsLeft = [];
let drawnCards = [];
let firstRow = document.querySelector('.first-row');
let lastRow = document.querySelector('.last-row');
let nextGuess = 1;

// Create the amount of decks
function getDeckOfCards() {
    if (!decksCreated) {
        CARDDECK1 = cardsObject.map(card => [card.value, card.card, card.description, card.img]);
        CARDDECK2 = cardsObject.map(card => [card.value, card.card, card.description, card.img]);
        decksCreated = true;
    }

    if (decksSetting === 'one') {
        cardsLeft = [...CARDDECK1];
    } else {
        cardsLeft = CARDDECK1.concat(CARDDECK2);
    }
}

function getScreenSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 490) {
        return 'mobile';
    } else {
        return 'desktop';
    }
}

// pick a random card and delete it from the deck and push it on the drawncards
function drawCard() {
    console.log(cardsLeft);
    let randomNum = Math.ceil(Math.random() * cardsLeft.length);
    console.log(randomNum);
    drawnCards = drawnCards.concat(cardsLeft.splice(randomNum, 1));
    console.log('cardsLeft', cardsLeft);
    console.log('drawnCards', drawnCards);
}

// renders the cards on the page
function renderPlayingCards() {
    drawCard();
    let firstRowCards = '';

    for (let i = 0; i <= 5; i++) {
        if (i === 0) {
            firstRowCards = `
                <div class="card current-card">
                    <img src="../images/${getScreenSize()}${drawnCards[drawnCards.length - 1][3]}" alt="${drawnCards[drawnCards.length - 1][2]}">
                </div>
            `;
        } else if (i === 1) {
            firstRowCards += `
                <div class="card next-card">
                    <img src="../images/back-red.png" alt="The red back of a card">
                </div>
            `
        } else {
            firstRowCards += `
                <div class="card hide-card">
                    <img src="../images/back-blue.png" alt="The blue back of a card">
                </div>
            `
        }
    }
    firstRow.innerHTML = firstRowCards;
    
    if (cardsSetting === 'eleven') {
        let lastRowCards = '';
        for (let i = 0; i <= 5; i++) {
            lastRowCards += `
            <div class="card hide-card hide">
            <img src="../images/back-blue.png" alt="The blue back of a card">
            </div>
            `
        }
        lastRow.innerHTML = lastRowCards;
    }
    

    drawCard();
    
}

/*
 *
 * INITIALIZER
 * 
 */
(function init() {
    const pageURL = window.location.href;

    if (pageURL.includes('index')) {        
        if (gameInProgress) {
            continueGameBtn.classList.remove('hide');
        } else {
            continueGameBtn.classList.add('hide');
        }

        if (decksSetting) {
            decksSelector.value = decksSetting;
        }

        if (cardsSetting) {
            cardsSelector.value = cardsSetting;
        }
    } else {
        getDeckOfCards();
        renderPlayingCards();
    }
})();