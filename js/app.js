// State object
var state = {
  questions: [
    {
      text: "In 1887 a complex of caves were discovered that had an otherworldly blue-green glow and the ceilings were strung with thousands of glowing creatures. Where are these caves?",
      picture: "img/GlowWormCave.jpg",
      comment: "Waitomo Glowworm Caves are located in New Zealand",
      choices: ["USA", "Brazil", "New Zealand", "Spain"],
      correctChoiceIndex: 2
    },
    {
      text: "This spring gets its signature look as different bacteria produce color-altering carotenoids. Since it’s cooler as you move near the edges, the carotenoid colors change. Where is this spring?",
      picture: "img/PsychedelicHotSprings.jpg",
      comment: "Yellowstone National Park’s Grand Prismatic Spring are in Wyoming, USA",
      choices: ["USA", "Peru", "Serbia", "Ethiopia"],
      correctChoiceIndex: 0
    },
    {
      text: "For most of the year, the site is covered in snow. But in summer, more than 600 types of flora make their entrance. Situated at the core of the Nanda Devi Biosphere Reserve, it is recognized by UNESCO for having “outstanding universal value. Where is this national park?",
      picture: "img/ValleyOfFlowers.jpg",
      comment: "Valley of Flowers are part of a national park in the west Himalayas of India",
      choices: ["Canada", "India", "USA", "China"],
      correctChoiceIndex: 1
    },
    {
      text: "At nearly 400 feet below sea level, it’s the world’s lowest terrestrial volcanic vent. It’s also one of the hottest places on earth, averaging 94°F year-round. Where are these vents?",
      picture: "img/VolcanicVents.jpg",
      comment: "The Dallol Hydrothermal Field, in the Danakil Desert, is in Ethiopia",
      choices: ["China", "USA", "Brazil", "Ethiopia"],
      correctChoiceIndex: 3
    },
    {
      text: "This bone emporium is one of the most macabre sites in Europe, second perhaps only to the Paris Catacombs. Here, tens of thousands of bones cling to every nook and cranny—strung into garlands, piled onto pillars, and stacked into pyramids lurking in the corners. Where is this?",
      picture: "img/BoneEmporium.jpg",
      comment: "The Sedlec Ossuary is in the Czech Republic",
      choices: ["Spain", "Portugal", "Czech Republic", "Serbia"],
      correctChoiceIndex: 2
    }
  ],
  praises : [
    "Fantastic!",
    "You are correct!",
    "Amazing!"
  ],

  admonishments: [
    "Better luck next time.",
    "Sorry."
  ],
  score: 0,
  currentQuestionIndex: 0,
  route: 'start',
  lastAnswerCorrect: false,
  feedbackRandom: 0
};

// State modification functions
function setRoute(state, route) {
  state.route = route;
};

function resetGame(state) {
  state.score = 0;
  state.currentQuestionIndex = 0;
  setRoute(state, 'start');
};

function answerQuestion(state, answer) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  state.lastAnswerCorrect = currentQuestion.correctChoiceIndex === answer;
  if (state.lastAnswerCorrect) {
    state.score++;
  }
  selectFeedback(state);
  setRoute(state, 'answer-feedback');
};

function selectFeedback(state) {
  state.feedbackRandom = Math.random();
};

function advance(state) {
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex === state.questions.length) {
    setRoute(state, 'final-feedback');
  }
  else {
    setRoute(state, 'question');
  }
};

// Render functions
function renderApp(state, elements) {
  // default to hiding all routes, then show the current route
  Object.keys(elements).forEach(function(route) {
    elements[route].hide();
  });
  elements[state.route].show();

  if (state.route === 'start') {
      renderStartPage(state, elements[state.route]);
  }
  else if (state.route === 'question') {
      renderQuestionPage(state, elements[state.route]);
  }
  else if (state.route === 'answer-feedback') {
    renderAnswerFeedbackPage(state, elements[state.route]);
  }
  else if (state.route === 'final-feedback') {
    renderFinalFeedbackPage(state, elements[state.route]);
  }
};

// at the moment, `renderStartPage` doesn't do anything, because
// the start page is preloaded in our HTML, but we've included
// the function and used above in our routing system so that this
// application view is accounted for in our system
function renderStartPage(state, element) {
};

function renderQuestionPage(state, element) {
  renderQuestionCount(state, element.find('.question-count'));
  renderQuestionPicture(state, element.find('.question-picture'));
  renderQuestionText(state, element.find('.question-text'));
  renderChoices(state, element.find('.choices'));
};

function renderAnswerFeedbackPage(state, element) {
  renderAnswerFeedbackHeader(state, element.find(".feedback-header"));
  renderAnswerFeedbackText(state, element.find(".feedback-text"));
  renderNextButtonText(state, element.find(".see-next"));
};

function renderFinalFeedbackPage(state, element) {
  renderFinalFeedbackText(state, element.find('.results-text'));
};

function renderQuestionCount(state, element) {
  var text = (state.currentQuestionIndex + 1) + "/" + state.questions.length;
  element.text(text);
};

function renderQuestionPicture(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  $('.question-picture').attr("src", currentQuestion.picture);
}; 

function renderQuestionText(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  element.text(currentQuestion.text);
};

function renderChoices(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  var choices = currentQuestion.choices.map(function(choice, index) {
    return (
      '<li>' +
        '<input type="radio" name="user-answer" value="' + index + '" required>' +
        '<label>' + choice + '</label>' +
      '</li>'
    );
  });
  element.html(choices);
};

function renderAnswerFeedbackHeader(state, element) {
  var html = state.lastAnswerCorrect ?
      "<h1 class='user-was-correct'>Correct!</h1>" :
      "<h1 class='user-was-incorrect'>Sorry!</h1>";

  element.html(html);
};

function renderAnswerFeedbackText(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  element.text(currentQuestion.comment);
};

function renderNextButtonText(state, element) {
    var text = state.currentQuestionIndex < state.questions.length - 1 ?
      "Next" : "How did I do?";
  element.text(text);
};

function renderFinalFeedbackText(state, element) {
  var text = "You got " + state.score + " out of " +
    state.questions.length + " questions right.";
  element.text(text);
};

// Event handlers
var PAGE_ELEMENTS = {
  'start': $('.start-page'),
  'question': $('.question-page'),
  'answer-feedback': $('.answer-feedback-page'),
  'final-feedback': $('.final-feedback-page')
};

$("form[name='game-start']").submit(function(event) {
  event.preventDefault();
  setRoute(state, 'question');
  renderApp(state, PAGE_ELEMENTS);
});

$(".restart-game").click(function(event){
  event.preventDefault();
  resetGame(state);
  renderApp(state, PAGE_ELEMENTS);
});

$("form[name='current-question']").submit(function(event) {
  event.preventDefault();
  var answer = $("input[name='user-answer']:checked").val();
  answer = parseInt(answer, 10);
  answerQuestion(state, answer);
  renderApp(state, PAGE_ELEMENTS);
});

$(".see-next").click(function(event) {
  advance(state);
  renderApp(state, PAGE_ELEMENTS);
});

$(function() { renderApp(state, PAGE_ELEMENTS); });