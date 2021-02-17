//soort van enums
const MENU = Object.freeze({
    START: 'start',
    STATEMENTS: 'statements',
    IMPORTANT: 'important',
    PARTY_SELECTION: 'partyselection',
    RESULTS: 'results',
});
// get the statements
const STATEMENTS = subjects;
// get the parties
const PARTIES = parties;
// the least amount of seats a party must have if choosing that option
const LEAST_AMOUNT = 1;
/**
 * extra important subjects multiplier
 * multiply the amount of agreement the user finds extra important by (2 is default)
 */
const EXTRA_IMPORTANT_MULTIPLIER = 2;

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
 * important subjects screen container
 */
let importantScreen = document.getElementById('important-screen');
/**
 * party selection screen container
 */
let partyScreen = document.getElementById('party-screen');
/**
 * title of question/statement
 */
let title = document.getElementById('title');
/**
 * statement text
 */
let statement = document.getElementById('statement');
/**
 * statement navbar
 */
let statementNavBar = document.getElementById('statements-navbar');
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
 * important subjects/statements div
 */
let importantSubjects = document.getElementById('important-subjects');
/**
 * important subjects checkboxes
 * the div in which the user can click which subjects is extra important
 */
let importantSubjectsCheckboxes = document.getElementById('important-subjects-checkboxes');
/**
 * party selection checkboxes
 * the div in which the user can click which parties to include
 */
let partySelectionCheckboxes = document.getElementById('party-selector-checkboxes');
/**
 * next button in the important subjects view
 */
let importantSubjectsNextButton = document.getElementById('important-subjects-next');
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
 * and the parties for the party selecion
 */
createImportantSubjects();
createPartySelection();

// 
/**
 * get the next or previous statement
 * @param {statementNumber} i
 */
function displayStatement(i = statementNumber) {
    if (statementNumber >= STATEMENTS.length) {
        getMenu(MENU.IMPORTANT);
    } else {
        getMenu(MENU.STATEMENTS);
        title.innerHTML = (i + 1) + '. ' + STATEMENTS[i].title;
        statement.innerHTML = STATEMENTS[i].statement.bold();
        if (answers[statementNumber] !== undefined) {
            highlightButtons();
        }
    }
}

/**
 * save the user's opinion and display next statement
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
    statementNavBar.hidden = true;
    importantScreen.hidden = true;
    partyScreen.hidden = true;
    document.body.classList.remove('background');
    switch (selectedMenu) {
        case MENU.START:
            startScreen.hidden = false;
            document.body.classList.add('background');
            break;
        case MENU.STATEMENTS:
            statementsScreen.hidden = false;
            statementNavBar.hidden = false;
            break;
        case MENU.IMPORTANT:
            importantScreen.hidden = false;
            statementNavBar.hidden = false;
            break;
        case MENU.PARTY_SELECTION:
            partyScreen.hidden = false;
            statementNavBar.hidden = false;
            break;
        case MENU.RESULTS:
            resultsScreen.hidden = false;
            statementNavBar.hidden = false;
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
    STATEMENTS.forEach((statement, index) => {
        let div = `<div class="col-md-6 col-lg-4 mb-1">
        <label class="col-12 btn btn-white border rounded mx-n1">
            <input type="checkbox" class="px-2 form-check-input mx-0" id="subject-${index}">
            <p id="important-subject-text-${index}" class="ml-2 m-0">${statement.title}</p>
        </label>
    </div>`;
        let template = document.createElement('template');
        template.innerHTML = div;
        importantSubjectsCheckboxes.appendChild(template.content.firstChild);
    });
}

function createPartySelection() {
    PARTIES.forEach((party, index) => {
        let div = `<div class="col-md-6 col-lg-4 mb-1">
        <label class="col-12 btn btn-white border rounded mx-n1">
            <input type="checkbox" class="px-2 form-check-input mx-0" id="partyS-${index}">
            <p id="partyS-text-${index}" class="ml-2 m-0">${party.name}</p>
        </label>
    </div>`;
        let template = document.createElement('template');
        template.innerHTML = div;
        partySelectionCheckboxes.appendChild(template.content.firstChild);
    });
}

/**
 * calculate which party fits best to the user's input
 * @returns {Array}
 */
function calculateResult() {
    let resultParties = [];
    STATEMENTS.forEach((statement, index) => {
        let userOpinion = answers[index];
        let extraImportant = (document.getElementById(`subject-${index}`)) ? document.getElementById(`subject-${index}`).checked : null;

        PARTIES.forEach(party => {
            // get the party's position from the subjects/STATEMENTS
            let partyPosition = statement.parties.find(p => p.name === party.name);

            if (partyPosition.position === userOpinion.opinion) {
                // same opinion
                amount = 1;
                if (extraImportant) {
                    amount *= EXTRA_IMPORTANT_MULTIPLIER;
                }
                // add amount to the party that has the same opinion
                // if the party is not in the array yet, make one
                resultParties[party.name] = { agree: (resultParties[party.name]) ? resultParties[party.name].agree + amount : amount };
            }
        })
    })
    return resultParties;
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
importantSubjectsNextButton.onclick = function () {
    getMenu(MENU.PARTY_SELECTION);
}

