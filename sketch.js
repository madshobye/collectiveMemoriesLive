/*
  ####################################
  GUIDED VARS
  ####################################
*/


// Based on https://responsivevoice.org/
// Maja, USE THIS DOC: https://docs.google.com/document/d/1CtvZh465qMDjXpUCdIsXLl2yzwksrnKub_Ok-DW3iZs/edit
var intro = [
  "Welcome to collective memories.\n I am your guide. ",
  "To experience collective memories\n please step out onto the floor\n where you have some space around you",
  "Thank you.",
  "Position yourself so you can see your full body as a stickfigure",
  "Take a deep breath in and exhale relaxing your shoulders.",
  "Moving your weight a little bit from foot to foot before settling \nwhere your weight can drop down from the top of your head\n to your shoulders, \nyour hips and through your legs to the soles of your feet. ",
  "When you're ready I invite you to close your eyes,\n feeling your eyes heavy and relaxing your face.",
  "This is the neutral position you can return to after each position \nI will guide you into.",
  "You can open your eyes whenever you wish to, just try to stay with the experience. ",
  "First I would like you to think about your earliest childhood memories.\n What are the first things you remember?"
];


var guidedToASoundBite = [
  "Now I will guide you to a memory from another person.",
  "Please listen to the memory, see if the story resonate with your own childhood.",
  "Firstly, I will guide you into a physical position. Breathe, relax and follow my instructions."

];

var guidedToPos = 0;



var side = ["left", "right"];
var tilt = ["backwards", "forwards"];

var amplitude;
var queue = [];

// Maja, https://docs.google.com/document/d/1dh9Tqre-8Wp7Ge-tvnX6kqsrOJuWgiWIet3iPNpkt_A/edit#
var sentences = [
  "With your [side] foot, take one step forward. \nBend both knees and elbows, then lift both hands up making fists, the right hand slightly higher than the left.",
  "Extend the left arm in front of your body, palm facing down, \npalm no higher than just above shoulder level. \nThe right arm extends in a similar way but to the side of your body. \nThis opens the chest slightly towards the right; take one step with the right foot in that direction, keeping knees straight.",
  "Come down to the floor, sitting on your feet with your knees bent,\n your hands come to the floor in front of your knees.",
  "Standing on both feet, take your left palm of the hand towards the ceiling. Extend your arm.",
  "Bend both knees a little and lean forward slightly to put both hands on your cheeks.",
  "Standing on two feet and bending the knees slightly,\nput your right hand on your right thigh and your left hand on your left cheek,\nlook down.",
  "With a slight bend to the knees,\n float your hands away from your body as if you were wearing a huge ballroom dress,\n the very slightest bend to the elbows, relaxed hands and open chest.",
  "On straight legs look down to the floor just in front of your feet\n and extend both arms out to the sides until the hands are above the shoulders\n then leave the hands hanging down from the wrist.",
  "With your right arm imagine pointing straight in front of you but let the fingers remain together.",
  "While your arms are hanging down imagine pushing something behind you with the left palm a little bit away from you.",
  "Turn towards the right side of the room so that your profile is facing their camera.\nTake the right hand and face the palm towards the camera by crossing the arm across your body\n and turning the upper body slightly in that direction.",
  "Crouch down, sitting on your knees with the heels off the floor\nand both elbows resting on the thighs or knees, \nhands hanging down together.",
  "Standing, turn your head to look to the right with eyes closed, \ntake the top of your left foot and place it into the floor so that your weight is now mainly on your right foot and your left knee is bent.",
  "Lift both your arms up above your head, straight arms and the palms facing out towards the sides, \nturn around 180 degrees.",
  "Turn with your back towards the camera, cross your right leg behind your left leg, \nand tip your shoulders towards the left-leaning a little bit towards the left. Tip your head in the same direction and look down towards the floor.",
  "Turn your whole body slightly to the left, \nplace your right hand on your left shoulder, \nlook down towards the floor with eyes closed.",
  "Bend down to put your left hand on the left knee, \nbend your right elbow so that the right hand comes close to your shoulder\n and make a fist, open your chest and face towards the right.",
  "Standing, feel the palm of your right hand. \nImagine someone pulling your fingers of the right hand straight back behind you\n so that the palm faces the ceiling. \nPulling it so much so that the shoulder also comes along and even the head gazing slightly back behind your body."
]



