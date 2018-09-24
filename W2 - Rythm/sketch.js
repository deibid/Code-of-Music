var mFont;



var mKit = {};

// var kick = new Tone.Player("sounds/kick.wav");
var soundOne = new Tone.Player("sounds/kick.wav");
var soundTwo = new Tone.Player("sounds/crash.wav");
var soundThree = new Tone.Player("sounds/tom1.wav");
var soundFour = new Tone.Player("sounds/snare.wav");


var mCanvas;
var mParticleManager;


var mCurrentSequencerStep = 0;
var mMasterStart = false;


const SEQUENCE_STEPS = 8;
const NUMBER_OF_SOUNDS = 4;

var mSequenceMatrix = new Array(NUMBER_OF_SOUNDS);

mSequenceMatrix[0] = new Array(SEQUENCE_STEPS);
mSequenceMatrix[1] = new Array(SEQUENCE_STEPS);
mSequenceMatrix[2] = new Array(SEQUENCE_STEPS);
mSequenceMatrix[3] = new Array(SEQUENCE_STEPS);



Tone.Transport.bpm.value = 100;
Tone.Transport.scheduleRepeat(stepSequence, "8n");
Tone.Transport.start();


function preload(){
    mFont = loadFont("fonts/Roboto_Mono/RobotoMono-Light.ttf");
}

function setup() {

    mParticleManager = new ParticleManager();

    // Todo: Create an array to manage all sounds
    soundOne.volume.value = -4;
    soundTwo.volume.value = -15;
    soundThree.volume.value = -10;
    soundFour.volume.value = -20;
    
    mKit.soundOne = soundOne;
    mKit.soundTwo = soundTwo;
    mKit.soundThree = soundThree;
    mKit.soundFour = soundFour;

    for (const key in mKit) {
        if (mKit.hasOwnProperty(key)) {
            mKit[key].toMaster();
        }
    }

    mCanvas = createCanvas(windowWidth,windowHeight);
    
    
}

function draw(){

    mCanvas.clear();
    displayInstructions();

    if(mMasterStart){
        mParticleManager.updateParticles();
        mParticleManager.displayParticles();
    }
}

// Audio playback loop
function stepSequence(){

    if(!mMasterStart) return;
  
    if(mSequenceMatrix[0][mCurrentSequencerStep] === 1){
    
        if(mKit.soundOne.loaded){
            mKit.soundOne.start();
        }
    }

    if(mSequenceMatrix[1][mCurrentSequencerStep] === 1){
        if(mKit.soundTwo.loaded){
            mKit.soundTwo.start();
        }
    }

    if(mSequenceMatrix[2][mCurrentSequencerStep] === 1){
        if(mKit.soundThree.loaded){
            mKit.soundThree.start();
        }
    }

    if(mSequenceMatrix[3][mCurrentSequencerStep] === 1){
        if(mKit.soundFour.loaded){
            mKit.soundFour.start();
        }
    }


    mCurrentSequencerStep++;
    if(mCurrentSequencerStep === 8){
        mCurrentSequencerStep = 0;
    }
    
}


function keyPressed(){

    switch (keyCode){
        case 32: 
        console.log("Spacebar");
        mMasterStart = true;
        populateSequenceMatrix();
        restartParticles();
        break;
    }

}

	
function displayInstructions(){

    textFont(mFont);
    textSize(36);

    if(!mMasterStart){
        fill("#323232");
    }else{
        fill("#CDCDCD");
    }

    text("PRESS SPACEBAR TO GENERATE A RANDOM BEAT",windowWidth/7,windowHeight/1.9);
    push();

}



function populateSequenceMatrix(){

    for(var i = 0; i<NUMBER_OF_SOUNDS; i++){
        for(var j = 0; j<SEQUENCE_STEPS; j++){
            mSequenceMatrix[i][j] = randomBooleanInt();
        }
    }   


    console.log("SEQUENCE MATRIX");
    console.log(mSequenceMatrix);

}


function restartParticles(){

    mParticleManager.restartParticles();

}



function ParticleManager(){

    this.particles = [
        new Particle(),
        new Particle(),
        new Particle(),
        new Particle(),
        new Particle(),
        new Particle(),
        new Particle()
    ];
    
    
    this.restartParticles();

}


ParticleManager.prototype.restartParticles = function(){

    this.particles.forEach(particle => {
       particle.initialize(); 
    });
}


ParticleManager.prototype.updateParticles = function(){
    this.particles.forEach(particle => {
        particle.updatePosition(); 
     });   
}

ParticleManager.prototype.displayParticles = function(){
    this.particles.forEach(particle => {
        particle.display(); 
     });   
}

function Particle() {

    this.radius = 50;
    // this.color = "#455A64";
    this.color = "#F23168";
    this.xInit;
    this.yInit;
    this.currentX;
    this.currentY;

    // Plus or minus direction for movement on either axis;
    this.xMovementDirection;
    this.yMovementDirection;

}


Particle.prototype.initialize = function(){

    this.xInit = random(100,windowWidth-100);
    this.yInit = random(100,windowHeight-100);
    this.currentX = this.xInit;
    this.currentY = this.yInit;

    // set either a -1(left, down) or 1 (right, up)
    this.xMovementDirection = (randomBooleanInt() === 1) ? 1:-1;
    this.yMovementDirection = (randomBooleanInt() === 1) ? 1:-1;

}


Particle.prototype.updatePosition = function(){


    this.currentX = this.currentX + (2*this.xMovementDirection);
    this.currentY = this.currentY + (2*this.yMovementDirection);

    if(this.currentX - this.radius/2 <= 0){
        this.xMovementDirection = 1;
    } 
    
    if(this.currentX + this.radius/2 >= windowWidth){
        this.xMovementDirection = -1;
    }

    if(this.currentY - this.radius/2 <= 0){
        this.yMovementDirection = 1;
    }
    
    if(this.currentY + this.radius/2 >= windowHeight){
        this.yMovementDirection = -1;
    }

}

Particle.prototype.display = function(){

    fill(this.color);
    strokeWeight(0);
    ellipse(this.currentX, this.currentY, this.radius);

}


function randomBooleanInt(){
    
    return (random(0,1) >= 0.49) ? 1:0;
}