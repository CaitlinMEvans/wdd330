const countdownDisplay = document.getElementById("countdown");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");

let timeLeft = 10;
let countdownInterval;
let isPaused = false;

function startCountdown() {
    if (!countdownInterval) { // Prevent multiple intervals
        countdownInterval = setInterval(() => {
            if (!isPaused && timeLeft > 0) {
                countdownDisplay.textContent = timeLeft;
                timeLeft--;
            } else if (timeLeft === 0) {
                clearInterval(countdownInterval);
                countdownDisplay.textContent = "Time's up!";
            }
        }, 1000);
    }
}

function pauseCountdown() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? "Resume" : "Pause";
}

function resetCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    timeLeft = 10;
    countdownDisplay.textContent = timeLeft;
    isPaused = false;
    pauseButton.textContent = "Pause";
}

// Event Listeners
startButton.addEventListener("click", startCountdown);
pauseButton.addEventListener("click", pauseCountdown);
resetButton.addEventListener("click", resetCountdown);
