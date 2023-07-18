function triggerGuessWithEnter() {
    const guessInputElement = document.getElementById('guess-input');

    guessInputElement.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            checkGuess();
        }
    });
}

function setGameVisibility(isVisible) {
    const gameElements = document.querySelectorAll('#intro-p, #history-p, #guess-wrapper');
    const paragraphs = ['intro-p', 'history-p', 'results-p'];

    if (isVisible) {
        paragraphs.forEach(paragraph => setElementText(paragraph, '')); // clear text from last game
        gameElements.forEach(element => element.classList.remove('hide')); // show game elements
        document.getElementById('replay').classList.add('hide'); // hide replay button
    } else {
        gameElements.forEach(element => element.classList.add('hide')); // hide game elements
        document.getElementById('replay').classList.remove('hide'); // show replay button
    }
}

function promptForMaxNum() {
    let validInput = false;
    let input;

    while (!validInput) {
        input = Number(window.prompt('Enter a whole number greater than 1.\nThis will be the maximum number in this guessing game.\n(Decimal numbers will be rounded.)'));
        validInput = !isNaN(input) && input >= 1.5;
    }
    const maxNum = Math.round(input);
    return maxNum;
}

function getRandomNum(maxNum) {
    const num = Math.floor(Math.random() * maxNum) + 1; // random whole number from 1 to maxNum
    return num;
}

function setElementText(elementID, str) {
    document.getElementById(elementID).innerHTML = str;
}

function getGuessProperties(guessStr, maxNum, targetNum, array) {
    let isValid = false;
    let isCorrect = false;
    let resultMessage = '';
    const properties = {isValid, isCorrect, resultMessage, array};
    
    const edgeCaseRegex = /^\s*$/; // matches string with zero to unlimited whitespace characters (i.e. blank guess)
    const isEdgeCase = edgeCaseRegex.test(guessStr); // returns true if guess is empty string or whitespace
    const guess = Math.round(Number(guessStr)); // Edge Case: Number() returns 0 on empty strings or whitespace

    // invalid guess cases
    if (isNaN(guess) || isEdgeCase) {
        properties.resultMessage = 'That is not a number!'; // guess is not a number
    } else if (guess < 1 || guess > maxNum) {
        properties.resultMessage = 'That number is not in range, try again.'; // guess is not in range
    } else if (array.includes(guess)) {
        properties.resultMessage = 'That number was guessed already, try again.'; // guess is a duplicate
    } else {
        properties.isValid = true;
        properties.array.push(guess); // push valid guess to array
    }

    // valid guess cases
    if (guess < targetNum && properties.isValid) {
        properties.resultMessage = 'No, try a <strong>higher</strong> number.'; // guess is too low
    } else if (guess > targetNum && properties.isValid) {
        properties.resultMessage = 'No, try a <strong>lower</strong> number.'; // guess is too high
    } else if (guess === targetNum) {
        properties.resultMessage = `<h5 id="target-num">Target Number: ${targetNum}</h5><br>You got it!  It took you ${array.length} tries and your guesses were ${array.join(', ')}.`; // correct guess
        properties.isCorrect = true;
    }

    return properties;
}

function gameMaker() {
    setGameVisibility(true); // reset text and make guessing elements visible

    const maxNum = promptForMaxNum();
    const targetNum = getRandomNum(maxNum);
    let guessArray = []; // store valid guesses (i.e. unique whole numbers from 1 to maxNum)
    const guessInputElement = document.getElementById('guess-input');

    setElementText('intro-p', `Guess a whole number between 1 and ${maxNum}.<br>(Decimal numbers will be rounded.)`);

    return function() {
        const guessStr = guessInputElement.value;
        const guessProperties = getGuessProperties(guessStr, maxNum, targetNum, guessArray);

        guessArray = guessProperties.array; // update closure array
        guessInputElement.value = ''; // reset input field
        setElementText('results-p', guessProperties.resultMessage); // display result

        if (guessProperties.isValid) setElementText('history-p', `History: ${guessArray.join(', ')}`); // update guess history
        if (guessProperties.isCorrect) setGameVisibility(false); // hide guessing elements to prevent more guesses
    }
}

// allows Enter keypress to trigger Guess button
triggerGuessWithEnter();

// declare checkGuess functionality associated with Guess button click
let checkGuess = gameMaker();

// declare resetGame functionality associated with Play Again button click
function resetGame() {
    checkGuess = gameMaker();
}