var state = -2;


var stayForMoment = ["Stay here for a moment", "Pause", "Stand still", "Wait"];
var pauseAndListen = "";

let img;
let img_info;
let img_outro;

let mySound;
var soundFile = "audio/mediSmall.mp3";
var volume = 0.5;



var timer = 0;
var introStep = 0;
var movementStep = 0;
var speaking = false;
var esize = 100;
var curText = "";
var actuallySpeaking = false


/*
  ####################################
  SETTINGS
  ####################################
*/
var classifierName = "myKNN_with_lamps_two_mute.json";
var recordSound = true;
p5.disableFriendlyErrors = true;



/*
  ####################################
  VARIABLES
  ####################################
*/

let mic, recorder;
let video;
const knnClassifier = ml5.KNNClassifier();
let poseNet;
let poses = [];
let poseCount = [];
var curCleanedPose;
var confidences;
var soundTransition = new uiFloat(0.33);
var doClassify = false;
var showVideo = false;
var classifierCounter = 0;
var sounds = [];
var soundFileList = [];
var showSkeleton = false;
var showUI = false;
var playSounds = false;
var framerate = 0;
var muted = false;
var minVolume = new uiFloat(0);
var inputVolume = new uiFloat(0);
var automaticPause = false;
var redButtonPressed = false;
var redButtonPressedOld = false;
var recording = false;
var recordExampleKey;
var amplitude;


function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound(soundFile);
  img_info = loadImage("data/intro.png");
  img_outro = loadImage("data/outro2.png");


  img = loadImage('hall.png');

  soundFileList.push('audio3/nosound.wav');
  soundFileList.push('audio2/aasem2.mp3');
  soundFileList.push('audio2/darren.mp3');
  soundFileList.push('audio2/fabienne.mp3');
  soundFileList.push('audio2/magn.mp3');
  soundFileList.push('audio2/peter.mp3');
  soundFileList.push('audio2/brittacopy.mp3');
  soundFileList.push('audio2/elisabeth.mp3');
  soundFileList.push('audio2/lea.mp3');
  soundFileList.push('audio2/mie1.mp3');
  soundFileList.push('audio2/tina.mp3');
  soundFileList.push('audio2/cosmo.mp3');
  soundFileList.push('audio2/eva.mp3');
  soundFileList.push('audio2/nanna.mp3');
  // soundFileList.push('audio3/nosound.wav');
  soundFileList.push('audio3/1lise.mp3');
  soundFileList.push('audio3/2lise.mp3');
  soundFileList.push('audio3/3lise.mp3');
  soundFileList.push('audio3/4troels.mp3');
  soundFileList.push('audio3/5troels.mp3');
  soundFileList.push('audio3/6troels.mp3');


}

function loadData() {
  knnClassifier.load(classifierName, customModelReady);


}

function customModelReady() {

  console.log("model loaded" + knnClassifier.getNumLabels());
  //print(knnClassifier);
  classifierCounter = knnClassifier.getNumLabels();
  for (var i = 0; i < knnClassifier.getNumLabels(); i++) {
    // print(knnClassifier.mapStringToIndex[i]);
    sounds.push(loadSound(soundFileList.shift()));
  }
  doClassify = true;

}

function modelReady() {

  showUI = true;
}


