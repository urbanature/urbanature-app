//Quiz List
const quiz = JSON.parse(`
    {
      "quizs": [
        {
          "quizQuestion": "Dans quel célèbre roman Marcel Proust évoque-t-il la mer ?",
          "popupText": "Dans son œuvre, la mer est souvent associée à des souvenirs d'enfance et à des émotions profondes, offrant ainsi une réflexion sur la façon dont la mer peut évoquer des souvenirs et des sensations liées à Paris et à son histoire.",
          "popupContainImg": "false",
          "popupImgSrc": "",
          "popupImgAlt": "",
          "answerList": [
            {
              "answerText": "Madame Bovary",
              "isCorrect": "false"
            },
            {
              "answerText": "Les Misérables",
              "isCorrect": "false"
            },
            {
              "answerText": "À la recherche du temps perdu",
              "isCorrect": "true"
            },
            {
              "answerText": "Le Comte de Monte-Cristo",
              "isCorrect": "false"
            }
          ]
        },
        {
          "quizQuestion": "Question du quiz 2",
          "popupText": "text popup quiz2",
          "popupContainImg": "false",
          "popupImgSrc": "",
          "popupImgAlt": "",
          "answerList": [
            {
              "answerText": "fausse reponse1",
              "isCorrect": "false"
            },
            {
              "answerText": "bonne réponse1",
              "isCorrect": "true"
            },
            {
              "answerText": "bonne réponse2",
              "isCorrect": "true"
            }
          ]
        },
        {
          "quizQuestion": "testest?",
          "popupText": "This is a test",
          "popupContainImg": "true",
          "popupImgSrc": "https://www.shutterstock.com/image-illustration/generic-aa-batteries-no-label-260nw-148439339.jpg",
          "popupImgAlt": "Batteries :)",
          "answerList": [
            {
              "answerText": "ben?",
              "isCorrect": "false"
            },
            {
              "answerText": "Myes?",
              "isCorrect": "true"
            },
            {
              "answerText": "HAH AHAHA",
              "isCorrect": "true"
            },
            {
              "answerText": "No.",
              "isCorrect": "false"
            },
            {
              "answerText": "Ugh",
              "isCorrect": "true"
            }
          ]
        }
      ]
    }
`);

//AnswerList, will get filled automatically. Keep empty
const aList = JSON.parse(`
    {
      "als": [
      ]
    }
`);

//AnswerListText, will get filled automatically, gives out the list of good answers. Keep empty
const aListText = JSON.parse(`
    {
      "alst": [
      ]
    }
`);

//QuestionsOrder, will get filled automatically, randomizes the order of the answers. Keep empty
const order = JSON.parse(`
    {
      "ol": [
      ]
    }
`);

//QuestionsOrder, will get filled automatically, gives each answer a random number to be checked via the AnswerList. Keep empty
const qNumber = JSON.parse(`
    {
      "qnl": [
      ]
    }
`);

//Array shuffler
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };
};

