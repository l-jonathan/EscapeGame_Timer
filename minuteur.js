// Credit: Mateusz Rybczonec for the circle animation and timer

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 900;
const ALERT_THRESHOLD = 300;

const COLOR_CODES = {
  info: {
    color: "yellow",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
  good: {
    color: "green",
  },
};

const TIME_LIMIT = 1000;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>

  <div class="input-code">
    <form action = "get-method.php" method = "post">
      <label for="input-code" id="input-code-label">CODE</label>
      </br>
      <input type="text" id="input-code"></input>
      </br>
      <div class="input-code-btn">
        <div id="input-code-valid" onclick="checkCode()">✓</div>
        <div id="input-code-cancel" onclick="document.getElementById('input-code').value = ''">X</div>
      </div>
    </form>

    <script>
      if (isset($_POST['submit'])) {
        echo "GeeksforGeeks";
      }
    </script>

  </div>
</div>
`;

startTimer();
var stopMinuteur = false;
var codeError = false;

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    console.log("TIME_LIMIT: " + TIME_LIMIT);
    console.log("timePassed: " + timePassed);
    console.log("timeLeft: " + timeLeft);
    document.getElementById("base-timer-label").innerHTML =
      formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0 || stopMinuteur == true) {
      onTimesUp();
    }
    if (codeError == true) {
      timePassed = timePassed + 60;
      console.log("TIME_LIMIT: " + TIME_LIMIT);
      console.log("timePassed: " + timePassed);
      console.log("timeLeft: " + timeLeft);
      
    timePassed = timePassed += 1;
    }
    codeError = false;
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function checkCode() {
  const { alert, warning, info, good } = COLOR_CODES;
  if (document.getElementById('input-code').value == "CODEBON") {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(alert.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(good.color);
    stopMinuteur = true;
  } else {
    codeError = true;
  }
}