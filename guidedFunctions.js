
function printEye() {
  
  if (actuallySpeaking) {
    fill(255, 0, 0);
    esize = esize * 0.9 + 0.1 * random(120, 255);
  } else {
    fill(150, 150, 150);
    esize = esize * 0.9 + 0.1 * 90.0;
  }

  image(img, width / 2, height / 2);
  background(0, 0, 0, 255 - esize);
}

function printSubtitle() {
  
  if (curText.length > 0) {
    push();
    //ellipse(width / 2, height / 2, esize, esize);
    fill(0);
    textSize(40);
    var tW = textWidth(curText);
    rect(width / 2 - tW / 2 - 10, height - 130 - 30-60, tW + 20, 40 * curText.split("\n").length + 10);
    fill(255);

    text(curText, width / 2 - 0, height - 130-60);
    pop();
  }
}

function getRandom(list) {
  var number = constrain(round(random(list.length)) - 1, 0, list.length - 1);
  return list[number]
}

function updateSpeak() {
  if (queue.length > 0 && !speaking) {
    var curSpeak = queue.shift();
    speaking = true;
    setTimeout(function() {
      speak(curSpeak.text)
    }, curSpeak.time);
  }
}


function addSpeak(text, time) {
  queue.push({
    text: text,
    time: time
  });

}

function speakTimed(text, time) {
  speaking = true;
  setTimeout(function() {
    speak(text)
  }, time);
}

function speak(text) {
  actuallySpeaking = true;
  curText = text;
  responsiveVoice.speak(text, "UK English Male", {
    onstart: StartCallback,
    onend: EndCallback,
    pitch: 0.8,
    rate: 0.8
  });
}


function StartCallback() {

}

function EndCallback() {
  speaking = false;

  actuallySpeaking = false;
  // print("done speaking");
  // curText = "";
}
