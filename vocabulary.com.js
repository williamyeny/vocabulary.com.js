function getNextQuestion() {
  var request = new XMLHttpRequest();
  request.open("GET", "https://www.vocabulary.com/challenge/nextquestion.json", true);
  request.onload = function() {
    var response = JSON.parse(request.responseText);
    console.log(response);
    if ("adata" in response) {
      console.log ("hi");
    }

  }
  request.onerror = function() {
    console.log("get next question error");
  };
  
  request.send();
}

function setAnswer() {

}

getNextQuestion();