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
// let cardsSetting = localStorage.getItem('cards-setting');

let cardsLeft = [];
let drawnCards = [];
let currentGuess = 1;

// DOM-elements
const firstRow = document.querySelector('.first-row');
const lastRow = document.querySelector('.last-row');
const currentStreakDisplay = document.querySelector('.streak-current-value');
const longestStreakDisplay = document.querySelector('.streak-longest-value');
const higherBtn = document.querySelector('.btn-higher');
const lowerBtn = document.querySelector('.btn-lower');

higherBtn.addEventListener('click', function() {
    guess('higher');
})

lowerBtn.addEventListener('click', function() {
    guess('lower');
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
    
    const isTablet = checkIfTablet();

    for (let i = 0; i <= 5; i++) {
        if (i === 0) {
            firstRowCards = `
                <div class="card current-card">
                    <img src="../images/${getScreenSize()}${drawnCards[drawnCards.length - 1][3]}" alt="${drawnCards[drawnCards.length - 1][2]}" class="front-card">
                </div>
            `;
        } else if (i === 1) {
            firstRowCards += `
                <div class="card next-card">
                    <img src="../images/back-red.png" alt="The red back of a card">
                </div>
            `
        } else if (isTablet && i === 2) {
            firstRowCards += `
                <div class="card">
                    <img src="../images/back-blue.png" alt="The red back of a card">
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
    
}

function displayCard(index) {

    // the display of the cards is different depending on the screen width
    const isSmall = checkIfSmall();
    const isTablet = checkIfTablet();

    // if there are two rows of cards, we want another display
    let isOnOneRow = true;
    if (index > 4 && index < 7) {
        isOnOneRow = false;
    }

    if (isOnOneRow) {
        let row = document.querySelector('.first-row');
        firstRow.style.width = '100%';
        lastRow.style.width = '0%';

        /*
        IS DIT NODIG?
        */
        if (index >= 7) {
            row = document.querySelector('.last-row');
            firstRow.style.width = '100%';
            lastRow.style.width = '100%';
            if (isSmall) {
                firstRow.style.width = '0%';
            }
            index = index % 6;
        }

        const revealedCard = row.querySelectorAll('img')[index];
        const nextCard = row.querySelectorAll('img')[index + 1];
        // previouscard
        row.children[index - 1].classList.remove('current-card');
        row.children[index - 1].classList.add('last-card');

        if (row.children[index - 2]) {
            row.children[index - 2].classList.add('hide-card');
        }

        // revealedcard
        revealedCard.src = `../images/${getScreenSize()}${drawnCards[drawnCards.length - 1][3]}`;
        revealedCard.alt = `${drawnCards[drawnCards.length - 1][2]}`;
        revealedCard.classList.add('front-card');
        row.children[index].classList.remove('next-card');
        row.children[index].classList.add('current-card');
        // newcard
        nextCard.src = '../images/back-red.png';
        nextCard.alt = 'The red back of a card';
        row.children[index + 1].classList.remove('hide-card');
        row.children[index + 1].classList.add('next-card');
        console.log(row.children[0]);
    } else {
        if (index === 5) {
            const revealedCard = firstRow.querySelectorAll('img')[index];
            const nextCard = lastRow.querySelectorAll('img')[0];
            
            
            if (isTablet) {
                firstRow.style.width = '66%';
                lastRow.style.width = '33%';
            } else if (isSmall) {
                firstRow.style.width = '100%';
            } else {
                lastRow.style.width = '100%';
            }

            // previouscard
            firstRow.children[index - 1].classList.remove('current-card');
            firstRow.children[index - 1].classList.add('last-card');
            if (firstRow.children[index - 2]) {
                firstRow.children[index - 2].classList.add('hide-card');
            }
            // revealedcard
            revealedCard.src = `../images/${getScreenSize()}${drawnCards[drawnCards.length - 1][3]}`;
            revealedCard.alt = `${drawnCards[drawnCards.length - 1][2]}`;
            revealedCard.classList.add('front-card');
            firstRow.children[index].classList.remove('next-card');
            firstRow.children[index].classList.add('current-card');
            // newcard
            nextCard.src = '../images/back-red.png';
            nextCard.alt = 'The red back of a card';
            lastRow.children[0].classList.remove('hide-card');
            lastRow.children[0].classList.add('next-card');
            for (let i = 0; i < 6; i++) {
                lastRow.children[i].classList.remove('hide');
            }
        } else {
            const revealedCard = lastRow.querySelectorAll('img')[0];
            const nextCard = lastRow.querySelectorAll('img')[1];
            
            if (isTablet) {
                firstRow.style.width = '33%';
                lastRow.style.width = '66%';
            } else if (isSmall) {
                firstRow.style.width = '0%';
                lastRow.style.width = '100%';
            }

            // previouscard
            firstRow.children[index - 1].classList.remove('current-card');
            firstRow.children[index - 1].classList.add('last-card');
            if (firstRow.children[index - 2]) {
                firstRow.children[index - 2].classList.add('hide-card');
            }
            // revealedcard
            revealedCard.src = `../images/${getScreenSize()}${drawnCards[drawnCards.length - 1][3]}`;
            revealedCard.alt = `${drawnCards[drawnCards.length - 1][2]}`;
            revealedCard.classList.add('front-card');
            lastRow.children[0].classList.remove('next-card');
            lastRow.children[0].classList.add('current-card');
            // newcard
            nextCard.src = '../images/back-red.png';
            nextCard.alt = 'The red back of a card';
            lastRow.children[1].classList.remove('hide-card');
            lastRow.children[1].classList.add('next-card');
        }
    }
}

function guess(playerGuess) {
    // trek een kaart
    drawCard();
    // vergelijk de getrokken kaart met de vorige kaart (vorige - huidige)
    const previousCard = drawnCards[drawnCards.length - 2];
    const newCard = drawnCards[drawnCards.length - 1];
    let result = '';
    let rightGuess;

    console.log(`This is guess number ${currentGuess}`);

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
    
    // fout gegokt? game over
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
        // nextGuess++
        if (cardsSetting === 'five' && currentGuess === 5) {
            console.info('gewonnen');
            currentGuess = 1;
        } else if (cardsSetting === 'eleven' && currentGuess === 11) {
            console.info('gewonnen');
            currentGuess = 1;
        } else {
            displayCard(currentGuess);
            currentGuess++;
            console.log('kaart tonen');
        }

    }


        // alle kaarten geraden? gewonnen

        // nog kaarten te gaan? display kaart
}

/*
 *
 * DETECTS SCREENRESIZING
 * 
 */
window.addEventListener('resize', resizeScreen);

function resizeScreen() {
    const screenWidth = window.innerWidth;

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