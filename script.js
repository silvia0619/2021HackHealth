
//start

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = "./my_model/";
let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
  console.log("init work?????????????????")
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 400;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = size; canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
    
}
var time = 0;
async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

var classNum = 0;
var executed = false;
var started = false;

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    if(prediction[classNum].probability >= 0.8 && !started){
       onlyOnce();
    }
    // finally draw the poses
    drawPose(pose);
}
function onlyOnce(){
     console.log(executed);
        if(!executed){
            executed = true;
        }
        theTimer();
        add();
}
function add(){
    console.log("class Number", classNum);
    classNum++;
    executed = false;
}


function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

//start & end button

function startButton(){
    console.log("*******init function test");
    location.replace('stretches.html');
    //init();
}

function getBackToWorkButton(){
    window.close();
}

//popup

$ = function(id) {
    return document.getElementById(id);
  }
  
var show = function(id) {
    $(id).style.display ='block';
}
var hide = function(id) {
    $(id).style.display ='none';
}

function okButton(){
  hide('popup1');
  //init();
}

//count down
function theTimer(){
    started = true;
    console.log("how many times does the timer work?");
    time = 10;
    var sec = "";
    var timer = setInterval(function(){
        sec = time;        
        document.getElementById("timerId").innerHTML = sec;
        time--;

        if(sec<1){
            clearInterval(timer);
            started = false;
        }
    }, 1000);
}


//next button

function next(){
    console.log("ttttttttttttthe next button");
}