function setup() {
  frameRate(30);
  // print(responsiveVoice.getVoices());
  const canvas = createCanvas(windowWidth, windowHeight);
  setupGamepad();
 
  canvas.parent('videoContainer');
  let constraints = {
    video: {
      mandatory: {
        // minWidth: 1280,
        //   minHeight: 720
        minWidth: 640,
        minHeight: 480
      }
      // ,optional: [{ maxFrameRate: 10 }]
    },
    audio: false
  };
  video = createCapture(constraints, function(stream) {


  });

  //video.size(1280, 720);
  video.size(640, 480);
  // print(video.height);



  //video.size(1920,1080);
  video.hide();


  //https://ml5js.org/docs/PoseNet
  // Create a new poseNet method with a single detection
  //https://learn.ml5js.org/docs/#/reference/posenet
  const poseOptions = {
    imageScaleFactor: 0.3,
    outputStride: 16,
    flipHorizontal: true,
    minConfidence: 0.15,
    maxPoseDetections: 1,
    scoreThreshold: 0.5,
    nmsRadius: 20,
    detectionType: 'single-pose',
    multiplier: 0.75,
  }

  poseNet = ml5.poseNet(video, poseOptions, 'single', modelReady);
  // poseNet.detectionType = 'single';
  poseNet.on('pose', function(results) {
    poses = results;
    if (poses.length > 0) {
      curCleanedPose = cleanUpPose(poses[0]);
    }
    if (doClassify) {
      classify();

    }
    if (recordExampleKey != undefined) {
      addExample(recordExampleKey);
    }

  });


  // create an audio in
  mic = new p5.AudioIn();

  // users must manually enable their browser microphone for recording to work properly!
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);
  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);



  mySound.setVolume(volume);
  mySound.setLoop(true);

  fill(255);


  amplitude = new p5.Amplitude();
  // amplitude.setInput(responsiveVoice);
  textSize(20);

  textFont('Share Tech Mono');

  chromeAgent = navigator.userAgent.indexOf("Chrome") > -1;



  textAlign(CENTER);
  imageMode(CENTER);

}

var timer = 0;

var showDebug = true;
var loadingTimer = 0;
var videoRatio = 0;
var videoScaling = 0;
var chromeAgent = false;
var sI = 0;
var recordingTimer = 0;

