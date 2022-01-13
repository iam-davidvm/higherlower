/*
 *
 * IMPORTING THE CARDS 
 * 
 */
import { CARDS } from '../cards.js';
const cardsObject = CARDS;

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


newGameBtn.addEventListener('click', function() {
    startGame('new');
});


// Start a new/next game from the homepage
function startGame(game) {
    if (game === 'new') {
        localStorage.setItem('currentStreak', '0');
    }
    localStorage.setItem('decks-setting', decksSelector.value);
    localStorage.setItem('cards-setting', cardsSelector.value);
    window.open('./pages/higherlower.html', '_self');
}

// initializer
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
        
    }
})();