const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const pasteBtn = document.getElementById("pasteBtn");
const clearInputBtn = document.getElementById("clearInputBtn");
const cleanBtn = document.getElementById("cleanBtn");
const caseBtn = document.getElementById("caseBtn");
const symbolsBtn = document.getElementById("symbolsBtn");
const bulletsBtn = document.getElementById("bulletsBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearOutputBtn = document.getElementById("clearOutputBtn");

function cleanTextValue(text) {
  if (!text.trim()) {
    return "";
  }

  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function fixCaseValue(text) {
  const lowered = text.toLowerCase();
  return lowered.replace(/(^|[.!?]\s+|\n\s*)([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`);
}

function removeSymbolsValue(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim())
    .join("\n")
    .trim();
}

function makeBulletsValue(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line) => `- ${line}`).join("\n");
}

function readClipboardTextFallback() {
  const fallback = window.prompt("Paste text and press OK:", "");
  return fallback === null ? "" : fallback;
}

function setOutput(value) {
  outputText.value = value;
  updateButtonStates();
}

function applyFromInput(transform) {
  const current = inputText.value;

  if (!current.trim()) {
    return;
  }

  setOutput(transform(current));
}

function updateButtonStates() {
  const hasInput = Boolean(inputText.value.trim());
  const hasOutput = Boolean(outputText.value.trim());

  [cleanBtn, caseBtn, symbolsBtn, bulletsBtn, clearInputBtn].forEach((button) => {
    if (button) {
      button.disabled = !hasInput;
    }
  });

  if (copyBtn) copyBtn.disabled = !hasOutput;
  if (downloadBtn) downloadBtn.disabled = !hasOutput;
  if (clearOutputBtn) clearOutputBtn.disabled = !hasOutput;
}

if (inputText) {
  inputText.addEventListener("input", updateButtonStates);
}

if (pasteBtn) {
  pasteBtn.addEventListener("click", async () => {
    try {
      const clipText = navigator.clipboard && navigator.clipboard.readText
        ? await navigator.clipboard.readText()
        : readClipboardTextFallback();

      inputText.value = clipText;
      inputText.focus();
      updateButtonStates();
    } catch (error) {
      const clipText = readClipboardTextFallback();
      inputText.value = clipText;
      inputText.focus();
      updateButtonStates();
    }
  });
}

if (clearInputBtn) {
  clearInputBtn.addEventListener("click", () => {
    inputText.value = "";
    updateButtonStates();
  });
}

if (cleanBtn) {
  cleanBtn.addEventListener("click", () => {
    applyFromInput(cleanTextValue);
  });
}

if (caseBtn) {
  caseBtn.addEventListener("click", () => {
    applyFromInput(fixCaseValue);
  });
}

if (symbolsBtn) {
  symbolsBtn.addEventListener("click", () => {
    applyFromInput(removeSymbolsValue);
  });
}

if (bulletsBtn) {
  bulletsBtn.addEventListener("click", () => {
    applyFromInput(makeBulletsValue);
  });
}

if (copyBtn) {
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
      copyBtn.textContent = "Copied ✓";
      window.setTimeout(() => {
        copyBtn.textContent = original;
      }, 1000);
    } catch (error) {
      outputText.focus();
      outputText.select();
      const original = copyBtn.textContent;
      copyBtn.textContent = "Copied ✓";
      window.setTimeout(() => {
        copyBtn.textContent = original;
      }, 1000);
    }
  });
}

if (downloadBtn) {
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
  });
}

if (clearOutputBtn) {
  clearOutputBtn.addEventListener("click", () => {
    outputText.value = "";
    updateButtonStates();
  });
}

updateButtonStates();
