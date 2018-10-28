let mSynth1 = new Tone.PolySynth(5,Tone.MonoSynth).toMaster();
// let mSynth = new Tone.MonoSynth().toMaster();
//TODO connectar otro synth y ver los dos osciladores en accion para el shape de señal
let mSynth2 = new Tone.PolySynth(5,Tone.MonoSynth).toMaster();

//  Awesome inspiration from this app: https://dotpiano.com/
let mColors = ["#4356B5","#7962BA","#9841A3","#C0326B","#E4533C","#F29246","#F5BD46","#CEBE3D","#8EBA3B","#4FB155","#4BB4A1","#4998B4"];
let mDefaultColor = "#2E2C2E";
let mInitialColor = 0;


let mMidiKeyboard;



function setup(){

  assignSynthParameters();


  $("#randomize-button").click(function(){
    assignSynthParameters();
  });

  assignClickListenersToSynthParamButtons();

  createUIKeyboard();



  

    WebMidi.enable(function(err){
      
      if(err){
        console.log("Error setting MIDI ", err);
        return;
      }

      console.log("Inputs: " + WebMidi.inputs);
      console.log("Outputs: " + WebMidi.outputs);
      
      

      if(WebMidi.inputs.length === 0) return;
      mMidiKeyboard = WebMidi.inputs[0];

      let tremolo = new Tone.Tremolo().toMaster().start();
      // mSynth.voices[0].oscillator.connect(tremolo);

      let vibrato = new Tone.Vibrato(8,0).toMaster();
      // mSynth.voices[0].oscillator.connect(vibrato);

      // mSynth1.volume.value = -25;
      // vibrato.wet.value = 0.5;

      // mSynth2.volume.value = -40;

      mSynth2.detune.value = 20;

      mMidiKeyboard.addListener('noteon','all',function(e){
        // console.log("Recibi noteon. Evento: "+JSON.stringify(e,null,null));
        
        let note = getNoteFromMIDIMessage(e);
        let velocity = getVelocityFromMIDIMessage(e);

        playNoteOnSynths(note,velocity);

        
        // vibrato.start();
      })

      mMidiKeyboard.addListener('noteoff','all',function(e){
        console.log("Recibi noteoff. Evento: "+JSON.stringify(e,null,null));
        let note = getNoteFromMIDIMessage(e);
        stopNoteOnSynths(note);

        // mSynth1.triggerRelease(e.note.name+e.note.octave);
        // mSynth2.triggerRelease(e.note.name+e.note.octave);
        // vibrato.stop();
      })


      mMidiKeyboard.addListener('controlchange','all',function(e){
        
        switch(e.controller.name){
          case "modulationwheelcoarse":

          let depth = map(e.value,0,127,0,1);
          // let frequency = map(e.value,0,127,1,15);

          vibrato.depth.value = depth;
          // tremolo.frequency.value = frequency;

          break;
        }
        
        console.log("Control change: "+JSON.stringify(e,null,null));
      });

    });

    


    // createCanvas(windowWidth, windowHeight);


    let filteroptions = {"filter": {
        "type": "lowpass",
        "frequency": 0,
        "rolloff": -24,
        "Q": 6,
        "gain": 0
      }
    };

    let oscoptions = {
      "oscillator":{
        "type":"sine"
      }
    }

    // let lfo = new Tone.LFO();
    // lfo.connect(mSynth.oscillator.volume);
    // mSynth.oscillator.type.value = "sine";
    // var lfo = new Tone.LFO(5,-50,50).start();
    // lfo.connect(mSynth.oscillator.volume);

    let env = {"envelope":{
      "attack":0.1,
      "sustain":.6
    }}

    let portamento = {"portamento":1,"volume":1};
    
    let envoptions = {"filterEnvelope": {
        
      }
    };

  

    // console.log("Fitler: "+JSON.stringify(mSynth1.get(),null,null));
    // mSynth.set({"filter":{
    //     "type":"highpass"
    // }});
    // mSynth.set(filteroptions);
    mSynth1.set(oscoptions)
    // mSynth.set(envoptions);
    // mSynth.set(portamento);
    // mSynth.set(env);
    // console.log("Fitler: "+JSON.stringify(mSynth1.get(),null,null));

        

}



function keyPressed(){

  console.log("KeyPressed: "+keyCode);
  if(keyCode === 65)
    // mSynth.triggerAttackRelease("c3","8n");
    mSynth1.triggerAttackRelease("c3","4n")

  if(keyCode === 83){
    mSynth1.triggerAttackRelease("c4","8n");
  }
}

