let startButton = document.getElementById('start-button');
let jumbotron = document.getElementById('start-jumbotron')
let questions = document.getElementById('questions');
let question = 0;

// parties
// subjects

startButton.onclick = function() {
    jumbotron.hidden = true;
    questions.hidden = false;
}
