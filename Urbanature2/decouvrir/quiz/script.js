//Question du quiz
let quizquestion = "Dans quel célèbre roman Marcel Proust évoque-t-il la mer ?"


//Contenu du popup, écrire les informations dans les ``.
//N'utilisez pas de guillemets. Seulement les ' sont autorisé.
//Description du popup
let popupdesc = "Dans son œuvre, la mer est souvent associée à des souvenirs d'enfance et à des émotions profondes, offrant ainsi une réflexion sur la façon dont la mer peut évoquer des souvenirs et des sensations liées à Paris et à son histoire.";
//Si il contient une image ou non, mettre `true` si oui, laissez vide ou `false` si non.
let popupcontainimage = ``;
//Le lien de l'image s'il y en a une.
let popupimgsrc = ``;
//Le ALT d'une image pour les malvoyants. Laisser vide si image décorative.
let popupimgalt = ``;

const popupcontent = JSON.parse(
  `{"content":[` +
  `{"text":"${popupdesc}",` +
  `"haveimage":"${popupcontainimage}",` +
  `"imageurl":"${popupimgsrc}",` +
  `"imagealt":"${popupimgalt}"}]}`
);


//Tableau des questions, chacune question va avoir un numéro unique, une question, et "true" ou "false" dans "correct" pour sa validité.
//Ajoutez une ligne pour ajouter une questions.
const questions = JSON.parse(
    `{"question":[` +
    `{"questioncontent":"Madame Bovary","correct":"false" },` +
    `{"questioncontent":"Les Misérables","correct":"false" },` +
    `{"questioncontent":"À la recherche du temps perdu","correct":"true" },` +
    `{"questioncontent":"Le Comte de Monte-Cristo","correct":"false" }]}`
);


//Fonction d'affichage du popup dans le code quand le quiz est envoyé afin de ne pas tricher dans l'inspecteur d'élement.
function popupInit(){
  document.getElementById('popupcontent').innerHTML = popupcontent.content[0].text;

  if(popupcontent.content[0].haveimage === "true"){

    let image = document.createElement("img");
    image.alt = popupcontent.content[0].imagealt;
    image.src = popupcontent.content[0].imageurl;
    image.className = "popupimage";

    document.getElementById("imgholder").appendChild(image);

    console.log("popup avec image");
  };
  console.log("popup initié");
}


//Fonction d'affichage du popup.
function popupShow(){
  document.getElementById('popup').classList.toggle("hidden");
}


//Afficher la question
document.getElementById('quizquestion').innerHTML = quizquestion;


//créer un shuffle aussi long que le tableau de questions JSON, attribut aussi les numéros des questions.
let order=[];
let questionnumbers=[];
let correctanswers=[];
let correctanswerstext=[];

for(let i = 0; i < questions.question.length; i++){
order.push(i);
questionnumbers.push(i);
};

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    };
};

shuffleArray(order);
shuffleArray(questionnumbers);

for (let i = 0; i < questions.question.length; i++) {
  questions.question[i].number = questionnumbers[i].toString();
}


//mettre les bonnes réponses dans un tableau
questions.question.forEach(element => {
if(element.correct === "true"){

  correctanswers.push(parseInt(element.number));
  correctanswerstext.push(element.questioncontent);
}
});

let totalcorrectanswer = correctanswers.length;


//Annonce le nombre de bonnes réponses
if(totalcorrectanswer > 1){
  document.getElementById('reponsenombre').innerHTML = "(" + totalcorrectanswer + " bonnes réponses)";
}else{
  document.getElementById('reponsenombre').innerHTML = "(" + totalcorrectanswer + " bonne réponse)";
};


//créer les éléments cochable à partir de chaque questions dans le tableau JSON
//Permet d'avoir plus ou moins de 4 questions
for(let i = 0; i < questions.question.length; i++){
  let labelnumber = i+1;

  let labels = document.createElement("label");
  labels.id = "reponse" + labelnumber + "label";
  labels.className = "questionlabel";

  let inputs = document.createElement("input");
  inputs.type = "checkbox";
  inputs.id = "reponse" + labelnumber;
  inputs.className = "checkbox";

  document.getElementById("answercontainer").appendChild(labels);
  labels.appendChild(inputs);
};

for (let i = 0; i < questions.question.length; i++) {
  let labelnumber = i+1;
  document.getElementById('reponse'+labelnumber+'label').innerHTML += questions.question[order[i]].questioncontent;
  document.getElementById('reponse'+labelnumber).classList.add("n" + questions.question[order[i]].number)
};


//Fonction d'affichage des réponses visuellement
function showawnser(){
  if(totalcorrectanswer > 1){
    document.getElementById('reponsepluriel').innerHTML = "Les bonnes réponses étaient:";
  }else{
    document.getElementById('reponsepluriel').innerHTML = "La bonne réponse était:";
  };

  for(let i = 0; i < correctanswerstext.length; i++){
    let answerlist = document.createElement("p");
    answerlist.innerHTML = correctanswerstext[i];

    document.getElementById("listereponses").appendChild(answerlist);
  };

  document.getElementById("answers").classList.remove("hidden");
  document.getElementById("submitbutton").classList.add("hidden");

  popupInit();
};


//Récupère le numéro attribué au hasard aux bonnes et mauvaises réponses, puis les compare pour en déduire la validité totale.
function submit(){
  //Affiche les bonnes réponses
  for(let i = 0; i < correctanswerstext.length; i++){
    console.log(correctanswerstext[i]);
  };

  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
  let rightanswercount = 0;
  let wronganswer = 0;
  for (let i = 0; i < checkboxes.length; i++) {
    let questionchecker = parseInt(checkboxes[i].className.replace('checkbox n',''));
    if(correctanswers.includes(questionchecker) == true){
      rightanswercount += 1;
    }else{
      wronganswer = 1;
    };
  };

  //Bonne réponse
  if((rightanswercount == totalcorrectanswer) && (wronganswer == 0)){
    document.getElementById('answer').innerHTML = "Bonne réponse !";

  //Mauvaise réponse
  }else{
    document.getElementById('answer').innerHTML = "Mauvaise réponse.";

  };

  showawnser();
};