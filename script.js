const body = document.querySelector("body");
const form = document.getElementsByTagName("form")[0];
const [nameField, dateField, timeZoneField] =
  document.querySelectorAll("input");
const errorMessage = document.getElementById("on-error");

const backButton = document.createElement("button");
backButton.textContent = "Back";

let inputDate;
let currentDate;
let timeZone;
let timerId;

nameField.addEventListener("change", checkName);
nameField.addEventListener("click", () => {
  nameField.value = "";
});

dateField.addEventListener("change", checkDate);

timeZoneField.addEventListener("change", checkTimeZone);
timeZoneField.addEventListener("click", () => {
  timeZoneField.value = "";
});

function checkName(event) {
  event.preventDefault();
  const pattern = /^[a-zA-Z]+$/;
  if (nameField.value.match(pattern)) {
    nameField.classList.remove("error");
  } else {
    nameField.value = "Please enter a valid name";
    nameField.classList.add("error");
  }
  toggleErrorOrCountdown();
}

function checkDate(event) {
  event.preventDefault();
  dateField.classList.remove("error");
  inputDate = new Date(dateField.value);
  inputDate = inputDate.getTime();
  currentDate = new Date();
  currentDate = currentDate.getTime();
  if (isNaN(inputDate) || currentDate >= inputDate) {
    dateField.classList.add("error");
  }
  toggleErrorOrCountdown();
}

function checkTimeZone(event) {
  event.preventDefault();
  timeZone = Number(timeZoneField.value);
  if (
    timeZone >= -12 &&
    timeZone <= 14 &&
    currentDate < inputDate - timeZone * 60 * 60 * 1000
  ) {
    timeZoneField.classList.remove("error");
  } else {
    timeZoneField.value = "Please enter a valid time zone";
    timeZoneField.classList.add("error");
  }
  toggleErrorOrCountdown();
}

function toggleErrorOrCountdown() {
  if (
    nameField.classList.contains("error") ||
    dateField.classList.contains("error") ||
    timeZoneField.classList.contains("error")
  ) {
    errorMessage.style.display = "flex";
    return;
  }
  errorMessage.style.display = "none";
  if (
    nameField.value != "" &&
    !isNaN(inputDate) &&
    currentDate < inputDate &&
    timeZone >= -12 &&
    timeZone <= 14
  ) {
    form.style.display = "none";
    createTimeDisplay();
    timerId = setInterval(refreshTimeDisplay, 1000);
  }
}

function generateCountdown() {
  const now = new Date().getTime();
  const timeDifference = inputDate - now - timeZone * 60 * 60 * 1000;

  class TimeDisplay {
    constructor(timeDifference) {
      this.days = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
      this.hours = Math.floor((timeDifference / 1000 / 60 / 60) % 24);
      this.minutes = Math.floor((timeDifference / 1000 / 60) % 60);
      this.seconds = Math.floor((timeDifference / 1000) % 60);
    }
  }

  return new TimeDisplay(timeDifference);
}

function createTimeDisplay() {
  const time = generateCountdown();

  const countdownTimer = document.createElement("div");
  countdownTimer.setAttribute('id', 'countdown-timer');
  body.appendChild(countdownTimer);

  createTimeDisplayElement(time.days, "days");
  createTimeDisplayElement(time.hours, "hours");
  createTimeDisplayElement(time.minutes, "minutes");
  createTimeDisplayElement(time.seconds, "seconds");

  body.appendChild(backButton);
  backButton.style.display = "inline";
  backButton.addEventListener("click", goBack);
}

function goBack() {
  form.style.display = "block";
  const countdownTimer = document.getElementById('countdown-timer');
  countdownTimer.remove();
  backButton.style.display = "none";
  nameField.value = "";
  dateField.value = undefined;
  inputDate = undefined;
  currentDate = undefined;
  timeZoneField.value = "";
  timeZone = undefined;
  clearInterval(timerId);
  backButton.removeEventListener("click", goBack);
}

function createTimeDisplayElement(element, type) {
  const countdownTimer = document.getElementById('countdown-timer');

  const elementDisplay = document.createElement("div");
  countdownTimer.appendChild(elementDisplay);

  const elementCount = document.createElement("div");
  elementCount.classList.add("time-display");
  elementCount.textContent = element;
  elementDisplay.appendChild(elementCount);

  const elementText = document.createElement("p");
  elementText.textContent = `${type}`;
  elementDisplay.appendChild(elementText);
}

function refreshTimeDisplay() {
  const time = generateCountdown();
  const timeValues = Object.values(time);
  const displays = Array.from(document.getElementsByClassName("time-display"));
  for (let i = 0; i < displays.length; i++) {
    displays[i].textContent = timeValues[i];
  }
}
