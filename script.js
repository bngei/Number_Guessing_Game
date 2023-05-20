// Check if the local storage is empty and if it is, initialize it
if(localStorage.getItem("previousGuess") === null) {
    localStorage.setItem("previousGuess", JSON.stringify([]));
    localStorage.setItem("lives", JSON.stringify(10));
    localStorage.setItem("userGuess", JSON.stringify([]));
    localStorage.setItem("answer", JSON.stringify(generateNumber()));
    localStorage.setItem("theme", JSON.stringify("darkMode"));
} 


// If the local storage is not empty, we get the values from it
let previousGuess = JSON.parse(localStorage.getItem("previousGuess"));
let lives = JSON.parse(localStorage.getItem("lives"));
let userGuess = [];
const answer = JSON.parse(localStorage.getItem("answer"));
const answerStr = answer.toString();


// Function that inserts the user guess
function insertIntoPreviousGuess(value) {
    previousGuess.push(value);
    console.log(value);
    userGuess.splice(0, userGuess.length)
}


// Function that outputs the previous guesses
function outputPreviousGuess(index) {
    if(previousGuess[index] === undefined || previousGuess.length < index) {
        document.write(" ");
    }
    else {
        document.write(previousGuess[index]);
    }
}


// Function that returns the number of correct numbers
function outputCorrectNumber(index) {
    if(previousGuess[index] === undefined || previousGuess.length < index) {
        document.write(" ");
    }
    else {
        let correctNumbers = 0;
        let guess = previousGuess[index];
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                if(guess[i] === answerStr[j]) {
                    correctNumbers++;
                }
            }
        }
       document.write(correctNumbers);
    }
}


// Function that returns the number of correct positions
function outputCorrectPosition(index) {
    if(previousGuess[index] === undefined || previousGuess.length < index) {
        document.write(" ");
    }
    else {
        let correctPositions = 0;
        let guess = previousGuess[index];
        for(let i = 0; i < 4; i++) {
            if(guess[i] === answerStr[i]) {   
                correctPositions++;
            }
        }
        document.write(correctPositions);
    }
}


// Function that inputs a number into the userGuess array
function inputIntoCurrentGuess(number) {
    if(userGuess.length < 4) {
        // The first number cannot be 0
        if(number === 0 && userGuess.length === 0) {
            return;
        }
        // Checks if the number is already in guess
        for(let i = 0; i<userGuess.length; i++) {
            if(userGuess[i] === number) {
                return;
            }
        }
        userGuess.push(number);
    }
}


// Function that submits the user guess and edits the lives
function submit() {
    if (userGuess.length === 4) {
        let value = "";
        for(let i = 0; i < userGuess.length; i++) {
            value += userGuess[i];
        }
        if(value === answerStr){
            insertIntoPreviousGuess(value);
            openWinPopup();
            return;
        }
        else {
            insertIntoPreviousGuess(value);
            lives--;
            localStorage.setItem("lives", JSON.stringify(lives));
            localStorage.setItem("previousGuess", JSON.stringify(previousGuess));
            localStorage.setItem("userGuess", JSON.stringify(userGuess));
            if(lives <= 0) {
                openLosePopup();
                return;
            }
            window.location.reload();
        }
    }
}


// Function that removes the last number added
function remove() {
    if(userGuess.length > 0) {
        userGuess.pop();
    }
}


// Function that outputs currentGuess
function outputCurrentGuess() {
    let value = "";
    for(let i = 0; i < userGuess.length; i++) {
        value += userGuess[i];
    }
    const container = document.getElementById("currentGuess");
    container.innerHTML = value;
}


