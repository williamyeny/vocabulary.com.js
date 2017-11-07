function getNextQuestion() {
  var request = new XMLHttpRequest();
  request.open("GET", "https://www.vocabulary.com/challenge/nextquestion.json", true);
  request.onload = function() {
    var response = JSON.parse(request.responseText);
    if ("adata" in response) {
      setTimeout(function() {
        sendAnswer(decodeAnswer(response.adata), response.secret.toString());
      }, 1000);
    } else { // not a question
      setTimeout(function() {
        getNextQuestion();
      }, 300);
    }
  }
  request.send();
}

function sendAnswer(answer, secret) {
  var request = new XMLHttpRequest();
  request.open("POST", "https://www.vocabulary.com/challenge/saveanswer.json", true);
  request.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8");

  request.onload = function () {
    console.log("Answered question. Total points: " + JSON.parse(request.responseText).pdata.points);
    setTimeout(function() {
      getNextQuestion();
    }, 700);

  };
  request.send("t=" + Date.now() +  "&rt=100&a=" + answer + "&secret=" + encodeURIComponent(secret));
}

function decodeAnswer(adata) {
  adata = atob(adata + ""); // base64 decode

  // caesar cipher (13)
  var str = [];
  for (var i = 0; i < adata.length; i++) {
    var charCode = adata.charCodeAt(i);
    if (charCode >= 97 && charCode <= 122) { // uppercase
      str.push(String.fromCharCode(charCode + (charCode >= 110 ? -13 : 13)));
    } else if (charCode >= 65 && charCode <= 90) { // lowercase
      str.push(String.fromCharCode(charCode + (charCode >= 78 ? -13 : 13)));
    } else { // not alphabetical
      str.push(adata.charAt(i));
    }
  }
  if(str.join("").includes("nonces")){
    return JSON.parse(str.join("")).nonces[0]; // multiple choice
  }
  return JSON.parse(str.join("")).acceptedAnswers[0]; // spelling
}
console.log("vocabulary.com.js started...");
getNextQuestion();