function draw() {

  background(0);
  textAlign(CENTER);
  imageMode(CENTER);
  updateSpeak();

  videoRatio = video.height / video.width;
  videoScaling = (windowWidth) / video.width;



  if (state >= 0 && !fullscreen()) // reset in case of exit full screen
  {
    playSounds = false;
    updateSounds();

    mouseIsPressed = false;
    mySound.stop();
    queue = [];
    guidedToPos = 0;
    curText = "";
    movementStep = 0;
    introStep = 0;
    state = -3;

  } else if (state == -3) {
    image(img_outro, width / 2, height / 2, windowWidth, windowWidth / img_outro.width * img_outro.height);
    cursor(HAND);
    if (mouseIsPressed && mouseX > width / 2) {
      state = -1;

    } else if (mouseIsPressed && mouseX < width / 2) {
      var myWindow = window.open("https://forms.gle/ww9vmCF548KG7UhD6", "_blank");
    }

  } else if (state == -2) // startup loading
  {

    loadData();
    state = -1.5;
    loadingTimer = millis();
    curText = "Loading.. \nPlease accept use of webcam and microphone\nNothing will be uploaded."
  } else if (state == -1.5) {
    var size = (millis() - loadingTimer) / 10;
    if (size > height) {
      loadingTimer = millis();
    }
    ellipse(width / 2, height / 2, size, size);

    printSubtitle();

    if (confidences != undefined) {
      curText = "";
      state = -1;

    } else if (doClassify) {
      curText = "Loading.. \nI can't see you. \nAre you in front of the camera?"
    }


  } else if (state == -1) { // startup screen
    image(img_info, width / 2, height / 2, windowWidth, windowWidth / img_info.width * img_info.height);
    cursor(HAND);



    if (!chromeAgent) {
      curText = "I feel most at home in a Chrome Browser - our experience may vary";
    }
    printSubtitle();
    if (mouseIsPressed && mouseX > width / 2) {
      cursor("auto");
      getAudioContext().resume().then(() => {
    console.log('Playback resumed successfully');
  });
      /*      var sI = round(random(sounds.length - 1));
            sounds[sI].play();
               sounds[sI].setVolume(1);*/
      fullscreen(true);
      curText = "";
      state = -0.5;
      setTimeout(function() {
        state = 0;
      }, 3000);
      mySound.play();
      mySound.setVolume(0.3);
    }

  } else if (state == -0.5) {

  } else if (state == 0) { // introduction


    if (!speaking) {
      if (introStep == 3 && (poses == undefined || (poses != undefined && poses.length == 0))) {
        // nobody on the screen
        addSpeak("I cannot see you, please stand in front of the computer", 6000);
      } else if (introStep < intro.length) {
        addSpeak(intro[introStep], 1000);
        introStep++
      } else {
        mySound.setVolume(1, 1);
        setTimeout(function() {
          state = 0.5;
          mySound.setVolume(0.2, 1);
        }, 10000);

      }

    }





  } else if (state == 0.5) { // guided to a sound bit

    if (!speaking) {

      if (guidedToPos < guidedToASoundBite.length) {
        addSpeak(guidedToASoundBite[guidedToPos], 1000);
        guidedToPos++


      } else if (guidedToPos == guidedToASoundBite.length) { // find random movement to got.
        var movementText = getRandom(sentences)
          .replace("[side]", getRandom(side))
          .replace("[side]", getRandom(side))
          .replace("[tilt]", getRandom(tilt))
        print(movementText);
        addSpeak(movementText, random(4000, 7000));
        guidedToPos++;
        sI = round(random(sounds.length - 1));
        sounds[sI].stop();
        print(sounds[sI].isLooping());
      } else if (guidedToPos == guidedToASoundBite.length + 1 && !sounds[sI].isPlaying()) { // atart the sound
        guidedToPos++;
        sounds[sI].play();
        sounds[sI].setVolume(1);
        curText = "";
      } else if (guidedToPos == guidedToASoundBite.length + 2 && !sounds[sI].isPlaying()) { // go to the next state
        state = 1;

        addSpeak("Now it’s your turn to remember from the body - once you’re in the position, \nI invite you to share the memories or images that arise by talking out loud. \nIf nothing comes to mind just say that and relax.", 3000);

      }


    }


  } else if (state == 1) { // guided movement

    if (!speaking) { // find yor moment.
      if (movementStep == 1) {
        //  addSpeak(pauseAndListen, random(7000, 10000));
        state = 2;
      } else { // moving the body

        var movementText = getRandom(sentences)
          .replace("[side]", getRandom(side))
          .replace("[side]", getRandom(side))
          .replace("[tilt]", getRandom(tilt))
        print(movementText);
        addSpeak(movementText, random(4000, 7000));


        movementStep++;

      }
    }

  } else if (state == 2) // finding a moment
  {

    if (!speaking) {
      addSpeak("What comes to mind when you’re in this position? \nDo you remember anything? \nPlease talk out loud for up to half a minute. From 3. 2. 1. now", 0);

      state = 3;
    }



  } else if (state == 3) {

    if (!speaking) {
      mySound.setVolume(0, 1);
      state = 4;
      startPoseRecording();
      recordingTimer = millis();

      setTimeout(function() {
        endPoseRecording();
        mySound.setVolume(0.3, 1);
        addSpeak("Thank you for sharing your experience. It has been saved to your computer.", 3000);
        addSpeak("You can now explore your memory with all the other memories", 3000);
        addSpeak("Move your body into different positions to explore the landscape", 3000);
        state = 5;

        setTimeout(function() {
          curText = "";
        }, 30000);

      }, 20000);
    }

  } else if (state == 4) { // recording
    // todo countdown?
    background(255, 0, 0);
    fill(0, 0, 0);
    rect(0, 0, width, map(millis() - recordingTimer, 0, 20000, 0, height));
  } else if (state == 5) { // exploration
    if (!speaking && !playSounds) {
      playSounds = true;
      updateSounds();
    }

  }


  if (state >= 0 && state != 4 && fullscreen()) {
    printEye();
    push();

    scale(videoScaling);


    drawKeypoints(poses[0]);
    drawSkeleton(poses[0]);

    //  curCleanedPose.draw();
    pop();

    printSubtitle();
  }

  push();
  textAlign(LEFT);
  imageMode(CORNER);


  if (showVideo) {
    image(video, 0, 0, windowWidth, videoRatio * (windowWidth));
  }

  uiUpdate(mouseX, mouseY, mouseIsPressed, key, width, height);

  if (uiButton("X", color(0, 0, 0, 0), 40, 40, 0, 0).clicked) {
    showUI = !showUI;

  }

  if (showUI) {
    drawUI();
  }


  // somebody to track
  if (poses != undefined && poses.length > 0) {

    if (showSkeleton) {
      push();

      scale(videoScaling);


      drawKeypoints(poses[0]);
      drawSkeleton(poses[0]);

      //  curCleanedPose.draw();
      pop();

    }


    var i = 0;
    if (confidences != undefined) {
      for (let [key, value] of Object.entries(confidences)) {
        var curColor = color(255 - Math.round(value * 255));

        if (i < sounds.length && !recording && playSounds) {
          if (i == 0) {
            // preventing first sound to play = muted.
          }
          if (automaticPause) {
            if (value == 0) {
              sounds[i].pause();
            } else if (!sounds[i].isPlaying()) {
              sounds[i].play();
            }
          } else {
            let tmpVolume = max(minVolume.get(), value);

            //print(i + " " + tmpVolume);
            sounds[i].setVolume(tmpVolume, soundTransition.get());

          }


        }
        i++;
        muted = false;
      }
    }
  }
  // nobody on the screen - nothing to track
  else if (!recording && !muted && (poses == undefined || (poses != undefined && poses.length == 0))) {
    for (let i = 0; i < sounds.length; i++) {
      var tmpVolume = max(minVolume.get(), 0);
      sounds[i].setVolume(tmpVolume, soundTransition.get());
    }
    muted = true;
  }

  if (gamePads !== undefined && gamePads.length > 0) {
    redButtonPressed = gamePads[0].state["FACE_1"];
    if (redButtonPressed) {

      if (!redButtonPressedOld) {

        startPoseRecording();


      } else {


      }

    } else if (redButtonPressedOld) {
      endPoseRecording();

    }
    redButtonPressedOld = redButtonPressed;
  }

  if (recording && confidences != undefined) {
    recordExampleKey = Object.keys(confidences)[Object.keys(confidences).length - 1];

  }

  pop();



}


