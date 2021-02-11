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

// parties
// subjects

startButton.onclick = function() {
    startScreen.hidden = true;
    statementsScreen.hidden = false;
    nextQuestion();
}

function nextQuestion() {

}
