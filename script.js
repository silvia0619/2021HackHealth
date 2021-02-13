//start

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = "./my_model/";
let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
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
var specialflag = false
async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    // for (let i = 0; i < maxPredictions; i++) {
    //     const classPrediction =
    //         prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    //     labelContainer.childNodes[i].innerHTML = classPrediction;
    // }
    if (classNum == 6){
        specialflag = true;
        classNum = 5;
    }
    if (classNum == 4){
        var voice = new Audio("./voice/Full body stretch will begin. Fit your full body in the webcam.mp3")
        voice.play();
    }
    if(prediction[classNum].probability == 1.0 && !started){
       onlyOnce();
    }
    // finally draw the poses
    drawPose(pose);
}
function onlyOnce(){
     //console.log(executed);
     //   if(!executed){
     //       executed = true;
     //   }
     var forGrayIdd = "images/gray-" + classNum + "-1.jpg";
     var forGrayId = "images/gray-" + classNum + ".jpg";
     var whereTo = "pose" + classNum + "img";
     if(classNum == 0 || classNum == 2 || classNum == 4){
        document.getElementById(whereTo).src = forGrayIdd; 
        
    }
    else{
        document.getElementById(whereTo).src = forGrayId; 
        
    }
    theTimer();
    
    add();
    
}
function add(){
    console.log("class Number", classNum);
    classNum++;
   
    //executed = false;
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
    var theClassNum = classNum
    console.log(theClassNum, "theclassNum");
    console.log("how many times does the timer work?");
    if(classNum == 0 || classNum == 2 || classNum == 4){
        time = 20;
    }
    else{
        time = 10;
    }
    var sec = "";
    var timer = setInterval(function(){
        sec = time;        
        document.getElementById("timerId").innerHTML = sec;

        if(time == 11){
            var forIdd = "images/" + theClassNum + "-2.jpg"
            document.getElementById("poseImg").src = forIdd; 
            var voice = new Audio("./voice/Also stretch the other side.mp3")
            voice.play();
            
        }
        if(time <= 5){
        var voice = new Audio("./voice/"+ (time) + ".mp3")
        voice.play();
        }
        time--;

        if(time == -1 && classNum == 5 && specialflag) {
            location.replace("./goodjob.html");
        }
        if(time < 0){
            
            console.log("NOW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            var forIdd = "images/" + (theClassNum + 1) + "-1.jpg";
            var forId = "images/" + (theClassNum + 1) + ".jpg";
            
            if((theClassNum + 1) == 0 || (theClassNum + 1) == 2 || (theClassNum + 1) == 4){
                document.getElementById("poseImg").src = forIdd;
                
            }
            else{
                if(classNum == 6) {
                    location.replace("./goodjob.html");
                }
                document.getElementById("poseImg").src = forId;
                
            }
        
        }
        
    
        if(sec<1){
            clearInterval(timer);
            started = false;
            
        }
    }, 1000);
    
}


//next button

function next(){
    console.log("nnnnnnnnnnnnn");
    classNum++;
    //executed = false;
    started = false;
    time = 10;
}
