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
 * GAME AREA
 * 
 */

// variables
// localstarage items
let decksSetting = localStorage.getItem('decks-setting');
let cardsSetting = localStorage.getItem('cards-setting');

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
    getDeckOfCards();
    renderPlayingCards();
})();