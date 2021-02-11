//soort van enums
const MENU = Object.freeze({
    START: 'start',
    STATEMENTS: 'statements',
});
const STATEMENTS = Object.freeze(subjects);
const PARTIES = Object.freeze(parties);

// start button
let startButton = document.getElementById('start-button');
// start screen container
let startScreen = document.getElementById('start-screen')
// statements screen container
let statementsScreen = document.getElementById('statements-screen');
// title of question/statement
let title = document.getElementById('title');
// statement
let statement = document.getElementById('statement');
// currently selected statement 
let statementNumber = 0;
// back button
let backButton = document.getElementById('back-button');

// parties
// subjects

// get the next or previous statement
function getStatement() {
    
}

// 
function getMenu(selectedMenu) {
    switch (selectedMenu) {
        case MENU.START:
            startScreen.hidden = false;
            statementsScreen.hidden = true;
            break;
        case MENU.STATEMENTS:
            startScreen.hidden = true;
            statementsScreen.hidden = false;
            break;

        default:
            // nothing
            break;
    }
}

/**
 * Event listeners
 */
startButton.onclick = function () {
    getMenu(MENU.STATEMENTS);
    getStatement();
}

backButton.onclick = function () {
    if (statementNumber <= 0) {
        getMenu(MENU.START);
    } else {
        getStatement();
    }
}
