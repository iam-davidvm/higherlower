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
let currentStreak = localStorage.getItem('current-Streak');
let longestStreak = localStorage.getItem('longest-Streak');

let cardsLeft = [];
let drawnCards = [];
let currentGuess = 1;
let guessed = false;

// DOM-elements
const firstRow = document.querySelector('.first-row');
const lastRow = document.querySelector('.last-row');
let row = [];
const currentStreakDisplay = document.querySelector('.streak-current-value');
const longestStreakDisplay = document.querySelector('.streak-longest-value');
const higherBtn = document.querySelector('.btn-higher');
const lowerBtn = document.querySelector('.btn-lower');
const chancesBtn = document.querySelector('.btn-show-hide');
const chancesDisplay = document.querySelector('.chances');

// events
higherBtn.addEventListener('click', function() {
    guess('higher');
})

lowerBtn.addEventListener('click', function() {
    guess('lower');
})

chancesBtn.addEventListener('click', function() {
    const isRevealed = chancesBtn.getAttribute('data-chances');
    if (isRevealed === 'revealed') {
        chancesBtn.setAttribute('data-chances', 'hidden');
        chancesBtn.innerHTML = 'Reveal chances <span><i class="far fa-eye"></i> </span>';
        chancesDisplay.style.display = 'none';
    } else {
        chancesBtn.setAttribute('data-chances', 'revealed');
        chancesBtn.innerHTML = '<span class="hide-mobile">Hide chances </span><i class="far fa-eye-slash"></i>';
        chancesDisplay.style.display = 'inline-block';
    }
})

function showStreaks() {
    if (currentStreak) {
        currentStreakDisplay.textContent = currentStreak;
    } else {
        currentStreakDisplay.textContent = 0;
    }

    if (longestStreak) {
        longestStreakDisplay.textContent = longestStreak;
    } else {
        longestStreakDisplay.textContent = 0;
    }
}

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

function checkIfTablet() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 490 && screenWidth <= 850) {
        return true;
    }
}

function checkIfSmall() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 850) {
        return true;
    }
}

//plays with the width percentages to dynamically make it responsive
function responsiveDivWidths(index = 99) {
    const screenWidth = window.innerWidth;
    let media = 'desktop';

    if (screenWidth <= 490) {
        media = 'mobile';
    } else if (screenWidth <= 850) {
        media = 'small';
    }

    if (index === 99) {
        if (!guessed) {
            index = 0;
        } else {
            for (let i = 0; i < row.length; i++) {
                if (row[i].classList.contains('current-card')) {
                    index = i;
                }
            }
        }
    }

    // console.log('responsiveDivWidths index :' + index);

    // we want to show 3 cards on a small screen when the first card is visible
    if (index === 0 && media === 'small') {
        firstRow.children[1].classList.remove('hide-card');
        firstRow.children[2].classList.remove('hide-card');
    } else if (index === 0 && media === 'mobile'){
        firstRow.children[1].classList.add('hide-card');
        firstRow.children[2].classList.add('hide-card');
    }
    
    if (index <= 4) {
        // previous, current & next card are in first row
        firstRow.style.width = '100%';
        lastRow.style.width = '0%';
    } else if (index >= 7) {
        // previous, current & next card are in last row
        firstRow.style.width = '100%';
        if (media === 'mobile' || media === 'small') {
            firstRow.style.width = '0%';
            lastRow.style.width = '100%';
        } else {
            firstRow.style.width = '100%';
        }
    } else if (index === 5) {
        // previous current card is in first row, next in last row
        if (media === 'small') {
            firstRow.style.width = '66.6%';
            lastRow.style.width = '33.3%';
        } else if (media === 'mobile') {
            firstRow.style.width = '100%';
            lastRow.style.width = '0%'
        } else if (media === 'desktop') {
            firstRow.style.width = '100%';
            lastRow.style.width = '100%';
        }
    } else if (index === 6) {
         // previous card is in first row, current and next in last row
        if (media === 'small') {
            firstRow.style.width = '33.3%';
            lastRow.style.width = '66.3%';
        } else if (media === 'mobile') {
            firstRow.style.width = '0%';
            lastRow.style.width = '100%'
        } else if (media === 'desktop') {
            firstRow.style.width = '100%';
            lastRow.style.width = '100%';
        }
    }
}

// pick a random card and delete it from the deck and push it on the drawncards
function drawCard() {
    // console.log(cardsLeft);
    let randomNum = Math.ceil(Math.random() * cardsLeft.length);
    // console.log(randomNum);
    drawnCards = drawnCards.concat(cardsLeft.splice(randomNum, 1));
    // console.log('cardsLeft', cardsLeft);
    // console.log('drawnCards', drawnCards);
}

