const question = document.querySelector(".question");
const wrapper = document.querySelector(".wrapper");
const answersDiv = document.querySelector(".answers");
const nextDiv = document.querySelector(".nextDiv");
const scoreText = document.querySelector(".scoreText");
const congrats = document.querySelector(".congrats");
const playAgain = document.querySelector(".playAgain");
let quizes = [];
let questionNo = 1;
let score = 0;
function startQuiz() {
  score = 0;
  questionNo = 1;
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      const worthCountries = data.map((el) => (el.capital !== undefined ? el : false));
      const filtered = worthCountries.filter((el) => el);
      setQuizes(getCountries(filtered), data);
      showQuiz(questionNo, quizes[questionNo - 1], "capital");
    })
    .catch((error) => {
      console.log(error);
    });
}

startQuiz();
function getCountries(data) {
  let tenRandomCountry = [];
  for (let i = 0; i < 10; i++) {
    let random = Math.floor(Math.random() * 246);
    tenRandomCountry.push(data[random]);
  }
  return tenRandomCountry;
}

function setQuizes(array, wholeArray) {
  array.forEach((data) => {
    const index = wholeArray.indexOf(data);
    quizes.push({
      name: data.capital[0],
      answers: [
        { opt: data.name.common, correct: true },
        {
          opt: getWrongName(wholeArray, index),
          correct: false,
        },
        {
          opt: getWrongName(wholeArray, index),
          correct: false,
        },
        {
          opt: getWrongName(wholeArray, index),
          correct: false,
        },
      ],
    });
  });
}
function getWrongName(array, index) {
  const random = Math.floor(Math.random() * 246);
  return random === index && array[random].name.common
    ? array[index + 1].name.common
    : array[random].name.common;
}
function shuffle(array) {
  let shuffled = array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return shuffled;
}

function showQuiz(questionIndex, array, questionType) {
  question.innerHTML = "";
  answersDiv.innerHTML = "";
  nextDiv.innerHTML = "";
  answersDiv.classList.remove("disable");

  if (questionType === "capital") {
    question.innerHTML = `${array.name} is the capital of which country?`;
  }
  const shuffled = shuffle(array.answers);
  shuffled.map((answer) => {
    const button = document.createElement("button");

    button.innerHTML = answer.opt;
    answersDiv.appendChild(button);
    button.addEventListener("click", (e) => {
      const next = document.createElement("button");
      next.innerHTML = "Next";
      nextDiv.appendChild(next);
      next.addEventListener("click", () => handleNextClick());
      answersDiv.childNodes.forEach((button) => {
        button.disabled = true;
      });
      answersDiv.classList.add("disable");
      const check = document.createElement("img");
      check.setAttribute("src", "./images/Check_round_fill.svg");
      const close = document.createElement("img");
      close.setAttribute("src", "./images/close_round_fill.svg");
      if (answer.opt === e.target.innerHTML && answer.correct) {
        button.appendChild(check);
        score++;
      } else {
        button.appendChild(close);
        answersDiv.childNodes.forEach((el) => {
          const correctAnswer = shuffled.find((ans) => ans.correct);
          if (correctAnswer.opt === el.innerText) {
            el.appendChild(check);
          }
        });
      }
    });
  });
}

function handleNextClick() {
  questionNo++;
  if (questionNo < 11) {
    showQuiz(questionNo, quizes[questionNo - 1], "capital");
    const level = document.querySelector(`.level${questionNo}`);
    level.classList.add("activeLevel");
  }
  if (questionNo === 11) {
    congrats.style.display = "flex";
    wrapper.style.display = "none";
    scoreText.innerText = `You answer ${score}/10 correctly.`;
  }
}

playAgain.addEventListener("click", () => {
  quizes = [];
  startQuiz();
  congrats.style.display = "none";
  wrapper.style.display = "flex";
  resetLevels();
});

function resetLevels() {
  for (let i = 1; i < 10; i++) {
    const level = document.querySelector(`.level${i + 1}`);
    level.classList.remove("activeLevel");
  }
}
