let display = document.getElementById('display');
let historyList = document.getElementById('history-list');
let clearHistoryBtn = document.getElementById('clear-history-btn');

// Ses efektleri (boş da bırakabilirsin)
const clickSound = new Audio('click.mp3');
const errorSound = new Audio('error.mp3');

function appendValue(value) {
  display.value += value;
  clickSound.play();
}

function clearDisplay() {
  display.value = '';
  clickSound.play();
}

function calculate() {
  try {
    let result = eval(display.value);
    if (result === undefined) return;
    addHistory(display.value + " = " + result);
    display.value = result;
    clickSound.play();
  } catch {
    display.value = 'Hata';
    errorSound.play();
  }
}

function addHistory(entry) {
  let li = document.createElement('li');
  li.textContent = entry;
  historyList.prepend(li);
  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

clearHistoryBtn.addEventListener('click', () => {
  historyList.innerHTML = '';
  clickSound.play();
});

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

document.addEventListener('keydown', function (event) {
  const allowedKeys = "0123456789/*-+.=";
  if (allowedKeys.includes(event.key)) {
    event.preventDefault();
    if (event.key === "=" || event.key === "Enter") {
      calculate();
    } else if (event.key === "Backspace") {
      display.value = display.value.slice(0, -1);
    } else {
      appendValue(event.key);
    }
  } else if (event.key === "Escape") {
    clearDisplay();
  }
});
