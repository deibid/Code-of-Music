/**
 * 
 * Mega sample arpeggiator
 * 
 * 
 * David Azar
 * davidazar.mx
 * 
 * 
 * NYU ITP
 * October 2018
 * 
 */



/** Graphics and UI */

let mPaintVectors =[];
/** Graphics and UI*/

let mChannelCount = 5;
let mChannel1Level = 0;
let mChannel2Level = 0;
let mChannel3Level = 0;
let mChannel4Level = 0;
let mChannel5Level = 0;

/** Audio  */
let mSampler1;
let mSampler2;
let mSampler3;
let mSampler4;
let mSampler5;


// let testScale = ["c2","c#2","d2","d#2","e2","f2","f#2","g2","g#2","a2","a#2","b2","c3","c#3","d3","d#3","e3","f3","f#3","g3","g#3","a3","a#3","b3"];
let mPattern1 = new Tone.Pattern(playPattern1,["A3","G3","E3","F3"],"randomOnce");
mPattern1.interval = "4n";

let mPattern2 = new Tone.Pattern(playPattern2,["C2","D2"],"up");
mPattern2.interval = "1n";

let mPattern3 = new Tone.Pattern(playPattern3,["A2","D3","B2"],"alternateUp");
mPattern3.interval = "3n";

let mPattern4 = new Tone.Pattern(playPattern4,["C4"],"up");
mPattern2.interval = "16n";

let mPattern5 = new Tone.Pattern(playPattern5,["E4"],"up");
mPattern2.interval = "16n";
/** Audio  */


function setup(){

    mSampler1 = new Tone.Sampler({
        "E2":"E2-David.mp3",
        "F2":"F2-David.mp3",
        "G2":"G2-David.mp3",
        "C3":"C3-David.mp3",
        "D3":"D3-David.mp3",
        "E3":"E3-David.mp3",
        "F3":"F3-David.mp3",
        "G3":"G3-David.mp3",
        "A3":"A3-David.mp3"
    },null,"sounds/").toMaster();

    mSampler2 = new Tone.Sampler({
        "E2":"E2-David.mp3",
        "F2":"F2-David.mp3",
        "G2":"G2-David.mp3",
        "C3":"C3-David.mp3",
        "D3":"D3-David.mp3",
        "E3":"E3-David.mp3",
        "F3":"F3-David.mp3",
        "G3":"G3-David.mp3",
        "A3":"A3-David.mp3"
    },null,"sounds/").toMaster();

    mSampler3 = new Tone.Sampler({
        "E2":"E2-David.mp3",
        "F2":"F2-David.mp3",
        "G2":"G2-David.mp3",
        "C3":"C3-David.mp3",
        "D3":"D3-David.mp3",
        "E3":"E3-David.mp3",
        "F3":"F3-David.mp3",
        "G3":"G3-David.mp3",
        "A3":"A3-David.mp3"
    },null,"sounds/").toMaster();

    mSampler4 = new Tone.Sampler({
        "E2":"E2-David.mp3",
        "F2":"F2-David.mp3",
        "G2":"G2-David.mp3",
        "C3":"C3-David.mp3",
        "D3":"D3-David.mp3",
        "E3":"E3-David.mp3",
        "F3":"F3-David.mp3",
        "G3":"G3-David.mp3",
        "A3":"A3-David.mp3"
    },null,"sounds/").toMaster();

    mSampler5 = new Tone.Sampler({
        "E2":"E2-David.mp3",
        "F2":"F2-David.mp3",
        "G2":"G2-David.mp3",
        "C3":"C3-David.mp3",
        "D3":"D3-David.mp3",
        "E3":"E3-David.mp3",
        "F3":"F3-David.mp3",
        "G3":"G3-David.mp3",
        "A3":"A3-David.mp3"
    },null,"sounds/").toMaster();

    let chorus = new Tone.Chorus(4,2.5,0.2).toMaster();
    mSampler1.connect(chorus);
    mSampler1.connect(new Tone.AutoPanner(0.5).toMaster().start());

    let tremolo = new Tone.Tremolo(9,0.75).toMaster().start();
    mSampler2.connect(tremolo);


    mSampler3.connect(new Tone.FeedbackDelay(0.3,0.2).toMaster());

    mSampler4.connect(new Tone.Phaser(15,5,2000).toMaster());

    mSampler5.connect(new Tone.Vibrato(20,5).toMaster());
    
    Tone.Transport.start();

    mSampler1.volume.value = -100;
    mSampler2.volume.value = -100;
    mSampler3.volume.value = -100;
    mSampler4.volume.value = -100;
    mSampler5.volume.value = -100;

    mPattern1.start();
    mPattern2.start();
    mPattern3.start();
    mPattern4.start();
    mPattern5.start();
    


    createCanvas(windowWidth,windowHeight);
    background("#000000");
    
    

}

function draw(){

    background("#000000");
    
    if(random() > 0.05){
        mPaintVectors.push(new PaintVector());
    }

    mPaintVectors.forEach(vector=>{
        vector.update();
        vector.display();
        vector.deductLifespan();
    });

    mPaintVectors = mPaintVectors.filter(vector=> !vector.killMe);


}



function playPattern1(time,note){
    
    // let sixth = Tone.Frequency(note).transpose(4);
    
    if(mSampler1.loaded){
        mSampler1.triggerAttack(note);
        // mSampler1.triggerAttack(sixth);
    }
}

function playPattern2(time,note){
    if(random(10)>8)return;
    if(mSampler2.loaded)
    mSampler2.triggerAttack(note);
}


function playPattern3(time,note){
    if(random(10)>8)return;

    if(mSampler3.loaded)
    mSampler3.triggerAttack(note);
}

function playPattern4(time,note){
    if(random(10)>8)return;

    if(mSampler4.loaded)
    mSampler4.triggerAttack(note);
}

function playPattern5(time,note){
    if(random(10)>9)return;
    if(mSampler5.loaded)
    mSampler5.triggerAttack(note);
}




function ch1SetLevel(value){
    mSampler1.volume.value = map(value,0,100,-70,0);
}

function ch2SetLevel(value){
    mSampler2.volume.value = map(value,0,100,-80,0);
}

function ch3SetLevel(value){
    mSampler3.volume.value = map(value,0,100,-70,0);
}

function ch4SetLevel(value){
    mSampler4.volume.value = map(value,0,100,-70,0);
}

function ch5SetLevel(value){
    mSampler5.volume.value = map(value,0,100,-70,0);
}





function PaintVector(){

    this.x1 = random(windowWidth);
    this.y1 = random(windowHeight);
    this.color = ["#1DBA53","#808080","#C0C0C0","#800F02"][getRandomInt(3)];
    this.x2 = 0;
    this.y2;
    this.length = 0;
    this.lifespan = 100;
    this.killMe = false;
}

PaintVector.prototype.update = function(){
    
    this.length+=2;
    
}

PaintVector.prototype.display = function(){

    stroke(this.color);


    this.x2 = this.x1-this.length;
    this.y2 = this.y1 - this.length*(0.8);

    line(this.x1,this.y1,this.x2,this.y2);

}

PaintVector.prototype.deductLifespan = function(){

    if(this.x2 <= 0){
        this.lifespan--;

        if(this.lifespan <= 0){
            this.killMe = true;
        }
    }

}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