var recordingSound = false;
var recordingName = "";

function startPoseRecording() {
  if (poses != undefined && poses.length > 0) {
    recordingName = addPose();

    doClassify = false;
    // mute all sounds
    playSounds = false;
    for (let i = 0; i < sounds.length; i++) {


      sounds[i].stop();

    }

    if (recordSound) {
      recordingSound = false;

      if (classifierCounter > 1) // hack not pretty muting first
      {
        setTimeout(startSoundRecording, 100)
      }
    }


    recording = true;
  }
}

function startSoundRecording() {
  recordingSound = true
  // create an empty sound file that we will use to playback the recording
  soundFile = new p5.SoundFile();
  recorder.record(soundFile);
}

function endPoseRecording() {

  if (recordSound) {
    if (recordingSound) {
      recorder.stop(); // stop recorder, and send the result to soundFile
      // soundFile.play();

      sounds.push(soundFile);
      if (playSounds) {
        sounds[sounds.length - 1].loop();
        sounds[sounds.length - 1].setVolume(0);
      }

      save(soundFile, recordingName + '.wav');

    } else { // add empty sound to secure spot
      sounds.push(loadSound('audio3/nosound.wav'));
    }
  } else // no sound recording - adding from list instead.
  {
    if (soundFileList.length > 0 && classifierCounter > 1) {

      sounds.push(loadSound(soundFileList.shift()));
    } else {
      sounds.push(loadSound('audio3/nosound.wav'));
    }
  }
  // saveRequested();
  doClassify = true;




  // save(soundFile, 'mySound.wav');
  recordExampleKey = undefined;
  recording = false;
}

function updateSounds() {

  if (!playSounds) {
    // .isPlaying() returns a boolean
    for (var i = 0; i < sounds.length; i++) {
      sounds[i].stop();
    }
  } else {
    for (var i = 1; i < sounds.length; i++) {
      sounds[i].loop();
      sounds[i].setVolume(0);
    }

  }
}



