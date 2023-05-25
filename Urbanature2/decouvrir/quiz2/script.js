//Liste des quiz.
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
          "popupContainImg": "true",
          "popupImgSrc": "test",
          "popupImgAlt": "testalt",
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
        }
      ]
    }
`);


//Fonction pour mélanger un tableau
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };
};

for(let i = 0; i < quiz.quizs.length; i++){
  
  //Création des balises pour le quiz.
  let answerbox = document.createElement("div");
  
};