
/* p5 variables */
let mPointManager;
let mPlayheadXpos = 250;
let mPlayehadWidth = 35;
let mStepIncrements = 4;


let mPlayheadColor = "#1F2024";
let mPointColor = "#578FB1";
let mBackgroundColor = "#EAEEF1";


let mDrawGrid = false;
/* p5 variables */

//C Major Pentatonic
let mScale = [369.994,415.305,466.164,554.365,622.254,739.989,830.609,932.328,1108.73,1244.51];

// G# Minor
// let mScale = [207,233,246,277,311,329,369,414,466,493,554,622,659,739,830];


let mSynthOptions = {
    oscillator  : {
        type  : "sine4"
    },
    envelope  : {
        attack  : 0.099 ,
    }
    
    }
    
    

/* Tone.js variables */
let mMasterSynth = new Tone.PolySynth(10, Tone.Synth).toMaster();


let distortion = new Tone.Distortion(0.2).toMaster();
let vibrato = new Tone.Vibrato().toMaster();
let cheby = new Tone.Chebyshev(2).toMaster();
let reverb = new Tone.Reverb().toMaster();
let bitCrusher = new Tone.BitCrusher(7).toMaster();
let chorus = new Tone.Chorus(4, 2.5, 1);

let delay = new Tone.FeedbackDelay("8n",0.4).toMaster();
/* Tone.js variables */



function setup(){

    // mMasterSynth.connect(distortion);
    // mMasterSynth.connect(vibrato);
    // mMasterSynth.connect(cheby);
    mMasterSynth.connect(reverb);
    // mMasterSynth.connect(bitCrusher);
    mMasterSynth.connect(chorus);
    mMasterSynth.connect(delay);

    mMasterSynth.set(mSynthOptions);


    mPointManager = new PointManager();
    createCanvas(windowWidth, windowHeight);
    
    frameRate(30);    
    strokeWeight(0);

    fill("#F53FD4");
    rect(mPlayheadXpos - mPlayehadWidth,0,mPlayehadWidth,windowHeight);
}


function draw(){
    
    clear();
    background(mBackgroundColor);
    fill(mPlayheadColor);
    rect(mPlayheadXpos - mPlayehadWidth,0,mPlayehadWidth,windowHeight);
    mPointManager.updatePoints(mStepIncrements);
    mPointManager.displayPoints();
    

    if(keyIsDown("32"))drawGrid(); 
    

    mPointManager.spliceOutOfScreenPoints();

    let pointsToPlay = mPointManager.extractPointsToPlay();
    if(pointsToPlay[0] !== undefined){
        let pitch = convertPointToNote(pointsToPlay[0]);
        mMasterSynth.triggerAttackRelease(pitch,"8n");
    }

}



function mousePressed(){
    mPointManager.addPoint(new Point(mouseX,mouseY));
}


function mouseDragged(){

    mPointManager.addPoint(new Point(mouseX,mouseY));

}



//todo- Limpiar ejecución, ver como refrescar imagen y considerar la posibilidad de integrar el callback de tone para el draw



function convertPointToNote(point){

    let y = point.y;
    let scaleIndex = Math.round(map(windowHeight-y,0,windowHeight,0-0.49,0.499+mScale.length-1));        
    let pitch = mScale[scaleIndex];
    // console.log("NOTA:> "+pitch);
    return pitch;


}


function drawGrid(){
    for(let i =0; i<mScale.length;i++){
        fill("rgba(0,0,0,120");
        strokeWeight(.3);
        line(0,i*windowHeight/mScale.length,windowWidth,i*windowHeight/mScale.length);
    }
}




function PointManager(){
    this.points = [];
}

PointManager.prototype.addPoint = function(point){
    this.points.push(point);
}
    

PointManager.prototype.updatePoints = function(offset){
    this.points.forEach((point)=>{
        point.updatePosition(offset);
    });
}

PointManager.prototype.displayPoints = function(){
    this.points.forEach((point)=>{
        point.display();
    });
}

PointManager.prototype.spliceOutOfScreenPoints = function(){
    
    var filtered = this.points.filter(function(point) { 
        return !point.isOutOfScreen();
    }); 

    this.points = filtered;

}

PointManager.prototype.extractPointsToPlay = function(){

    let pointsAtPlayhead = [];

    this.points.forEach((point)=>{
        if(point.isAtPlayhead()){
            pointsAtPlayhead.push(point);
        }
    });

    return pointsAtPlayhead;
}

function Point(x,y){
    this.x = x;
    this.y = y;
    this.w = 35;
    this.h = 5;
    this.tl = 0;
    this.tr = 0;
    this.br = 0;
    this.bl = 0;
    this.color = mPointColor;
}

Point.prototype.updatePosition = function(offset){
    this.x = this.x - offset;
}

Point.prototype.display = function(){
    strokeWeight(0);
    fill(this.color);
    rect(this.x,this.y,this.w,this.h,this.tl,this.tr,this.br,this.bl);
}


Point.prototype.isAtPlayhead = function(){
    return (this.x <= mPlayheadXpos && this.x >= mPlayheadXpos - mStepIncrements);
}


Point.prototype.isOutOfScreen = function(){
    return this.x <= 0;
}