// Function that randomly generates a number
function generateNumber() {
    let randomNum = Math.floor(Math.random() * (9876 - 1234 + 1)) + 1234;
    randomNumStr = randomNum.toString();


    for(let i = 0; i < 4; i++) {
        for(let j = i + 1; j < 4; j++) {
            if(randomNumStr[i] === randomNumStr[j]) {
                randomNum = parseInt(randomNumStr);
                if(j === 1) {
                    randomNum += 100;
                    i = 0;
                    j = 0;
                } else if(j === 2) {
                    randomNum += 10;
                    i = 0;
                    j = 0;
                } else if(j === 3) {
                    randomNum += 1;
                    i = 0;
                    j = 0;
                }
                randomNumStr = randomNum.toString();
            }
        }
    }
    randomNum = parseInt(randomNumStr);
    return randomNum;
}


// Function that opens a popup
function openWinPopup() {
    popupContainer = document.getElementById("winPopup");
    popupContainer.style.display = "block";
}


// Function that closes a popup
function closeWinPopup() {
    popupContainer = document.getElementById("winPopup");
    popupContainer.style.display = "none";
    localStorage.clear();
    location.reload();  
}


// Function that opens a popup
function openLosePopup() {
    popupContainer = document.getElementById("losePopup");
    popupContainer.style.display = "block";
}


// Function that closes a popup
function closeLosePopup() {
    popupContainer = document.getElementById("losePopup");
    popupContainer.style.display = "none";
    localStorage.clear();
    location.reload();  
}


// Function to handle the keyboard input
window.addEventListener('keydown', pressedKey);
function pressedKey(event) {
    const key = event.key;
    const number = parseInt(key);

    if (!isNaN(number)) {
        inputIntoCurrentGuess(number);
        outputCurrentGuess();
    } else if(key === "Backspace") {
        remove();
        outputCurrentGuess();
    } else if(key === "Enter" && lives <= 0) {
        closeWinPopup();
        closeLosePopup();
    } else if(key === "Enter") {
        submit();
    }
}


// Function that checks the theme when the page refreshes
window.addEventListener('load', checkThemeOnReload);
function checkThemeOnReload() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'lightMode') {
        document.body.classList.add('lightMode');
        setTheme("lightMode");
    } 
}


// Function that sets the theme when the page loads
function setTheme() {
    const body = document.querySelector('body');
    const changeThemeButton = document.getElementsByClassName('changeThemeButton')[0];
    const table = document.getElementsByClassName('table')[0];
    const currentGuessBox = document.getElementsByClassName('currentGuessBox')[0];
    const buttons = document.getElementsByClassName('buttons')[0];


    body.classList.toggle('darkMode');
    table.classList.toggle('darkMode');
    currentGuessBox.classList.toggle('darkMode');
    buttons.classList.toggle('darkMode');
    changeThemeButton.classList.toggle('darkMode');
}


// Function that changes the theme and the local storage theme value
function changeTheme() {
    // This part changes the theme
    const body = document.querySelector('body');
    const changeThemeButton = document.getElementsByClassName('changeThemeButton')[0];
    const table = document.getElementsByClassName('table')[0];
    const currentGuessBox = document.getElementsByClassName('currentGuessBox')[0];
    const buttons = document.getElementsByClassName('buttons')[0];

    body.classList.toggle('darkMode');
    table.classList.toggle('darkMode');
    currentGuessBox.classList.toggle('darkMode');
    buttons.classList.toggle('darkMode');
    changeThemeButton.classList.toggle('darkMode');


    // THIS PART DOES NOT  WORK
    // This part changes the image
    var imgElement = document.getElementsByClassName("changeThemeButton")[0];
    var currentSrc = imgElement.getAttribute("src");
    if (currentSrc === "Pictures/Dark Mode.png") {
        imgElement.setAttribute("src", "Pictures/Light Mode.png");
    } else {
        imgElement.setAttribute("src", "Pictures/Dark Mode.png");
    }


    // Changes the local storage to light mode or dark mode
    let activeTheme = localStorage.getItem("theme");
    console.log(activeTheme);
    if(activeTheme === "lightMode") {
        localStorage.setItem("theme", "darkMode");
    } else {
        localStorage.setItem("theme", "lightMode");
    }
}
