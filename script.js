// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// setup screen chip groups
const categoryGroup = document.getElementById("category-group");
const difficultyGroup = document.getElementById("difficulty-group");
const amountGroup = document.getElementById("amount-group");

// ===== THEME SWITCHER =====
// each theme's "swatch" color is just its --primary value, used to
// paint the little circle buttons so the picker previews itself
const themes = [
  { id: "default", name: "Midnight Navy", swatch: "#1f3a5f" },
  { id: "olive-relic", name: "Olive Relic", swatch: "#364025" },
  { id: "old-wine", name: "Old Wine", swatch: "#733216" },
  { id: "snowy-days", name: "Snowy Days", swatch: "#391213" },
  { id: "moody-earth", name: "Moody Earth", swatch: "#1e332e" },
  { id: "future-home", name: "Future Home", swatch: "#d9a590" },
  { id: "copper-tide", name: "Copper Tide", swatch: "#864e3f" },
  { id: "velvet-dusk", name: "Velvet Dusk", swatch: "#9d3b50" },
];

const themeToggle = document.getElementById("theme-toggle");
const themeToggleSwatch = document.getElementById("theme-toggle-swatch");
const themePanel = document.getElementById("theme-panel");

// build one small round swatch button per theme - done in JS instead of
// hardcoding 8 buttons in the HTML, so adding a theme later is a
// one-line change to the array above
themes.forEach((theme) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-swatch-btn";
  btn.style.backgroundColor = theme.swatch;
  btn.dataset.theme = theme.id;
  btn.setAttribute("aria-label", theme.name);
  btn.addEventListener("click", () => setTheme(theme.id));
  themePanel.appendChild(btn);
});

function setTheme(themeId) {
  // "default" has no [data-theme] CSS rule on purpose - it's just :root -
  // so we remove the attribute entirely to fall back to it
  if (themeId === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", themeId);
  }

  const active = themes.find((t) => t.id === themeId) || themes[0];
  themeToggleSwatch.style.backgroundColor = active.swatch;

  themePanel.querySelectorAll(".theme-swatch-btn").forEach((b) => {
    b.classList.toggle("selected", b.dataset.theme === themeId);
  });

  localStorage.setItem("preferredTheme", themeId);
  closeThemePanel();
}

function openThemePanel() {
  themePanel.classList.add("open");
  themeToggle.setAttribute("aria-expanded", "true");
}

function closeThemePanel() {
  themePanel.classList.remove("open");
  themeToggle.setAttribute("aria-expanded", "false");
}

themeToggle.addEventListener("click", (event) => {
  event.stopPropagation(); // don't let this click immediately close itself
  if (themePanel.classList.contains("open")) {
    closeThemePanel();
  } else {
    openThemePanel();
  }
});

// clicking anywhere outside the panel closes it
document.addEventListener("click", (event) => {
  if (!themePanel.contains(event.target) && event.target !== themeToggle) {
    closeThemePanel();
  }
});

// restore saved theme on load, same defensive try/catch pattern as
// the language restore below
try {
  const savedTheme = localStorage.getItem("preferredTheme");
  if (savedTheme && themes.some((t) => t.id === savedTheme)) {
    setTheme(savedTheme);
  } else {
    themePanel.querySelectorAll(".theme-swatch-btn").forEach((b) => {
      b.classList.toggle("selected", b.dataset.theme === "default");
    });
  }
} catch (err) {
  console.error("Theme restore failed, continuing with default theme:", err);
}

// language switcher
const langSwitch = document.getElementById("lang-switch");
let currentLang = "en";

// ===== UI TEXT DICTIONARY (Phase 1) =====
// every fixed piece of text on the page lives here - two languages,
// same keys. this is separate from the quiz question translation,
// which comes live from an API instead
const translations = {
  en: {
    eyebrowStart: "Trivia Challenge",
    headlinePrefix: "Quiz",
    headlineHighlight: "Time",
    subtext: "Pick your battleground, then see how much you really know.",
    labelCategory: "Category",
    labelDifficulty: "Difficulty",
    labelAmount: "Number of Questions",
    chipAny: "Any",
    chipComputers: "Computers",
    chipHistory: "History",
    chipSports: "Sports",
    chipGeography: "Geography",
    chipScienceNature: "Science & Nature",
    chipMusic: "Music",
    chipFilm: "Film",
    chipGeneral: "General Knowledge",
    chipEasy: "Easy",
    chipMedium: "Medium",
    chipHard: "Hard",
    btnStart: "Start Quiz",
    quizQuestionWord: "Question",
    quizOfWord: "of",
    labelScore: "Score:",
    eyebrowResult: "All Done",
    headlineResults: "Results",
    btnRestart: "Restart Quiz",
    msgPerfect: "Perfect! You're a genius!",
    msgGreat: "Great job! You know your stuff!",
    msgGood: "Good effort! Keep learning!",
    msgNotBad: "Not bad! Try again to improve!",
    msgKeepStudying: "Keep studying! You'll get better!",
  },
  fa: {
    eyebrowStart: "چالش دانستنی‌ها",
    headlinePrefix: "زمان",
    headlineHighlight: "کوییز",
    subtext: "میدون رو انتخاب کن، بعد ببین چقدر واقعاً بلدی.",
    labelCategory: "دسته‌بندی",
    labelDifficulty: "سطح سختی",
    labelAmount: "تعداد سوالات",
    chipAny: "همه",
    chipComputers: "کامپیوتر",
    chipHistory: "تاریخ",
    chipSports: "ورزش",
    chipGeography: "جغرافیا",
    chipScienceNature: "علوم و طبیعت",
    chipMusic: "موسیقی",
    chipFilm: "فیلم",
    chipGeneral: "عمومی",
    chipEasy: "آسان",
    chipMedium: "متوسط",
    chipHard: "سخت",
    btnStart: "شروع کوییز",
    quizQuestionWord: "سوال",
    quizOfWord: "از",
    labelScore: "امتیاز:",
    eyebrowResult: "تمام شد",
    headlineResults: "نتایج",
    btnRestart: "شروع دوباره",
    msgPerfect: "عالی! نابغه‌ای!",
    msgGreat: "آفرین! خیلی بلدی!",
    msgGood: "خوب بود! به یادگیری ادامه بده!",
    msgNotBad: "بد نبود! دوباره امتحان کن تا بهتر شی!",
    msgKeepStudying: "بیشتر مطالعه کن! بهتر میشی!",
  },
};

