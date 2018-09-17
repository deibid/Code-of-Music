
// sound file objects
let soundBirds;
let soundWater;
let soundSeller;
let soundBell;
let soundGong;
let soundGuitar;
let soundGlass;
let soundTrafficLight;


//  allowed strings for input text
let mAllowedSoundStrings = ["birds","bell","glass","gong","guitar","seller","traffic light","waterdrops"];

// array containing the sounds when ready
let mSounds = [];

// DOM element for user input
let mInputText;


// Sound specific configurator objects
let mBackgroundSoundAmplitude;
let mWaterSoundAmplitude;
let mBellSoundAmplitude;
let mSellerPeaks;
let mTrafficlightWords = [];


// Canvas
let mCanvas;




function preload(){

    soundBirds = loadSound('sound/birds.wav');
    soundBell = loadSound('sound/bell.wav');
    soundGlass = loadSound('sound/glass.wav');
    soundGong = loadSound('sound/gong.wav');
    soundGuitar = loadSound('sound/guitar.wav');
    soundSeller = loadSound('sound/seller.wav');
    soundTrafficLight = loadSound('sound/traffic light.wav');
    soundWater = loadSound('sound/waterdrops.wav');


    mSounds.push(soundBirds);
    mSounds.push(soundBell);
    mSounds.push(soundGlass);
    mSounds.push(soundGong);
    mSounds.push(soundGuitar);
    mSounds.push(soundSeller);
    mSounds.push(soundTrafficLight);
    mSounds.push(soundWater);


    // End callback for each sound 
    for(let i=0; i<mSounds.length;i++){
        mSounds[i].onended(soundEndedCallback);
    }
}



/**
 * Since this app uses HTML elements, they are added dynamically using the P5.DOM library
 * The parent() function inserts the element inside the desired container, which already exists in the index.html file
 */
function setup(){

    frameRate(30);
    mCanvas = createCanvas(windowWidth, windowHeight);
    mCanvas.parent("canvas-container");
    mCanvas.background(255);


    mInputText = createInput("");
    mInputText.attribute("placeholder","Enter a sound name");
    mInputText.parent("input-container");
    mInputText.id("input-text");

    mInputText.elt.focus();

    for(let i =0; i<mAllowedSoundStrings.length; i++){
        let tag = createDiv(mAllowedSoundStrings[i]);
        tag.parent("sound-tag-container");
        tag.class("sound-inactive");
        tag.id(mAllowedSoundStrings[i]);
    }
    


    // Configuration of Background sound and visuals
    mBackgroundSoundAmplitude = new p5.Amplitude();
    mBackgroundSoundAmplitude.setInput(soundBirds);
    mBackgroundSoundAmplitude.smooth();
    mBackgroundSoundAmplitude.toggleNormalize(false);
    // Configuration of Background sound and visuals

    
    // Configuration for watersound
    mWaterSoundAmplitude = new p5.Amplitude();
    mWaterSoundAmplitude.setInput(soundWater);
    mWaterSoundAmplitude.smooth();
    mWaterSoundAmplitude.toggleNormalize(true);
    // Configuration for watersound

    // Configuration for bellsound
    mBellSoundAmplitude = new p5.Amplitude();
    mBellSoundAmplitude.setInput(soundBell);
    mBellSoundAmplitude.toggleNormalize(true);
    mBellSoundAmplitude.smooth();
    // Configuration for bellsound



    // Configuration of seller peaks
    soundSeller.processPeaks(mProcessPeaksCallback,0.05,0.08,200);
    // Configuration of seller peaks


    // Configuration of word objects
    for(let i = 0; i<80;i++){
        mTrafficlightWords.push(new Word());
    }
    // Configuration of word objects




    
}


/**
 * Draw function.
 * There are if statements around each sound to prevent any graphics before they are played.
 */
function draw(){

    mCanvas.background(255);
    drawBirdsGraphics();

    push();

    if(soundWater.isPlaying()){
        drawWaterGraphics();
        push();        
    }

    if(soundBell.isPlaying()){
        drawBellGraphics();
        push();
    }

    if(soundGlass.isPlaying()){
        drawGlassGraphics();
        push();
    }

    if(soundSeller.isPlaying()){
        drawSellerGraphics();
        push();
    }

    if(soundGong.isPlaying()){
        drawGongGraphics();
        push();
    }

    if(soundGuitar.isPlaying()){
        drawGuitarGraphics();
        push();
    }

    if(soundTrafficLight.isPlaying()){
        drawTrafficlightGraphics();
        push();
    }

}



/**
 * Handle keyboard events
 */
function keyPressed(){

    switch (keyCode){
        case ENTER:
        handleEnterPressed();
    }
}


/**
 * Simple logic to handle the enter Key
 */
function handleEnterPressed(){

    let value = mInputText.value();
    mInputText.value("");

    if(value === 'stop'){
        stopAllSound();
    }

    if(value === 'all'){
        playAllSounds();
    }

    let soundIndex = mAllowedSoundStrings.indexOf(value);
    let soundExists = soundIndex !== -1;


    if(soundExists === false){
        // soundNotFound();
    }else{
        soundFound(soundIndex);
    }
}



