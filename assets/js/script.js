//soort van enums
const MENU = Object.freeze({
    START: 'start',
    STATEMENTS: 'statements',
    RESULTS: 'results',
});
// get the statements
const STATEMENTS = subjects;
// get the parties
const PARTIES = parties;
// the least amount of seats a party must have if choosing that option
const LEAST_AMOUNT = 1;

/**
 * start button
 * @type {HTMLElement}
 */
let startButton = document.getElementById('start-button');
/**
 * start screen container
 */
let startScreen = document.getElementById('start-screen')
/**
 * statements screen container
 */
let statementsScreen = document.getElementById('statements-screen');
/**
 * restult screen contianer
 */
let resultsScreen = document.getElementById('results-screen');
/**
 * title of question/statement
 */
let title = document.getElementById('title');
/**
 * statement
 */
let statement = document.getElementById('statement');
/**
 * currently selected statement
 */
let statementNumber = 0;
/**
 * back button
 */
let backButton = document.getElementById('back-button');
/**
 * get the parent div of title and statement
 */
let statementParent = document.getElementById('statements-parent');
/**
 * important subjects/statements
 */
let importantSubjects = document.getElementById('important-subjects');
/**
 * important subjects checkboxes
 * the div in which the user can click which subjects is extra important
 */
let importantSubjectsCheckboxes = document.getElementById('important-subjects-checkboxes');
/**
 * get the 'pro' button
 * "Eens"
 */
let buttonPro = document.getElementById('button-pro');
/**
 * get the 'contra' button
 * "Oneens"
 */
let buttonContra = document.getElementById('button-contra');
/**
 * get the 'none' button
 * "Geen van beide"
 */
let buttonNone = document.getElementById('button-none');
/**
 * get the 'skip' button
 * "Overslaan"
 */
let buttonSkip = document.getElementById('button-skip');
/**
 * all statement buttons in an object so we can loop through,
 * or get the correct button by just their name like 'pro'.
 * allStatementButtons[answers[statementNumber].opinion]
 */
let allStatementButtons = {
    'pro': buttonPro,
    'contra': buttonContra,
    'none': buttonNone,
    'skip': buttonSkip
};
/**
 * get the parent div of statement buttons
 */
let statementButtons = document.getElementById('statement-buttons');

/**
 * user's answers array
 */
let answers = [];

// pro contra none

// parties
// subjects

/**
 * generate the important subjects list
 */
createImportantSubjects();

// 
/**
 * get the next or previous statement
 * @param {statementNumber} i
 */
function displayStatement(i = statementNumber) {
    if (statementNumber >= STATEMENTS.length) {
        statementButtons.hidden = true;
        statementParent.hidden = true;
        importantSubjects.hidden = false;
    } else {
        statementButtons.hidden = false;
        statementParent.hidden = false;
        importantSubjects.hidden = true;
        title.innerHTML = (i + 1) + '. ' + STATEMENTS[i].title;
        statement.innerHTML = STATEMENTS[i].statement.bold();
        if (answers[statementNumber] !== undefined) {
            highlightButtons();
        }
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
    displayStatement(++statementNumber);
}

/**
 * display a menu
 * @param {*} selectedMenu
 */
function getMenu(selectedMenu) {
    startScreen.hidden = true;
    statementsScreen.hidden = true;
    resultsScreen.hidden = true;
    document.body.classList.remove('background');
    switch (selectedMenu) {
        case MENU.START:
            startScreen.hidden = false;
            document.body.classList.add('background');
            break;
        case MENU.STATEMENTS:
            statementsScreen.hidden = false;
            break;
        case MENU.RESULTS:
            resultsScreen.hidden = false;
            break;
        default:
            // nothing
            break;
    }
}

/**
 * display subjects the user can choose is extra important
 */
function createImportantSubjects() {
    STATEMENTS.forEach(statement => {
        let div = `<div class="col-md-6 col-lg-4 mb-1">
        <label class="col-12 btn btn-white border rounded mx-n1">
            <input type="checkbox" class="px-2 form-check-input mx-0" id="subject-${statement.id}">
            <p id="important-subject-text-${statement.id}" class="ml-2 m-0">${statement.title}</p>
        </label>
    </div>`;
        let template = document.createElement('template');
        template.innerHTML = div;
        importantSubjectsCheckboxes.appendChild(template.content.firstChild);
    });
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
        let buttonName = answers[statementNumber].opinion;
        // get the needed button and then highlight it by using the 'active' class
        allStatementButtons[buttonName].classList.add("active");
    }
}

/**
 * Event listeners
 */

// start button
startButton.onclick = function () {
    getMenu(MENU.STATEMENTS);
    displayStatement(statementNumber);
}

// backbutton
backButton.onclick = function () {
    if (statementNumber <= 0) {
        getMenu(MENU.START);
    } else {
        displayStatement(--statementNumber);
    }
}

// register event listeners to the buttons
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
