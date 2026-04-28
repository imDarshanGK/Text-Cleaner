const state = {
  autoClean: false,
  isDarkMode: true,
  keepLineBreaks: false,
  undoSnapshot: null,
};

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const inputCharCount = document.getElementById("inputCharCount");
const inputWordCount = document.getElementById("inputWordCount");
const outputWordCount = document.getElementById("outputWordCount");
const statusMessage = document.getElementById("statusMessage");

const autoCleanToggle = document.getElementById("autoCleanToggle");
const lineBreaksCheckbox = document.getElementById("lineBreaksCheckbox");
const themeToggle = document.getElementById("themeToggle");
const undoBtn = document.getElementById("undoBtn");
const moreOptionsBtn = document.getElementById("moreOptionsBtn");
const advancedOptions = document.getElementById("advancedOptions");

const pasteBtn = document.getElementById("pasteBtn");
const cleanBtn = document.getElementById("cleanBtn");
const caseBtn = document.getElementById("caseBtn");
const bulletsBtn = document.getElementById("bulletsBtn");
const symbolsBtn = document.getElementById("symbolsBtn");
const resetBtn = document.getElementById("resetBtn");

const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearOutputBtn = document.getElementById("clearOutputBtn");

function countWords(text) {
  const words = text.trim().match(/\S+/g);
  return words ? words.length : 0;
}

function cleanTextValue(text, keepLineBreaks) {
  if (!text.trim()) {
    return "";
  }

  if (keepLineBreaks) {
    return text
      .split(/\r?\n/)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return text.replace(/\s+/g, " ").trim();
}

function fixCaseValue(text) {
  const lowered = text.toLowerCase();
  return lowered.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

function makeBulletsValue(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line) => `- ${line}`).join("\n");
}

function removeSymbolsValue(text, keepLineBreaks) {
  const normalized = keepLineBreaks ? text : text.replace(/\r?\n/g, " ");
  const cleaned = normalized.replace(/[^\w\s\n]/g, "");
  return keepLineBreaks ? cleaned : cleaned.replace(/\s+/g, " ").trim();
}

function saveUndoSnapshot() {
  state.undoSnapshot = {
    input: inputText.value,
    output: outputText.value,
    status: statusMessage.textContent,
  };

  undoBtn.disabled = false;
}

function updateCounts() {
  inputCharCount.textContent = String(inputText.value.length);
  inputWordCount.textContent = String(countWords(inputText.value));
  outputWordCount.textContent = String(countWords(outputText.value));
}