// returns the translated string for a key, in whatever currentLang is right now
function t(key) {
  return translations[currentLang][key] || key;
}

// finds every element tagged with data-i18n and swaps its text
// for the translation that matches currentLang
function updatePageContent() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  // resultMessage isn't in the HTML from the start (it's set dynamically
  // in showResults), so data-i18n never applies to it - handle it manually
  if (lastResultKey) {
    resultMessage.textContent = t(lastResultKey);
  }
}

// quizQuestions always holds the ORIGINAL English text - this is our
// source of truth, never overwritten by translation
let quizQuestions = [];

// displayedQuestions holds whatever language is currently on screen -
// this is what showQuestion() actually reads from and renders
let displayedQuestions = [];

// QUIZ STATE VARS
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

// counts how many times in a row the user hit "restart" without going back
// to the setup screen - after 3 times we send them back to reconfigure
let restartCount = 0;

// remembers which result message key was last shown, so if the user
// switches language while still on the results screen, we can
// re-translate it too (it's not covered by data-i18n since it's set
// dynamically, not sitting in the HTML from the start)
let lastResultKey = null;

// event listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

langSwitch.addEventListener("click", async () => {
  // flip between the two languages, no matter where on the switch you click
  currentLang = currentLang === "en" ? "fa" : "en";

  // moves the knob and highlights the active side (handled by this attribute in CSS)
  langSwitch.dataset.active = currentLang;

  // flip the page direction for Persian, flip it back for English
  document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";
  document.documentElement.lang = currentLang;

  // swap every data-i18n element to the new language's text
  updatePageContent();

  // remember the choice so it's still picked next time they visit
  localStorage.setItem("preferredLang", currentLang);

  // if we're in the middle of a quiz, re-translate from the ORIGINAL
  // English questions (quizQuestions) into the newly picked language,
  // then re-render the question that's currently on screen
  if (quizScreen.classList.contains("active") && quizQuestions.length > 0) {
    displayedQuestions = await translateQuestions(quizQuestions, currentLang);
    showQuestion();
  }
});

// on page load, check if the user already picked a language before
// wrapped in try/catch so that if any element here is missing (e.g. an
// out-of-date HTML file), the error doesn't stop the rest of the script
// from running - like the translation logic further down the file
try {
  const savedLang = localStorage.getItem("preferredLang");
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
    document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;
    langSwitch.dataset.active = currentLang;
  }
  updatePageContent();
} catch (err) {
  console.error("Language restore failed, continuing with defaults:", err);
}

// ===== CHIP SELECTOR LOGIC =====
// each group (category / difficulty / amount) works the same way:
// clicking a chip marks it selected, un-marks its siblings, and stores
// the picked value on the group's own data-value attribute

function setupChipGroup(group) {
  group.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      group.querySelectorAll(".chip").forEach((c) => {
        c.classList.remove("selected");
      });
      chip.classList.add("selected");
      group.dataset.value = chip.dataset.value;
    });
  });
}

setupChipGroup(categoryGroup);
setupChipGroup(difficultyGroup);
setupChipGroup(amountGroup);

// decode the weird HTML entities the API sends back (like &quot; &amp; etc)
function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

// shuffle an array so answers aren't always in the same order (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===== TRANSLATION LOGIC =====
// caches translated strings in localStorage so we don't re-translate the
// same question text every time it comes up again (saves API calls + time)
const translationCache = JSON.parse(localStorage.getItem("translationCache") || "{}");

// how long we're willing to wait for a single translation before giving up
// and just showing the English text instead - keeps the quiz from freezing
const TRANSLATION_TIMEOUT_MS = 4000;

