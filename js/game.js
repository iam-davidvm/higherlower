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
let currentStreak = localStorage.getItem('current-streak');
let longestStreak = localStorage.getItem('longest-streak');

let cardsLeft = [];
let drawnCards = [];
let currentGuess = 1;
let guessed = false;
let chancesRevealed = 'hidden';

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
const overlay = document.querySelector('#overlay');

// if the player never passes the index-page there is no deck-setting
if (!decksSetting) {    
    window.open('../index.html', '_self');
}

// events
higherBtn.addEventListener('click', function() {
    guess('higher');
});

lowerBtn.addEventListener('click', function() {
    guess('lower');
});

chancesBtn.addEventListener('click', function() {
    chancesRevealed = chancesBtn.getAttribute('data-chances');
    if (chancesRevealed === 'revealed') {
        chancesBtn.setAttribute('data-chances', 'hidden');
        chancesRevealed = 'hidden';
        chancesBtn.innerHTML = 'Reveal chances <span><i class="far fa-eye"></i> </span>';
        chancesDisplay.style.display = 'none';
    } else {
        chancesBtn.setAttribute('data-chances', 'revealed');
        chancesRevealed = 'revealed';
        chancesBtn.innerHTML = '<span class="hide-mobile">Hide chances </span><i class="far fa-eye-slash"></i>';
        chancesDisplay.style.display = 'inline';
        checkChances();
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-win-lose')) {
        startNewOrNextGame();
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'h') {
        guess('higher');
    } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 'l') {
        guess('lower');
    }
})

// show the current and longest streak
function showStreaks() {
    if (!currentStreak) {
        currentStreak = 0;
    }

    if (!longestStreak) {
        longestStreak = 0;
    }

    currentStreakDisplay.textContent = currentStreak;
    longestStreakDisplay.textContent = longestStreak;

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

// helper function to change the path of images in case of mobile width
function getScreenSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 490) {
        return 'mobile';
    } else {
        return 'desktop';
    }
}
/*
deprecated?
*/
function checkIfTablet() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 490 && screenWidth <= 850) {
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
    console.log('drawcard - drawncards: ',drawnCards);
    console.log('drawcard - cardLeft: : ',cardsLeft);
    let randomNum = Math.floor(Math.random() * cardsLeft.length);
    console.log('drawcard - randomNum: ' + randomNum);
    drawnCards = drawnCards.concat(cardsLeft.splice(randomNum, 1));
    return randomNum;
}

// calculates the chances of a higer or lower card
function checkChances() {
    const lastCard = drawnCards[drawnCards.length - 1];
    const lowerCards = cardsLeft.filter(card => card[0] < lastCard[0]).length;
    const cardsPercentage = Math.round((lowerCards / cardsLeft.length) * 100);
    if (cardsPercentage > 50) {
      chancesDisplay.textContent = `${cardsPercentage}% lower`;
    } else {
      chancesDisplay.textContent = `${100 - cardsPercentage}% higher`;
    }
}