function drawUI() {


  var i = 0;
  var xPos = -50;
  var yPos = 120;

  uiContainerStart(50, 40);


  if (uiToggle("Sound", playSounds).clicked) {
    playSounds = !playSounds;
    if (!playSounds) {
      // .isPlaying() returns a boolean
      for (var i = 0; i < sounds.length; i++) {
        sounds[i].stop();
      }
    } else {
      for (var i = 1; i < sounds.length; i++) {
        sounds[i].loop();
        sounds[i].setVolume(0);
      }

    }

  }

  if (uiScrollbar("Min volume (" + minVolume.get() + ")", 0, 0.5, minVolume).clicked) {

  }

  if (uiScrollbar("Transition (" + soundTransition.get() + ")", 0, 3, soundTransition).clicked) {

  }




  if (uiToggle("Classify", doClassify).clicked) {


    doClassify = !doClassify;
  }

  if (uiToggle("Rec sound", recordSound).clicked) {

    recordSound = !recordSound;
  }



  if (uiToggle("Video", showVideo).clicked) {
    showVideo = !showVideo;
  }

  if (uiToggle("Skeleton", showSkeleton).clicked) {
    showSkeleton = !showSkeleton;
  }

  if (uiToggle("Auto pause", automaticPause).clicked) {
    automaticPause = !automaticPause;
  }




  if (uiButton("Download").clicked) {
    knnClassifier.save();
  }
  if (uiButton("Load").clicked) {
    loadData();

  }

  var recordColor = color(255, 0, 0);

  var uio = uiButton("Record", recordColor);

  if (uio.pressed) {
    if (!recording) {
      startPoseRecording();
    }
  } else if (uio.pressedUp) {
    if (recording) {
      endPoseRecording();
    }
  }



  inputVolume.set(amplitude.getLevel());
  uiScrollbar("Mic vol", 0, 0.2, inputVolume)

  if (uiButton("printposes").clicked) {
    print(poses);
  }

  framerate = framerate * 0.9 + 0.1 * 1000 / (millis() - timer);
  uiText("Framerate: " + Math.round(framerate));
  uiText("C:" + classifierCounter +
    "S:" + sounds.length +
    "F:" + soundFileList.length +
    "K:" + knnClassifier.getNumLabels());
  timer = millis();
  uiContainerEnd();

  uiContainerStart(290, 40);
  if (confidences != undefined) {


    for (let [key, value] of Object.entries(confidences)) {
      var curColor = color(255 - Math.round(value * 255));

      if (uiButton(key.substring(key.indexOf("_")) + ": " + Math.round(value * 100) + " (" + poseCount[key] + ")", curColor).pressed) {


        addExample(key);

      }

      xPos = xPos + 0;
      yPos = yPos + 220;
      i++;
    }

  }

  if (uiButton("+ pose").clicked && poses.length > 0) {
    doClassify = true;
    addPose();
    if (soundFileList.length > 0 && classifierCounter > 1) {

      sounds.push(loadSound(soundFileList.shift()));
    } else {
      sounds.push(loadSound('audio3/nosound.wav'));
    }
  }

  if (uiButton("Clear all").clicked) {
    knnClassifier.clearAllLabels();
    for (let i = 0; i < sounds.length; i++) {
      sounds[i].stop();
    }
    sounds = [];
    confidences = undefined;
    classifierCounter = 0;

    poseCount = [];

  }

  uiContainerEnd();

}




// Add the current frame from the video to the classifier
function addExample(label) {
  if (poses != undefined && poses.length > 0) {

    // Convert poses results to a 2d array [[score0, x0, y0],...,[score16, x16, y16]]
    const poseArray = poses[0].pose.keypoints.map(p => [p.score, p.position.x, p.position.y]);
    if (poseCount[label] == undefined) {
      poseCount[label] = 0;
    }
    poseCount[label]++;
    // Add an example with a label to the classifier
    knnClassifier.addExample(poseArray, label);
    // updateCounts();
  }
}