async function translateText(text, targetLang) {
  // nothing to translate if we're already in English
  if (targetLang === "en") return text;

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  // AbortController lets us cancel a hanging request after a timeout,
  // instead of leaving the user staring at "Loading..." forever
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TRANSLATION_TIMEOUT_MS);

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`,
      { signal: controller.signal }
    );
    const data = await res.json();

    // MyMemory doesn't fail with a normal HTTP error when the daily quota
    // is hit - it returns status 200 but stuffs a warning into the text
    // itself, so we have to check for that manually
    const quotaHit =
      data.responseStatus !== 200 ||
      (typeof data.responseDetails === "string" && data.responseDetails.includes("QUOTA"));

    if (quotaHit) {
      throw new Error("Translation quota reached");
    }

    const translated = data.responseData.translatedText;

    translationCache[cacheKey] = translated;
    localStorage.setItem("translationCache", JSON.stringify(translationCache));

    return translated;
  } catch (err) {
    // covers: network errors, timeout/abort, and quota errors thrown above
    console.error("Translation unavailable, showing original English text:", err);
    return text; // fallback: better to show English than to break the quiz
  } finally {
    clearTimeout(timeoutId);
  }
}

// translates a whole batch of questions (question text + all answers)
// runs the translations in parallel with Promise.all so it stays fast
async function translateQuestions(questions, targetLang) {
  if (targetLang === "en") return questions;

  return Promise.all(
    questions.map(async (q) => {
      const translatedQuestion = await translateText(q.question, targetLang);
      const translatedAnswers = await Promise.all(
        q.answers.map(async (a) => ({
          text: await translateText(a.text, targetLang),
          correct: a.correct,
        }))
      );
      return { question: translatedQuestion, answers: translatedAnswers };
    })
  );
}

// grab random questions from Open Trivia Database, using whatever the user picked
async function fetchQuestions() {
  const amount = amountGroup.dataset.value;
  const category = categoryGroup.dataset.value;
  const difficulty = difficultyGroup.dataset.value;

  let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;

  // only tack these on if the user didn't leave them on "Any"
  if (category) url += `&category=${category}`;
  if (difficulty) url += `&difficulty=${difficulty}`;

  const res = await fetch(url);
  const data = await res.json();

  // response_code 1 means the API doesn't have enough questions for this combo
  if (data.response_code !== 0) {
    throw new Error("Not enough questions for this combination, try different settings.");
  }

  // reshape the API response into the format the rest of the code expects
  // NOTE: this always stays in English - translation happens separately
  return data.results.map((q) => {
    const answers = shuffleArray([
      { text: decodeHTML(q.correct_answer), correct: true },
      ...q.incorrect_answers.map((a) => ({
        text: decodeHTML(a),
        correct: false,
      })),
    ]);

    return {
      question: decodeHTML(q.question),
      answers,
    };
  });
}

async function startQuiz() {
  // show a simple loading state on the start button
  startButton.disabled = true;
  startButton.textContent = currentLang === "fa" ? "در حال بارگذاری..." : "Loading...";

  try {
    quizQuestions = await fetchQuestions(); // always English
    displayedQuestions = await translateQuestions(quizQuestions, currentLang); // shown language
  } catch (err) {
    console.error("Error fetching questions:", err);
    startButton.disabled = false;
    startButton.textContent = t("btnStart");
    alert("Something went wrong loading the questions. Please try again.");
    return;
  }

  startButton.disabled = false;
  startButton.textContent = t("btnStart");

  // reset vars
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  totalQuestionsSpan.textContent = quizQuestions.length;
  maxScoreSpan.textContent = quizQuestions.length;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
}

function showQuestion() {
  // reset state
  answersDisabled = false;

  const currentQuestion = displayedQuestions[currentQuestionIndex];

  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  questionText.textContent = currentQuestion.question;

  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");

    // what is dataset? it's a property of the button element that allows you to store custom data
    button.dataset.correct = answer.correct;

    button.addEventListener("click", selectAnswer);

    answersContainer.appendChild(button);
  });
}

function selectAnswer(event) {
  // optimization check
  if (answersDisabled) return;

  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  // Here Array.from() is used to convert the NodeList returned by answersContainer.children into an array, this is because the NodeList is not an array and we need to use the forEach method
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  setTimeout(() => {
    currentQuestionIndex++;

    // check if there are more questions or if the quiz is over
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    lastResultKey = "msgPerfect";
  } else if (percentage >= 80) {
    lastResultKey = "msgGreat";
  } else if (percentage >= 60) {
    lastResultKey = "msgGood";
  } else if (percentage >= 40) {
    lastResultKey = "msgNotBad";
  } else {
    lastResultKey = "msgKeepStudying";
  }

  resultMessage.textContent = t(lastResultKey);
}

function restartQuiz() {
  restartCount++;

  resultScreen.classList.remove("active");

  if (restartCount >= 3) {
    // reset the counter and send the user back to the setup screen
    // so they can pick category/difficulty/questions again
    restartCount = 0;
    startScreen.classList.add("active");
  } else {
    startQuiz();
  }
}