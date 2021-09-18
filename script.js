const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
let score = 0;

const genres = [
  {
    name: 'Books',
    id: 10,
  },
  {
    name: 'Film',
    id: 11,
  },
  {
    name: 'Music',
    id: 12,
  },
  {
    name: 'Video Games',
    id: 15,
  },
];
const levels = ['easy', 'medium', 'hard'];
const buttons = document.querySelectorAll('button');

function addGenre(genre) {
  const column = document.createElement('div');
  column.classList.add('genre-column');
  column.innerHTML = genre.name;

  game.append(column);

  levels.forEach((level) => {
    const card = document.createElement('div');
    card.classList.add('card');
    column.append(card);

    if (level === 'easy') {
      card.innerHTML = 100;
    }
    if (level === 'medium') {
      card.innerHTML = 200;
    }
    if (level === 'hard') {
      card.innerHTML = 300;
    }

    fetch(
      `https://opentdb.com/api.php?amount=1&category=${genre.id}&difficulty=${level}&type=boolean`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        card.setAttribute('data-question', data.results[0].question);
        card.setAttribute('data-answer', data.results[0].correct_answer);
        card.setAttribute('data-value', card.getInnerHTML());
      })
      .then((done) => card.addEventListener('click', flipCard));
  });
}

genres.forEach((genre) => addGenre(genre));

function flipCard() {
  this.innerHTML = '';
  this.style.fontSize = '15px';
  const textDisplay = document.createElement('div');
  const trueButton = document.createElement('button');
  const falseButton = document.createElement('button');

  trueButton.addEventListener('click', getResult);
  falseButton.addEventListener('click', getResult);

  trueButton.innerHTML = 'True';
  falseButton.innerHTML = 'False';
  textDisplay.innerHTML = this.getAttribute('data-question');
  this.append(textDisplay, trueButton, falseButton);

  const allCards = Array.from(document.querySelectorAll('.card'));
  allCards.forEach((card) => card.removeEventListener('click', flipCard));
}

function getResult() {
  const allCards = Array.from(document.querySelectorAll('.card'));
  allCards.forEach((card) => card.addEventListener('click', flipCard));

  const cardOfButton = this.parentElement;
  console.log(cardOfButton.getAttribute('data-value'));

  if (cardOfButton.getAttribute('data-answer') === this.innerHTML) {
    score = score + parseInt(cardOfButton.getAttribute('data-value'));
    scoreDisplay.innerHTML = score;
    cardOfButton.classList.add('correct-answer');

    setTimeout(() => {
      while (cardOfButton.firstChild) {
        cardOfButton.removeChild(cardOfButton.lastChild);
      }
      cardOfButton.innerHTML = cardOfButton.getAttribute('data-value');
    }, 200);
  } else {
    cardOfButton.classList.add('wrong-answer');
    setTimeout(() => {
      while (cardOfButton.firstChild) {
        cardOfButton.removeChild(cardOfButton.lastChild);
      }
      cardOfButton.innerHTML = 0;
    }, 200);
  }

  cardOfButton.removeEventListener('click', flipCard);
}
