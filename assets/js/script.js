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

// statement buttons
let buttonPro = document.getElementById('button-pro');
let buttonContra = document.getElementById('button-contra');
let buttonNone = document.getElementById('button-none');
let buttonSkip = document.getElementById('button-skip');

// user's answers
let answers = [];

// pro contra none

// parties
// subjects

// get the next or previous statement
function displayStatement(i = statementNumber) {
    title.innerHTML = i + '. ' + STATEMENTS[i].title;
    statement.innerHTML = STATEMENTS[i].statement.bold();
}

// action
function actionStatement(button) {
    switch (button) {
        case 'pro':
            answers.push({ id: statementNumber, opinion: 'pro' });
            break;
        case 'contra':
            answers.push({ id: statementNumber, opinion: 'contra' });
            break;
        case 'none':
            answers.push({ id: statementNumber, opinion: 'none' });
            break;
        case 'skip':
            answers.push({ id: statementNumber, opinion: '' });
            break;
        default:
            break;
    }
    displayStatement(++statementNumber);
}

// get a menu
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
    displayStatement(statementNumber);
}

backButton.onclick = function () {
    if (statementNumber <= 0) {
        getMenu(MENU.START);
    } else {
        displayStatement(--statementNumber);
    }
}

buttonPro.onclick = function () {
    actionStatement('pro');
}
buttonContra.onclick = function () {
    actionStatement('contra');
}
buttonNone.onclick = function () {
    actionStatement('none');
}
buttonSkip.onclick = function () {
    actionStatement('skip');
}
