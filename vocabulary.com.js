function getNextQuestion() {
  var request = new XMLHttpRequest();
  request.open("GET", "https://www.vocabulary.com/challenge/nextquestion.json", true);
  request.onload = function() {
    var response = JSON.parse(request.responseText);
    console.log(response);
    if ("adata" in response) {
      sendAnswer(decodeAnswer(response.adata), response.secret);
    } else { // not a question
      getNextQuestion();
    }

  }
  request.onerror = function() {
    console.log("get next question error");
  };
  
  request.send();
}

function sendAnswer(answer, secret) {
  var request = new XMLHttpRequest();
  request.open("POST", "https://www.vocabulary.com/challenge/saveanswer.json", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.onload = function () {
      // do something to response
      console.log(this.responseText);
  };
  request.send("t=" + Date.now() +  "&rt=0&a=" + answer + "&secret=" + secret);
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
  return JSON.parse(str.join("")).nonces[0];

}

getNextQuestion();