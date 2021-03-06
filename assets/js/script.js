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
 * next button in the party selector view
 */
let partySelectorNextButton = document.getElementById('party-selector-next');
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

// all parties radio button
let allPartiesRadio = document.getElementById('allParties');
// secular parties radio button
let secularPartiesRadio = document.getElementById('secularParties');
// party results div
let partyResultsDiv = document.getElementById('party-results');
// toggle button to show what parties think
let toggleParties = document.getElementById('toggleParties');
// collapse div of what parties think
let collapseParties = document.getElementById('collapseParties');
// div where parties show what they think
let partyOpinions = document.getElementById('partyOpinions');

// current menu
let currentMenu = MENU.START;

/**
 * user's answers array
 */
let answers = [];

// pro contra none

// parties
// subjects

/**
 * generate the important subjects list
 * and the parties for the party selection
 */
createImportantSubjects();
createPartySelection();

// declare after the party selection has been created
let allPartiesSelections = document.querySelectorAll('.partySelections');

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
        displayPartyOpinions(STATEMENTS[i]);
    }
}

function displayPartyOpinions(statement) {
    let proCol = document.getElementById('partyOpinions-pro');
    proCol.innerHTML = '';
    let noneCol = document.getElementById('partyOpinions-none');
    noneCol.innerHTML = '';
    let contraCol = document.getElementById('partyOpinions-contra');
    contraCol.innerHTML = '';

    PARTIES.forEach((party) => {
        let partySubject = statement.parties.find(p => p.name == party.name);
        let div = `<div class="dropdown">
        <button class="btn btn-light dropdown-toggle" type="button"
            id="dropdownPartyOpinion-${party.name}" data-bs-toggle="dropdown" aria-expanded="false">
            ${party.name}
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownPartyOpinion-${party.name}">
            <p class="mt-1">${partySubject.opinion}</p>
        </ul>
    </div>`;
        let template = document.createElement('template');
        template.innerHTML = div;
        // partyOpinions.appendChild(template.content.firstChild);
        switch (partySubject.position) {
            case 'pro':
                proCol.appendChild(template.content.firstChild);
                break;
            case 'none':
                noneCol.appendChild(template.content.firstChild);
                break;
            case 'contra':
                contraCol.appendChild(template.content.firstChild);
                break;
        }
    });
}

function displayResults() {
    partyResultsDiv.innerHTML = '';
    let partyResults = calculateResult().sort((a, b) => parseInt(b.agree) - parseInt(a.agree));

    partyResults.forEach((partyR) => {
        let party = PARTIES.find(p => p.name == partyR.name);
        let partySel = document.getElementById('partyS-' + party.name);
        // party will only be displayed if it was selected
        if (partySel.checked) {
            let percent = partyR.agree / STATEMENTS.length * 100;
            let div = `<div class="">
            <label class="card bg-white border rounded mx-n1">
                <h1 id="partyR-text-${party.name}" class="m-0 ml-2 text-left"><b>${party.long ? party.name + ' | ' + party.long : party.name} ${parseInt(percent)}%</b></h1>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </label>
        </div>`;
            let template = document.createElement('template');
            template.innerHTML = div;
            partyResultsDiv.appendChild(template.content.firstChild);
        }
    });
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
            currentMenu = MENU.START;
            break;
        case MENU.STATEMENTS:
            statementsScreen.hidden = false;
            statementNavBar.hidden = false;
            currentMenu = MENU.STATEMENTS;
            break;
        case MENU.IMPORTANT:
            importantScreen.hidden = false;
            statementNavBar.hidden = false;
            currentMenu = MENU.IMPORTANT;
            break;
        case MENU.PARTY_SELECTION:
            partyScreen.hidden = false;
            statementNavBar.hidden = false;
            currentMenu = MENU.PARTY_SELECTION;
            break;
        case MENU.RESULTS:
            resultsScreen.hidden = false;
            statementNavBar.hidden = false;
            currentMenu = MENU.RESULTS;
            displayResults();
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
        <label class="col-12 btn btn-white bg-white border rounded mx-n1">
            <input type="checkbox" class="form-check-input mx-1" id="subject-${index}">
            <p id="important-subject-text-${index}" class="m-0 ml-2 text-left">${statement.title}</p>
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
        <label class="col-12 btn btn-white bg-white border rounded mx-n1">
            <input type="checkbox" class="form-check-input mx-1 partySelections" id="partyS-${party.name}">
            <p id="partyS-text-${party.name}" class="m-0 ml-2 text-left">${party.long ?? party.name}</p>
        </label>
    </div>`;
        let template = document.createElement('template');
        template.innerHTML = div;
        partySelectionCheckboxes.appendChild(template.content.firstChild);
    });
    allPartiesRadio.checked = false;
    secularPartiesRadio.checked = false;
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

        PARTIES.forEach((party, indexP) => {
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
                resultParties[indexP] = { name: party.name, agree: (resultParties[indexP]) ? resultParties[indexP].agree + amount : amount };

            } else if (!resultParties[indexP]) {
                // if the party has not been declared here it will be
                resultParties[indexP] = { name: party.name, agree: 0 };
            }
        });
    });
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
 * update the party selection
 */
function updatePartySelection() {
    // deselect all the parties
    allPartiesSelections.forEach((party) => {
        party.checked = false;
    });
    if (allPartiesRadio.checked || secularPartiesRadio.checked) {

        if (allPartiesRadio.checked) {
            // check all the parties
            allPartiesSelections.forEach((party) => {
                party.checked = true;
            });
            // enable the next button
            partySelectorNextButton.classList.remove('disabled');

        } else if (secularPartiesRadio.checked) {

            PARTIES.forEach((party) => {
                // only check the current parties 
                if (party.secular) {
                    document.getElementById('partyS-' + party.name).checked = true;
                }
            });
            // enable the next button
            partySelectorNextButton.classList.remove('disabled');
        }
    } else {
        // deselect all the parties
        allPartiesSelections.forEach((party) => {
            party.checked = false;
        });
        // disable the next button
        partySelectorNextButton.classList.add('disabled');
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
    } else if (currentMenu === MENU.PARTY_SELECTION) {
        getMenu(MENU.IMPORTANT);
    }
    else if (currentMenu === MENU.RESULTS) {
        getMenu(MENU.PARTY_SELECTION);
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
partySelectorNextButton.onclick = function () {
    getMenu(MENU.RESULTS);
}

// could use arrow functions here though =>
// could make more dynamic as well
// maybe not now
allPartiesRadio.onclick = function () {
    secularPartiesRadio.checked = false;
    updatePartySelection();
}
secularPartiesRadio.onclick = function () {
    allPartiesRadio.checked = false;
    updatePartySelection();
}

allPartiesSelections.forEach((sel) => {
    sel.onchange = () => {
        if (Array.from(allPartiesSelections).some(e => e.checked)) {
            partySelectorNextButton.classList.remove('disabled');
        } else {
            partySelectorNextButton.classList.add('disabled');
        }
    }
})

toggleParties.onclick = function () {
    if (collapseParties.hidden) {
        collapseParties.hidden = false;
    } else {
        collapseParties.hidden = true;
    }
}