function assignClickListenersToSynthParamButtons(){

  let buttons = $(".synth-param-pair-container").find("button");
  buttons.each(function(){
    this.addEventListener("click",function(){
        
        let key = this.id.split("-")[0];
        let innerKey = this.id.split("-")[1];

        mRandomizationMap[key][innerKey].r = !mRandomizationMap[key][innerKey].r;
        let shouldRandomize = mRandomizationMap[key][innerKey].r;

        if(shouldRandomize){
          let masterKeys = Object.keys(mRandomizationMap);
          let index = masterKeys.indexOf(key);
          let color = mColors[mInitialColor+index];
          $(this).css("background-color",color);
        }else{
          $(this).css("background-color",mDefaultColor);
        }
    })
  });

}

function assignSynthParameters(){

  randomize();
  mInitialColor = getRandomInt(0,mColors.length-Object.keys(mRandomizationMap).length);
  let synth1Options = getRandomizedSynthesizerOptions(1);
  let synth2Options = getRandomizedSynthesizerOptions(2);

  mSynth1.set(synth1Options);
  mSynth2.set(synth2Options);

  updateUIWithNewParameters();


  // console.log("Synth1: ",JSON.stringify(synth1Options,null,null));
  // console.log("Synth1: ",JSON.stringify(mSynth1.get(),null,null));
  
  // console.log("Synth2: ",JSON.stringify(synth2Options,null,null));
  // console.log("Synth2: ",JSON.stringify(mSynth2.get(),null,null));

}


function updateUIWithNewParameters(){

  let masterKeys = Object.keys(mRandomizationMap);
  masterKeys.forEach(key =>{

      let innerKeys = Object.keys(mRandomizationMap[key]);
      innerKeys.forEach(innerKey =>{
          let item = mRandomizationMap[key][innerKey];
          let parsedId = "#"+key + "-"+innerKey;
          let units = (item.units !==undefined)?item.units:"";
          let value = item.value+ " "+units;
         
          $(parsedId).html(value);
          let shouldRandomize = item.r;
          if(shouldRandomize){
            let masterKeys = Object.keys(mRandomizationMap);
            let index = masterKeys.indexOf(key);
            let color = mColors[mInitialColor+index];
            $(parsedId).css("background-color",color);
          }else{
            $(parsedId).css("background-color",mDefaultColor);
          }
      });
  });
}


/**
 * 
 * 
 * {
  "frequency": 440,
  "detune": 0,
  "oscillator": {
    "frequency": 440,
    "detune": 0,
    "type": "square",
    "phase": 0,
    "volume": 0,
    "mute": false
  },
  "filter": {
    "type": "lowpass",
    "frequency": 350,
    "rolloff": -24,
    "Q": 6,
    "gain": 0
  },
  "envelope": {
    "attack": 0.005,
    "decay": 0.1,
    "sustain": 0.9,
    "release": 1,
    "attackCurve": "linear",
    "releaseCurve": "exponential"
  },
  "filterEnvelope": {
    "baseFrequency": 200,
    "octaves": 7,
    "exponent": 2,
    "attack": 0.06,
    "decay": 0.2,
    "sustain": 0.5,
    "release": 2,
    "attackCurve": "linear",
    "releaseCurve": "exponential"
  },
  "portamento": 0,
  "volume": 0
}
 */




// /**
//  * 
//  * IDEALLY, THIS CODE WOULD USE OBJECTS FOR DIFFERENT RANDOMIZATIONS AND ELEMENTS. 
//  * ANYBODY WANNA HELP?
//  * 
//  */


// //  Awesome inspiration from this app: https://dotpiano.com/
// let mColors = ["#4356B5","#7962BA","#9841A3","#C0326B","#E4533C","#F29246","#F5BD46","#CEBE3D","#8EBA3B","#4FB155","#4BB4A1","#4998B4"];




// let mBoxItemsMap = {};
// let mBoxSettingsMap = {
//     "oscillator-box":[],
//     "filter-box":[],
//     "amplitude-envelope-box":[],
//     "filter-envelope-box":[]
// }

// let mSynthSettingsMap = {};

// let mPolySynth = new Tone.PolySynth(10,Tone.MonoSynth);


// let mKeyboardKeys = ['z','s','x','d','c','v','g','b','h','n','j','m','q','2','w','3','e','r','5','t','6','y','7','u','i','9','o','0','p'];
// let mKeyboardNotes = ['C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5'];

// let mKeyboardDisplayer;


// function setup(){

//     mBoxItemsMap = {
//         "oscillator-box":["type"],
//         "filter-box":["type","frequency","rolloff","Q","gain"],
//         "amplitude-envelope-box":["attack","decay","sustain","release","attack curve","release curve"],
//         "filter-envelope-box":["base frequency","octaves","exponent","attack","decay","sustain","release","attack curve","release curve"]
//     }


