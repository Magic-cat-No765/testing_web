var firstFrame = "http://imgur.com/UeMOrix.gif";
var lastFrame = "http://imgur.com/vy7weQ1.gif";
var forwardAnimation = "http://i.imgur.com/UB0g8dT.gif";
var backwardAnimation = "http://i.imgur.com/aIxrX26.gif";

var animationLength = 5040;
var playing = false;
var checkingIfPlaying = false;

function playForward() {
  if ($("#animation").is(":hover")){
    playing = true;
    $("#animation").attr("src", forwardAnimation);
    window.setTimeout(function () {
      $("#animation").attr("src", lastFrame);
      playing = false;
    }, animationLength);
  }
  else {
    $("#animation").attr("src", firstFrame);
  }
}

function playBackward() {
  if ($("#animation").is(":hover")) {
    $("#animation").attr("src", lastFrame);
  }
  else {
    playing = true;
    $("#animation").attr("src", backwardAnimation);
    window.setTimeout(function () {
      $("#animation").attr("src", firstFrame);
      playing = false;
    }, animationLength);
  }
}

$("#animation").mouseover(function (e) {
    if (!checkingIfPlaying) {
      checkingIfPlaying = window.setInterval(function () {
        if (!playing) {
          window.clearInterval(checkingIfPlaying);
          playForward()
          checkingIfPlaying = false;
        }
      }, 0);
    }
});

$("#animation").mouseout(function (e) {
    if (!checkingIfPlaying) {
      checkingIfPlaying = window.setInterval(function () {
        if (!playing) {
          window.clearInterval(checkingIfPlaying);
          playBackward()
          checkingIfPlaying = false;
        }
      }, 0);
    }
});