function addPose() {

  var name = new Date().getTime() + "_pose_" + classifierCounter;
  print(name);
  addExample(name);
  classify();
  classifierCounter = classifierCounter + 1;
  return name;

}

class cleanedPose {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.keyPoints = [];
  }

  draw() {
    stroke(0);
    push();
    noFill();
    translate(this.x, this.y);


    rect(0, 0, this.width, this.height);
    //fill(0);
    for (var i = 0; i < this.keyPoints.length; i++) {

      var position = this.keyPoints[i].position;
      ellipse(position.x, position.y, 20, 20);
    }
    pop();
  }
}


function cleanUpPose(pose) {
  var cPose = new cleanedPose();
  cPose.x = 10000;
  cPose.y = 10000;
  for (let j = 0; pose.pose.keypoints != undefined && j < pose.pose.keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = pose.pose.keypoints[j];
    let position = keypoint.position;
    // Only draw an ellipse is the pose probability is bigger than 0.2
    if (keypoint.score > 0.2) {
      if (position.x < cPose.x) {
        cPose.x = position.x;

      }
      if (position.y < cPose.y) {
        cPose.y = position.y;
      }
      if (position.x > cPose.width) {
        cPose.width = position.x;
      }

      if (position.y > cPose.height) {
        cPose.height = position.y;
      }


      cPose.keyPoints.push({
        position: {
          x: position.x,
          y: position.y
        },
        score: keypoint.score
      });

    }
  }
  for (var i = 0; i < cPose.keyPoints.length; i++) {
    cPose.keyPoints[i].position.x -= cPose.x;
    cPose.keyPoints[i].position.y -= cPose.y;
  }
  cPose.width = cPose.width - cPose.x;
  cPose.height = cPose.height - cPose.y;


  //cPose.draw();



  return cPose;


}

function cleanUpSkeleton(skeleton) {
  var minX = 1000;
  var minY = 1000;
  for (let j = 0; j < skeleton.length; j++) {



    let partA = skeleton[j][0];
    let partB = skeleton[j][1];

    minX = Math.min(minX, partA.position.x);

    minY = Math.min(minY, partA.position.y);

    minX = Math.min(minX, partB.position.x);
    minY = Math.min(minY, partB.position.y);



  }

  for (let j = 0; j < skeleton.length; j++) {

    // console.log(j);

    /*skeleton[j][0].position.x =  skeleton[j][0].position.x - minX;
    skeleton[j][0].position.y =  skeleton[j][0].position.y - minY;
    skeleton[j][1].position.x =  skeleton[j][1].position.x - minX;
    skeleton[j][1].position.y =  skeleton[j][1].position.y - minY;*/
  }
  return skeleton;
}





// A function to draw ellipses over the detected keypoints
var oldKeypoint;

function drawKeypoints(pose) {

  // Loop through all the poses detected
  // 

  for (let j = 0; pose != undefined && pose.pose != undefined && pose.pose.keypoints != undefined && j < pose.pose.keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = pose.pose.keypoints[j];
    // Only draw an ellipse is the pose probability is bigger than 0.2
    if (keypoint.score > 0.2) {
      fill(255, 255, 255, 150);
      noStroke();
      ellipse(keypoint.position.x, keypoint.position.y, 15, 15);
      if (oldKeypoint != undefined) {
        stroke(255, 255, 255, 150);
        strokeWeight(4);
        // line(keypoint.position.x, keypoint.position.y,oldKeypoint.position.x, oldKeypoint.position.y);
      }

      oldKeypoint = keypoint;

    }
  }

}

// A function to draw the skeletons
function drawSkeleton(pose) {

  if (pose != undefined) {
    let skeleton = pose.skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 255, 255, 150);
      strokeWeight(4);

      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }

}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function mousePressed() {

}

function keyReleased() {

  if (key == 'f') {
    var fs = fullscreen();
    fullscreen(!fs);
  }
}

function noScrolling() {
  document.addEventListener('touchstart', function(event) {
    event.preventDefault();
  }, {
    passive: false
  });
}