//     $("#randomize-button").click(randomize);

//     $("#oscillator-box").mouseenter(mouseEnterHandler);
//     $("#oscillator-box").mouseleave(mouseLeaveHandler);

//     $("#filter-box").mouseenter(mouseEnterHandler);
//     $("#filter-box").mouseleave(mouseLeaveHandler);

//     $("#amplitude-envelope-box").mouseenter(mouseEnterHandler);
//     $("#amplitude-envelope-box").mouseleave(mouseLeaveHandler);

//     $("#filter-envelope-box").mouseenter(mouseEnterHandler);
//     $("#filter-envelope-box").mouseleave(mouseLeaveHandler);
    
//     mPolySynth.toMaster();
//     randomize();

//     createCanvas(windowWidth, windowHeight);

//     mKeyboardDisplayer = new KeyboardDisplayer();
        

    

// }


// function draw(){

//     clear();
//     mKeyboardDisplayer.updateNotes();
//     mKeyboardDisplayer.displayNotes();

// }

// function keyPressed(){

//     let index = mKeyboardKeys.indexOf(key.toLowerCase());

//     if(index ==-1)return;

//     let note = mKeyboardNotes[index];
//     console.log("NOte: "+note);
//     mPolySynth.triggerAttack(note);
    
//     console.log("NOte: "+note);
//     let isBlackNote = (note.includes("#"));
//     let y = (isBlackNote)? windowHeight-80:windowHeight-40;


//     mKeyboardDisplayer.activateNote(index);

// }


// function keyReleased(){

//     let index = mKeyboardKeys.indexOf(key.toLowerCase());
//     if(index ==-1)return;

//     let note = mKeyboardNotes[index];

//     mPolySynth.triggerRelease(note);

//     mKeyboardDisplayer.deactivateNote(index);
    
// }


// function randomize(){


//     mSynthSettingsMap.oscillator = randomizeOscillatorSettings();
//     mSynthSettingsMap.filter = randomizeFilterSettings();
//     mSynthSettingsMap.envelope = randomizeAmplitudeEnvelopeSettings();
//     mSynthSettingsMap.filterEnvelope = randomizeFrequencyEnvelopeSettings();
    

//     // console.log("Final Synth Settings:: "+JSON.stringify(mSynthSettingsMap,null,null));
//     mPolySynth.set(mSynthSettingsMap);

//     populateBoxesWithValues();

//     setContainerBoxesColor();



// }


// function setContainerBoxesColor(){

//     let initialColorIndex = getRandomInt(0,8);
//     let boxesIds = ["#oscillator-box","#filter-box","#amplitude-envelope-box","#filter-envelope-box"];
//     for(let i = initialColorIndex; i<initialColorIndex+4;i++){
        
//         $(boxesIds[i-initialColorIndex]).css("background",mColors[i]);
//     }
    

// }

// function populateBoxesWithProperties(){
//     populateBox("oscillator-box",getPropertyArrayFromObject(mSynthSettingsMap.oscillator));
//     populateBox("filter-box",getPropertyArrayFromObject(mSynthSettingsMap.filter));
//     populateBox("amplitude-envelope-box", getPropertyArrayFromObject(mSynthSettingsMap.envelope));
//     populateBox("filter-envelope-box",getPropertyArrayFromObject(mSynthSettingsMap.filterEnvelope));
// }

// function populateBoxesWithValues(){
//     populateBox("oscillator-box",getValueArrayFromObject(mSynthSettingsMap.oscillator));
//     populateBox("filter-box",getValueArrayFromObject(mSynthSettingsMap.filter));
//     populateBox("amplitude-envelope-box", getValueArrayFromObject(mSynthSettingsMap.envelope));
//     populateBox("filter-envelope-box",getValueArrayFromObject(mSynthSettingsMap.filterEnvelope));
// }



// function mouseEnterHandler(event){
    
//     let id = $(this).attr("id");
//     populateBoxesWithProperties();


// }

// function mouseLeaveHandler(event){
    
//     let id = $(this).attr("id");
//     populateBoxesWithValues();
// }



// function populateBox(boxId, dataArray){

//     $("#"+boxId).find("li").each(function(index) {
//         $(this).text(dataArray[index]);
//       });
// }




// function randomizeOscillatorSettings(){

    
//     let possibleTypes = ["sine","square","triangle","sawtooth"];
//     let type = getRandomItemFromArray(possibleTypes);
//     let settings = {
//         "type":type
//     }

//     return settings;
// }


// function randomizeFilterSettings(){