//Creation of each quiz
for(let i = 0; i < quiz.quizs.length; i++){
  
  //Numbers for the array or quiz number
  let quizNumber = i + 1;
  let arrayNumber = i;

  //Same as the lists above, just temporary to store them afterward
  let localOrder = [];
  let localQNumber = [];
  let localAList = [];
  let localAListText = [];

  //Quiz template, every div has this code injected
  let quizTemplate = `
  <div>
              
      <div class="textBox">
          <h2 class="tOran" id="quiz` + quizNumber + `question">`+ quiz.quizs[arrayNumber].quizQuestion +`</h2>
          <h3 class="tYell" id="quiz` + quizNumber + `AnswerAmount"></h2>
          <div class="answerContainer" id="quiz` + quizNumber + `AnswerContainer"></div>
      </div>

      <div class="textBox hidden" id="quiz` + quizNumber + `Answers">
          <h2 class="tYell" id="quiz` + quizNumber + `Answer"></h2>
          <h3 class="tYell" id="quiz` + quizNumber + `AnswerSubtitle"></h3>
          <div id="quiz` + quizNumber + `AnswerList"></div>
          <button class="hintButton" id="quiz` + quizNumber + `HintButton"></button>
      </div>

      <button class="yellowBtn" id="quiz` + quizNumber + `SubmitButton">Valider</button>

  </div>
  `;

  //Popup template, every div has this code injected
  let popupTemplate = `
    <div id="quiz` + quizNumber + `Popup" class="popup hidden">
        <div class="textBox">
            <button class="cross"></button>
            <h2 class="tYell">Un peu de contexte:</h2>
            <p id="popupContent"></p>
            <div id="imgHolder"></div>
        </div>
    </div>
  `;

  //Check if the quiz is properly setup either in the Json table or HTML
  //If not, code will not execute and return an error saying which quiz is not set up properly in the console
  try{

    //Fills the quiz# div
    document.getElementById("quiz" + quizNumber).innerHTML = quizTemplate;
    //Fills the popup# div
    document.getElementById("quizPopups").innerHTML += popupTemplate;



    //Creates a list of number depending on the amount of answers, shuffles two array of them for the list of answers and the order then adds another value in the JSON table to give them their new question number
    for(let i = 0; i < quiz.quizs[arrayNumber].answerList.length; i++){
      localOrder.push(i);
      localQNumber.push(i);
    };
    shuffleArray(localOrder);
    shuffleArray(localQNumber);
    order.ol.push(localOrder);
    qNumber.qnl.push(localQNumber);
    for (let i = 0; i < quiz.quizs[arrayNumber].answerList.length; i++) {
      quiz.quizs[arrayNumber].answerList[i].questionNumber = localOrder[i].toString();
    };



    //Adds all the good answers into an array as well as the answers themselves to paste them later
    quiz.quizs[arrayNumber].answerList.forEach(element => {
      if(element.isCorrect === "true"){
        localAList.push(parseInt(element.questionNumber));
        localAListText.push(element.answerText);
      }
    });
    aList.als.push(localAList);
    aListText.alst.push(localAListText);

    //Tells how many good answers there are
    let totalCorrectAnswer = aList.als[arrayNumber].length;
    if(totalCorrectAnswer > 1){
      document.getElementById("quiz" + quizNumber + "AnswerAmount").innerHTML = "(" + totalCorrectAnswer + " bonnes réponses à cocher)";
    }else{
      document.getElementById("quiz" + quizNumber + "AnswerAmount").innerHTML = "(" + totalCorrectAnswer + " bonne réponse à cocher)";
    };

    //Creates the answers checkmarks
    for (let i = 0; i < quiz.quizs[arrayNumber].answerList.length; i++) {
      let labelNumber = i+1;
      //Answer template, every div has this code injected
      let answerTemplate = `
        <label id="quiz` + quizNumber + `Answer` + labelNumber + `Label" class="questionLabel">
          <input type="checkbox" id="quiz` + quizNumber + `Answer` + labelNumber + `" class="checkBox">
        </label>
      `;

      document.getElementById("quiz" + quizNumber + "AnswerContainer").innerHTML += answerTemplate;
    };

    //Fills the answers checkmarks, done seperately to randomize order
    for (let i = 0; i < quiz.quizs[arrayNumber].answerList.length; i++) {
      let labelNumber = i+1;
      let orderFetch = order.ol[arrayNumber]
  
      document.getElementById("quiz" + quizNumber + "Answer" + labelNumber + "Label").innerHTML += quiz.quizs[arrayNumber].answerList[orderFetch[i]].answerText;
      document.getElementById("quiz" + quizNumber + "Answer" + labelNumber).classList.add("n" + quiz.quizs[arrayNumber].answerList[orderFetch[i]].questionNumber)
    };

    

    //Giving an addEventListener to all the submit buttons
    document.getElementById("quiz" + quizNumber + "SubmitButton").addEventListener("click", function(e){
      //Function that will trigger on each submit buttons
      console.log(quizNumber)
    });

    //Giving an addEventListener to all the hint buttons
    document.getElementById("quiz" + quizNumber + "HintButton").addEventListener("click", function(e){
      //Function that will trigger on each hint buttons
      console.log("popup " + quizNumber + " function")
    });


  }catch(error){
    console.log("ERROR: Quiz #" + quizNumber +" is not set up properly.");
    console.log(error);
  };
};