// renders the cards on the page
function renderPlayingCards() {
    drawCard();
    let firstRowCards = '';

    console.log(`renderPlayingCards: ${drawnCards} ${typeof(drawnCards)}`);
    
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
                    <img src="../images/back-red.png" alt="" class="card-img">
                </div>
            `
        } else if (isTablet && i === 2) {
            firstRowCards += `
                <div class="card">
                    <img src="../images/back-blue.png" alt="" class="card-img">
                </div>
            `
        } else {
            firstRowCards += `
                <div class="card hide-card">
                    <img src="../images/back-blue.png" alt="" class="card-img">
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
            <img src="../images/back-blue.png" alt="" class="card-img">
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

    if (cardsSetting !== 'five' && index === 5) {
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
        if (cardsImgs[index+1]) {
            cardsImgs[index + 1].src = '../images/back-red.png';
            cardsImgs[index + 1].alt = 'The next card';
        }
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

    if ((newCard[0] - previousCard[0]) === 0) {
        result = 'same';
    } else if ((newCard[0] - previousCard[0]) < 0) {
        result = 'lower';
    } else if ((newCard[0] - previousCard[0]) > 0) {
        result = 'higher';
    }

    console.log(`
    drawn cards: ${drawnCards}
    draw Cards Length: ${drawnCards.length}
    new card: ${newCard[0]}
    previous card: ${previousCard[0]}
    result: ${result}
    `
    )

    if (result === 'same') {
        rightGuess = true;
    } else if (result === playerGuess) {
        rightGuess = true;
    } else {
        rightGuess = false;
    }
    
    
    if (!rightGuess) {
        displayCard(currentGuess);
        currentGuess = 1;
        gameOver('lost');

    } else {
        // correct guess
        if (cardsSetting === 'five' && currentGuess === 5) {
            displayCard(currentGuess);

            currentGuess = 1;
            gameOver('won');
        } else if (cardsSetting === 'eleven' && currentGuess === 11) {
            displayCard(currentGuess);
            
            currentGuess = 1;
            gameOver('won');
        } else {
            displayCard(currentGuess);
            if (chancesRevealed === 'revealed') {
                checkChances();
            }
            currentGuess++;
        }

    }

}

/*
 *
 * GAME OVER MODAL
 * 
 */

function gameOver(result) {
    overlay.style.display = 'block';

    // DOM-elements
    const winOrLoseTitle = document.querySelector('.win-lose');
    const winOrLoseMessage = document.querySelector('.game-message');
    const newOrNextGameBtn = document.querySelector('.btn-win-lose');
    const decksSelector = document.querySelector('#decks');
    const cardsSelector = document.querySelector('#cards');

    decksSelector.value = decksSetting;
    cardsSelector.value = cardsSetting;

    winOrLoseMessage.textContent = `The last card was ${drawnCards[drawnCards.length - 1][2]}`;

    if (result === 'won') {
        currentStreak++;

        winOrLoseTitle.textContent =  'You won!';
        newOrNextGameBtn.textContent = 'Next Game';

        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }

        localStorage.setItem('current-streak', currentStreak);
        localStorage.setItem('longest-streak', longestStreak);
    } else {
        currentStreak = 0;

        winOrLoseTitle.textContent =  'You lost!';
        newOrNextGameBtn.textContent = 'New Game';

        localStorage.removeItem('current-streak');
    }

    // reset all
    row = [];
    drawnCards = [];
    cardsLeft = [];
    // drawnCards = [];
    guessed = false;
    chancesRevealed = 'hidden';

    console.log('win-lose - drawncards: ',drawnCards);
    console.log('win-lose - cardLeft: : ',cardsLeft);
    
}

function startNewOrNextGame() {
    const decksSelector = document.querySelector('#decks');
    const cardsSelector = document.querySelector('#cards');
    console.error('op new or continue geklikt');
    localStorage.setItem('decks-setting', decksSelector.value);
    localStorage.setItem('cards-setting', cardsSelector.value);
    cardsSetting = cardsSelector.value;
    decksSetting = decksSelector.value;

    chancesBtn.setAttribute('data-chances', 'hidden');
    chancesBtn.innerHTML = 'Reveal chances <span><i class="far fa-eye"></i> </span>';
    chancesDisplay.style.display = 'none';

    firstRow.style.width = '100%';
    lastRow.style.width = '0%';

    overlay.style.display = 'none';

    firstRow.textContent = '';
    lastRow.textContent = '';
    init();
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
            cardImgs[i].src = cardImgs[i].src.replace('desktop', 'mobile');
        }
    } else {
        for (let i = 0; i < cardImgs.length; i++) {
            cardImgs[i].src = cardImgs[i].src.replace('mobile', 'desktop');
        }
    }
}

/*
 *
 * INITIALIZER
 * 
 */
function init() {
    showStreaks();
    getDeckOfCards();
    renderPlayingCards();
}

init();