// renders the cards on the page
function renderPlayingCards() {
    drawCard();
    let firstRowCards = '';
    
    const isTablet = checkIfTablet();

    for (let i = 0; i <= 5; i++) {
        if (i === 0) {
            firstRowCards = `
                <div class="card current-card">
                    <img src="../images/${getScreenSize()}${drawnCards[drawnCards.length - 1][3]}" alt="${drawnCards[drawnCards.length - 1][2]}" class="front-card card-img">
                </div>
            `;
        } else if (i === 1) {
            firstRowCards += `
                <div class="card next-card">
                    <img src="../images/back-red.png" alt="The red back of a card"class="card-img">
                </div>
            `
        } else if (isTablet && i === 2) {
            firstRowCards += `
                <div class="card">
                    <img src="../images/back-blue.png" alt="The red back of a card"class="card-img">
                </div>
            `
        } else {
            firstRowCards += `
                <div class="card hide-card">
                    <img src="../images/back-blue.png" alt="The blue back of a card"class="card-img">
                </div>
            `
        }
    }
    firstRow.innerHTML = firstRowCards;

    // fill the row array, used later on
    for (let i = 0; i < firstRow.children.length; i++) {
        row.push(firstRow.children[i]);
    }
    
    if (cardsSetting === 'eleven') {
        let lastRowCards = '';
        for (let i = 0; i <= 5; i++) {
            lastRowCards += `
            <div class="card hide-card hide">
            <img src="../images/back-blue.png" alt="The blue back of a card" class="card-img">
            </div>
            `
        }
        lastRow.innerHTML = lastRowCards;

        // fill the row array, used later on
        for (let i = 0; i < lastRow.children.length; i++) {
            row.push(lastRow.children[i]);
        }
    }

}

function displayCard(index) {

    responsiveDivWidths(index);
    const cardsImgs = document.querySelectorAll('.card-img');

    if (index === 5) {
        for (let i = 0; i < 6; i++) {
            lastRow.children[i].classList.remove('hide');
        }
    }
    
    // the previous card is no longer the current card, but the last
    row[index - 1].classList.remove('current-card');
    row[index - 1].classList.add('last-card');

    // make old images - if available hidden
    if (row[index - 2]) {
        row[index - 2].classList.add('hide-card');
    }
    
    // Reveal a new card
    cardsImgs[index].src = `../images/${getScreenSize()}${drawnCards[drawnCards.length - 1][3]}`;
    cardsImgs[index].alt = `${drawnCards[drawnCards.length - 1][2]}`;
    cardsImgs[index].classList.add('front-card');

    // make the next card the current card
    row[index].classList.remove('next-card');
    row[index].classList.remove('hide-card');
    row[index].classList.add('current-card');

    // the next card (if there is one) gets another back design
    if (row[index + 1]) {
        cardsImgs[index + 1].src = '../images/back-red.png';
        cardsImgs[index + 1].alt = 'The red back of a card';
        // we show the next card
        row[index + 1].classList.remove('hide-card');
        row[index + 1].classList.add('next-card');
    }
}

function guess(playerGuess) {
    guessed = true;
    
    drawCard();
    
    const previousCard = drawnCards[drawnCards.length - 2];
    const newCard = drawnCards[drawnCards.length - 1];
    let result = '';
    let rightGuess;

    // console.log(`This is guess number ${currentGuess}`);

    if ((newCard[0] - previousCard[0]) === 0) {
        result = 'same';
    } else if ((newCard[0] - previousCard[0]) < 0) {
        result = 'lower';
    } else if ((newCard[0] - previousCard[0]) > 0) {
        result = 'higher';
    }

    if (result === 'same') {
        rightGuess = true;
    } else if (result === playerGuess) {
        rightGuess = true;
    } else {
        rightGuess = false;
    }
    
    
    if (!rightGuess) {
        /* console.error('verloren');
        currentGuess = 1;
        */

        /*
        BOVENSTAANDE TERUG ZETTEN EN ONDERSTAANDE WISSEN NA TESTEN
        */
        displayCard(currentGuess);
        currentGuess++;

    } else {
        // goed gegokt
        if (cardsSetting === 'five' && currentGuess === 5) {
            console.info('gewonnen');
            currentGuess = 1;
        } else if (cardsSetting === 'eleven' && currentGuess === 11) {
            console.info('gewonnen');
            currentGuess = 1;
        } else {
            displayCard(currentGuess);
            currentGuess++;
            // console.log('kaart tonen');
        }

    }

}

/*
 *
 * DETECTS SCREENRESIZING
 * 
 */
window.addEventListener('resize', resizeScreen);

function resizeScreen() {
    const screenWidth = window.innerWidth;

    responsiveDivWidths();

    const cardImgs = document.querySelectorAll('.front-card');
    if (screenWidth <= 490) {
        for (let i = 0; i < cardImgs.length; i++) {
            /* const desktop = cardImgs[i].src;
            const mobile = desktop.replace('desktop', 'mobile'); */
            // console.log(mobile);
            cardImgs[i].src = cardImgs[i].src.replace('desktop', 'mobile');
        }
    } else {
        for (let i = 0; i < cardImgs.length; i++) {
            /*const mobile = cardImgs[i].src;
            const desktop = mobile.replace('mobile', 'desktop');
            console.log(desktop);*/
            cardImgs[i].src = cardImgs[i].src.replace('mobile', 'desktop');
        }
    }
}

/*
 *
 * INITIALIZER
 * 
 */
(function init() {
    showStreaks();
    getDeckOfCards();
    renderPlayingCards();
})();