//     let possibleTypes = ["lowpass","notch","peaking"];
//     // let possibleTypes = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass","peaking"];
//     let type = getRandomItemFromArray(possibleTypes);
//     let frequency = getRandomInt(80,800);
//     let rolloff = getRandomItemFromArray([-12, -24, -48, -96]);
//     // let gain = 0;
//     let gain = getRandomInt(0,3);
//     let q = getRandomInt(0,6);


//     let settings = {
//         "type":type,
//         "frequency":frequency,
//         "rolloff":rolloff,
//         "Q":q,
//         "gain":gain
//     };

//     return settings;
    
// }


// function randomizeAmplitudeEnvelopeSettings(){

//     let attack = getRandomNormalizedFloat();
//     let decay = getRandomNormalizedFloat();
//     let sustain = getRandomNormalizedFloat();
//     let release = getRandomNormalizedFloat();
//     let attackCurve = getRandomItemFromArray(["linear","exponential","sine","cosine","bounce","ripple","step"]);
//     let releaseCurve = getRandomItemFromArray(["linear","exponential","sine","cosine","bounce","ripple","step"]);

//     let settings = {
//         "attack":attack,
//         "decay":decay,
//         "sustain":sustain,
//         "release":release,
//         "attackCurve":attackCurve,
//         "releaseCurve":releaseCurve
//     }


//     return settings;

// }



// function randomizeFrequencyEnvelopeSettings(){

//     let baseFrequency = getRandomInt(100,800);
//     let octaves = getRandomInt(0,8);
//     let exponent = getRandomInt(0,3);
//     let attack = getRandomNormalizedFloat();
//     let decay = getRandomNormalizedFloat();
//     let sustain = getRandomNormalizedFloat();
//     let release = getRandomNormalizedFloat();
//     let attackCurve = getRandomItemFromArray(["linear","exponential","sine","cosine","bounce","ripple","step"]);
//     let releaseCurve = getRandomItemFromArray(["linear","exponential","sine","cosine","bounce","ripple","step"]);


//     let settings = {
//         "baseFrequency":baseFrequency,
//         "octaves":octaves,
//         "exponent":exponent,
//         "attack":attack,
//         "decay":decay,
//         "sustain":sustain,
//         "release":release,
//         "attackCurve":attackCurve,
//         "releaseCurve":releaseCurve
//     }

//     return settings;

// }


// function getRandomItemFromArray(array){
//     let i = Math.floor(Math.random()*array.length);
//     return array[i];
// }

// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min)) + min; 
// }

// function getRandomNormalizedFloat() {
//     return parseFloat(Math.random().toFixed(3));
// }


// function getValueArrayFromObject(object){

//     let values = [];
    
//     for(let prop in object){
//         values.push(object[prop]);
//     }

//     return values;

// }

// function getPropertyArrayFromObject(object){

//     let properties = [];
//     for(let prop in object){
//         properties.push(prop);
//     }

//     return properties;


// }





// class KeyboardDisplayer {


//     constructor(){
//         this.notes = [];
//         mKeyboardNotes.forEach((keyboardNote)=>{
//             this.notes.push(new Note(keyboardNote));
//         });

//     }

    
//     updateNotes(){

//         this.notes.forEach((note)=>{
//             note.update();
//         });
//     }

//     displayNotes(){
//         this.notes.forEach((note)=>{
//             note.display();
//         });
//     }

//     activateNote(noteIndex){

//         this.notes[noteIndex].activate();
        
//     }

//     deactivateNote(noteIndex){
        
//         console.log("DEACTIVATE NOTE "+noteIndex);
//         this.notes[noteIndex].deactivate();

//     }


// }


// class Note {

//     constructor(note){

//         let noteIndex = mKeyboardNotes.indexOf(note);
//         this.isSharpNote = (note.includes("#"));
//         this.y = this.isSharpNote ? windowHeight -80:windowHeight-40;
//         this.x = map(noteIndex,0,mKeyboardKeys.length, 20,windowWidth-20);
//         this.color = (note.includes("C") && !note.includes("#") )? "#E53F56":"white";
//         // this.color = "white";
//         this.r = 20;
//         this.shouldBeVisible = false;
//         this.lifespan = 255;
//         this.noteValue = note;

//         console.log("New Note "+note);

//     }

//     update(){

//         console.log("Note update");
//         if(!this.shouldBeVisible){
//             this.lifespan --;
//         }

//     }

//     display(){

//         console.log("Note display");
//         // fill("rgba(255,255,255,"+this.lifespan+")");
//         if(!this.shouldBeVisible)return;

//         fill(this.color);
//         ellipse(this.x, this.y, 20);
//     }

//     activate(){
//         console.log("Note activate");
//         this.shouldBeVisible = true;
//     }

//     deactivate(){
//         console.log("Note deactivate");
//         this.shouldBeVisible = false;
//     }




// }


