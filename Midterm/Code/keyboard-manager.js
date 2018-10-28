

const BLACK_KEYS_PATTERN = [1,1,0,1,1,1,0];
const WHITE_KEYS_PATTERN = [1,1,1,1,1,1,1];
const NUMBER_OF_KEYS = 61;
const OCTAVES = 5;
const INITIAL_OCTAVE = 2;
const NOTE_PREFIXES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const NOTES_PER_OCTAVE = 12;
const COMPUTER_KEYBOARD_OCTAVE_OFFSET = 2;

let mNotes = [];
let mKeyboardNotes;
// const KEY_PRESS_MAP = ;


// let mMidiNoteMap = {};


function initializeMidiNoteMap(){





}



function createUIKeyboard(){

    setBlackKeys();
    setWhiteKeys();

    setClickListeners();

    populateNotesArray();
    populateKeyboardNotesArray();

}


function setBlackKeys(){

    let blackKeysRowContainer = $("#black-keys-row-container");
    let blackNotesPrefixes = NOTE_PREFIXES.filter(note => note.indexOf("#")!==-1);
    for(let i=0; i<OCTAVES; i++){
    
        let notePrefixIndex = 0;

        for(let j = 0; j<BLACK_KEYS_PATTERN.length; j++){
            let keyToAdd;
            if(BLACK_KEYS_PATTERN[j] === 1){
                
                let id = blackNotesPrefixes[notePrefixIndex] + (INITIAL_OCTAVE+i);
                keyToAdd = "<div class='black-key piano-key' "+"id="+id+"></div>";
                
                notePrefixIndex++;
                if(notePrefixIndex===blackNotesPrefixes.length) 
                    notePrefixIndex=0;
            }else{
                keyToAdd = "<div class='black-space-key'></div>";
            }
            blackKeysRowContainer.append(keyToAdd);
        }
    }

    blackKeysRowContainer.append("<div class='black-space-key piano-key'></div>");


}


function setWhiteKeys(){

    let whiteNotesPrefixes = NOTE_PREFIXES.filter(note=> note.indexOf("#") === -1);
    let whiteKeysRowContainer = $("#white-keys-row-container");
    let whiteKey;// = "<div class='white-key'></div>"

    for(let i=0; i<OCTAVES; i++){

        for(let j = 0; j<WHITE_KEYS_PATTERN.length; j++){
            
            let id = whiteNotesPrefixes[j] + (INITIAL_OCTAVE+i);
            whiteKey = "<div class='white-key piano-key'  "+"id="+id+"></div>"
            whiteKeysRowContainer.append(whiteKey);

        }
    }

    whiteKeysRowContainer.append("<div class='white-key piano-key' id=C7></div>");
}

function setClickListeners(){

    $(".piano-key").each(function(){
        $(this).on("mousedown",function(){
            
            let id = this.id;
            console.log("mousedown key. ID:> "+id);
            playNoteOnSynths(id,1);
        });

        $(this).on("mouseup", function(){
            let id = this.id;
            console.log("mousedown key. ID:> "+id);
            stopNoteOnSynths(id);
        })
    });

}

function populateNotesArray(){

    for(let i = 0; i<OCTAVES; i++){
        for(let j = 0; j<NOTES_PER_OCTAVE; j++){
            let note = NOTE_PREFIXES[j]+(i+INITIAL_OCTAVE);
            mNotes.push(note);
        }
    }
    mNotes.push("C7");
}


function populateKeyboardNotesArray(){

    mKeyboardNotes = [
        'z','s','x','d','c','v','g','b','h','n',
        'j','m','q','2','w','3','e','r','5','t',
        '6','y','7','u','i','9','o','0','p'];

    console.log("KEYOARD LENGHT:"+mKeyboardNotes.length);
}


function keyPressed(){
    console.log("KeyPressed: "+key);

    
    let index = mKeyboardNotes.indexOf(key);
    if(index === -1)return;

    let offset = COMPUTER_KEYBOARD_OCTAVE_OFFSET*NOTES_PER_OCTAVE;
    let note = mNotes[index + offset];

    console.log("note to play "+note);

    playNoteOnSynths(note,1);


}

function keyReleased(){

    console.log("KeyReleased: "+key);

    
    let index = mKeyboardNotes.indexOf(key);
    if(index === -1)return;

    let offset = COMPUTER_KEYBOARD_OCTAVE_OFFSET*NOTES_PER_OCTAVE;
    let note = mNotes[index + offset];

    console.log("note to stop "+note);

    stopNoteOnSynths(note);

}