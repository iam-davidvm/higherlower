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
        localStorage.setItem('current-streak', '0');
    }

    localStorage.setItem('decks-setting', decksSelector.value);
    localStorage.setItem('cards-setting', cardsSelector.value);
    window.open('./pages/higherlower.html', '_self');
}

/*
 *
 * INITIALIZER
 * 
 */
(function init() {
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
})();