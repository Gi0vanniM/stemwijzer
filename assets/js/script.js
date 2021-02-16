//soort van enums
const MENU = Object.freeze({
    START: 'start',
    STATEMENTS: 'statements',
});
const STATEMENTS = subjects;
const PARTIES = parties;

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
let allStatementButtons = {
    'pro': buttonPro,
    'contra': buttonContra,
    'none': buttonNone,
    'skip': buttonSkip
};

// user's answers
let answers = [];

// pro contra none

// parties
// subjects

// 
/**
 * get the next or previous statement
 * @param {statementNumber} i
 */
function displayStatement(i = statementNumber) {
    title.innerHTML = (i + 1) + '. ' + STATEMENTS[i].title;
    statement.innerHTML = STATEMENTS[i].statement.bold();
    if (answers[statementNumber] !== undefined) {
        highlightButtons();
    }
}

/**
 *
 * @param {'pro' | 'contra' | 'none' | 'skip'} button
 */
function actionStatement(opinion) {
    switch (opinion) {
        case 'pro':
        case 'contra':
        case 'none':
        case 'skip':
            answers[statementNumber] = { opinion: opinion };
            break;
    }
    if (statementNumber <= STATEMENTS.length) {
        displayStatement(++statementNumber);
    }
}

/**
 * display a menu
 * @param {*} selectedMenu
 */
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
 * highlight the selected opinion
 * 
 */
function highlightButtons() {
    for (const key in allStatementButtons) {
        if (Object.hasOwnProperty.call(allStatementButtons, key)) {
            let button = allStatementButtons[key];
            if (button.classList.contains("active")) {
                button.classList.remove("active");
            }
        }
    }
    if (answers[statementNumber] !== undefined) {
        // get the answer of current statement
        let b = answers[statementNumber];
        // get the needed button and then highlight it by using the 'active' class
        allStatementButtons[b.opinion].classList.add("active");
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
    this.blur();
}
buttonContra.onclick = function () {
    actionStatement('contra');
    this.blur();
}
buttonNone.onclick = function () {
    actionStatement('none');
    this.blur();
}
buttonSkip.onclick = function () {
    actionStatement('skip');
    this.blur();
}