function soundFound(soundIndex){
    
    if(mSounds[soundIndex].isPlaying()){
        mSounds[soundIndex].stop();
        select("#"+mAllowedSoundStrings[soundIndex]).class("sound-inactive");
    }else{
        mSounds[soundIndex].play();
        select("#"+mAllowedSoundStrings[soundIndex]).class("sound-active");
    }




}



/**
 * Callback to handle sound ending events
 * @param {id} params 
 */
function soundEndedCallback(params){

    let url = params.url;
    let splits = url.split("/");
    let soundFile = splits[splits.length-1];
    let soundId = soundFile.split(".")[0];

    select("#"+soundId).class("sound-inactive");


}


/**
 * Emergency stop for all sounds
 */
function stopAllSound(){
    for(let i =0; i<mSounds.length;i++){
        mSounds[i].stop();
    }
}

/**
 * Play all sounds at the same time
 */
function playAllSounds(){
    for(let i =0; i<mAllowedSoundStrings.length;i++){
        soundFound(i);
    }
}



/**
 * The following functions are sound specific.
 * Each sound produces a different effect
 */


function drawBirdsGraphics(){

    let level = mBackgroundSoundAmplitude.getLevel();
    let background = map(level,0,1,50,255);
    mCanvas.background(background);

}



function drawWaterGraphics(){
    
    if(mWaterSoundAmplitude.getLevel()<0.15)return;

    let xpos = map(soundWater.currentTime(),0,soundWater.duration(),0,windowWidth);
    let ypos = windowHeight/2;

    fill(random(0,255), random(0,255),random(0,255)); 
    strokeWeight(0);

    
    let width = map(mWaterSoundAmplitude.getLevel(),0,1,10,400);
    ellipse(xpos, ypos, width);

}


function drawBellGraphics(){

    fill("rgba(250,86,98,0.5)");
    strokeWeight(0);
    let height = map(mBellSoundAmplitude.getLevel()*1.5,0,1,0,windowHeight);
    rect(0, 0, windowWidth,height);

}


function drawGlassGraphics(){

    let ypos = windowHeight - map(soundGlass.currentTime(),0,soundGlass.duration(),0,windowHeight);
    strokeWeight(40);
    stroke(random(0,255),random(0,255),random(0,255));
    line(0,ypos,windowWidth,ypos);

}


function drawSellerGraphics(){


    fill("#59C9F1");
    strokeWeight(0);
    
    let normalizedXpos;
    let normalizedYpos;

    let maxNumber = Math.max(...mSellerPeaks);
    
    
    for(let i = 0; i<mSellerPeaks.length; i++){
        normalizedXpos = map(i,0,mSellerPeaks.length,0,windowWidth);
        normalizedYpos = map(mSellerPeaks[i],0,maxNumber,0,windowHeight);
        triangle(normalizedXpos,normalizedYpos,normalizedXpos+33,normalizedYpos-40,normalizedXpos+30,normalizedYpos+10);
    }


}


function drawGongGraphics(){

    
    let r = 254;
    let g = 203;
    let b = 47;
    let a = 1-map(soundGong.currentTime(),0,soundGong.duration(),0,1);

    fill("rgba("+r+","+g+","+b+","+a+")");
    strokeWeight(0);


    let shapeRadius = 15;
    let spaceBetween = 5;
    let shapesPerRow = windowWidth/(shapeRadius+spaceBetween);
    let shapesPerColumn = windowHeight/(shapeRadius+spaceBetween);
    let totalShapes = shapesPerRow*shapesPerColumn;

    let x;
    let y;
    
    for(let i =0.25; i<shapesPerRow; i++){
        for(let j = 0.5; j<shapesPerColumn; j++){
            x = i*(shapeRadius+spaceBetween);
            y = j*(shapeRadius+spaceBetween);

            ellipse(x,y,shapeRadius);
        }
    }



}


function drawGuitarGraphics(){

    fill("#F0F0F0");
    strokeWeight(0);
    let xpos = map(soundGuitar.currentTime(),0,soundGuitar.duration(),0,windowWidth);
    let width = 300;
    
    rect(xpos,0,width,windowHeight);
    rect(windowWidth-width-xpos,0,width,windowHeight);

}

function drawTrafficlightGraphics(){

    for(let i =0;i<mTrafficlightWords.length;i++){
        mTrafficlightWords[i].display();
    }

}

function mProcessPeaksCallback(peaks){
    mSellerPeaks = peaks;
}



/**
 * Class for reprenting individual words for the Traffic Light sound
 */
var Word = function (){
    this.x = random(0,windowWidth);
    this.y = random(0,windowHeight);
    this.color = "#B43C60";
    this.fontSize = random(2,100);
    this.angle = random(0,TWO_PI);
}

Word.prototype.display = function(){
    fill(this.color);
    // translate(this.x,this.y);
    rotate(this.angle);
    textSize(this.fontSize);
    text("alto",this.x,this.y);
}