function updateButtonStates() {
  const hasInput = Boolean(inputText.value.trim());
  const hasOutput = Boolean(outputText.value.trim());

  [cleanBtn, caseBtn, bulletsBtn, symbolsBtn, resetBtn].forEach((btn) => {
    btn.disabled = !hasInput;
  });

  copyBtn.disabled = !hasOutput;
  downloadBtn.disabled = !hasOutput;
  clearOutputBtn.disabled = !hasOutput;
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function readClipboardTextFallback() {
  const fallback = window.prompt("Paste text and press OK:", "");
  return fallback === null ? "" : fallback;
}

function flashOutput() {
  outputText.classList.remove("flash");
  // Force reflow so repeated actions can re-trigger the animation.
  void outputText.offsetWidth;
  outputText.classList.add("flash");
  // also add show class briefly
  outputText.classList.add("show");
  setTimeout(() => outputText.classList.remove("show"), 700);
}

function applyOutput(nextOutput, successMessage) {
  outputText.value = nextOutput;
  if (!nextOutput.trim()) {
    setStatus("Output will appear here...");
  } else {
    setStatus(successMessage + " ✓");
    // subtle fade-in
    outputText.classList.add("flash");
    setTimeout(() => outputText.classList.remove("flash"), 380);
  }
  updateCounts();
  updateButtonStates();
}

function runCleanIfAuto() {
  if (!state.autoClean) {
    return;
  }
  const cleaned = cleanTextValue(inputText.value, state.keepLineBreaks);
  applyOutput(cleaned, "Auto cleaned");
}

function doAction(actionFn, successMessage) {
  const current = inputText.value;
  if (!current.trim()) {
    applyOutput("", "Output will appear here...");
    return;
  }

  saveUndoSnapshot();
  const next = actionFn(current);
  applyOutput(next, successMessage);
}

inputText.addEventListener("input", () => {
  updateCounts();
  updateButtonStates();
  if (!inputText.value.trim() && !outputText.value.trim()) {
    setStatus("Output will appear here...");
  }
  runCleanIfAuto();
});

lineBreaksCheckbox.addEventListener("change", (event) => {
  state.keepLineBreaks = event.target.checked;
  runCleanIfAuto();
});

autoCleanToggle.addEventListener("click", () => {
  state.autoClean = !state.autoClean;
  autoCleanToggle.setAttribute("aria-checked", String(state.autoClean));
  if (state.autoClean) {
    runCleanIfAuto();
  }
});

themeToggle.addEventListener("click", () => {
  state.isDarkMode = !state.isDarkMode;
  document.body.setAttribute("data-theme", state.isDarkMode ? "dark" : "light");
  themeToggle.textContent = state.isDarkMode ? "🌙" : "☀️";
});

undoBtn.addEventListener("click", () => {
  if (!state.undoSnapshot) {
    return;
  }

  inputText.value = state.undoSnapshot.input;
  outputText.value = state.undoSnapshot.output;
  setStatus(state.undoSnapshot.status);
  state.undoSnapshot = null;
  undoBtn.disabled = true;
  updateCounts();
  updateButtonStates();
});

pasteBtn.addEventListener("click", async () => {
  try {
    const clipText = navigator.clipboard && navigator.clipboard.readText
      ? await navigator.clipboard.readText()
      : readClipboardTextFallback();
    inputText.value = clipText;
    updateCounts();
    updateButtonStates();
    if (!clipText.trim()) {
      setStatus("Output will appear here...");
    }
    runCleanIfAuto();
  } catch (error) {
    const clipText = readClipboardTextFallback();
    inputText.value = clipText;
    updateCounts();
    updateButtonStates();
    if (!clipText.trim()) {
      setStatus("Output will appear here...");
    } else {
      setStatus("Pasted (fallback) ✓");
    }
    runCleanIfAuto();
  }
});

cleanBtn.addEventListener("click", () => {
  doAction((text) => cleanTextValue(text, state.keepLineBreaks), "Text cleaned");
  if (outputText.value.trim()) {
    flashOutput();
  }
});

// toggle advanced options
if (moreOptionsBtn && advancedOptions) {
  moreOptionsBtn.addEventListener('click', () => {
    const hidden = advancedOptions.hasAttribute('hidden');
    if (hidden) {
      advancedOptions.removeAttribute('hidden');
      moreOptionsBtn.textContent = 'More options ▴';
    } else {
      advancedOptions.setAttribute('hidden', '');
      moreOptionsBtn.textContent = 'More options ▾';
    }
  });
}

caseBtn.addEventListener("click", () => {
  doAction((text) => fixCaseValue(text), "Case fixed");
});

bulletsBtn.addEventListener("click", () => {
  doAction((text) => makeBulletsValue(text), "Bullets created");
});

symbolsBtn.addEventListener("click", () => {
  doAction((text) => removeSymbolsValue(text, state.keepLineBreaks), "Symbols removed");
});

resetBtn.addEventListener("click", () => {
  saveUndoSnapshot();
  inputText.value = "";
  outputText.value = "";
  setStatus("Output will appear here...");
  updateCounts();
  updateButtonStates();
});

copyBtn.addEventListener("click", async () => {
  if (!outputText.value.trim()) {
    return;
  }
  try {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      throw new Error("Clipboard API unavailable");
    }
    await navigator.clipboard.writeText(outputText.value);
    const original = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = original;
    }, 1000);
  } catch (error) {
    outputText.focus();
    outputText.select();
    setStatus("Clipboard blocked — press Ctrl+C to copy");
  }
});

// update copy button text on successful copy
function showCopiedFeedback(btn) {
  const orig = btn.textContent;
  btn.textContent = 'Copied ✓';
  setTimeout(() => { btn.textContent = orig; }, 1100);
}

downloadBtn.addEventListener("click", () => {
  if (!outputText.value.trim()) {
    return;
  }

  const blob = new Blob([outputText.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cleaned-text.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("Downloaded cleaned-text.txt");
});

clearOutputBtn.addEventListener("click", () => {
  if (!outputText.value.trim()) {
    setStatus("Output will appear here...");
    return;
  }
  saveUndoSnapshot();
  outputText.value = "";
  setStatus("Output cleared");
  updateCounts();
  updateButtonStates();
});

updateCounts();
updateButtonStates();
setStatus("Output will appear here...");
