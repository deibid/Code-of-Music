

const BLACK_KEYS_PATTERN = [1,1,0,1,1,1,0];
const WHITE_KEYS_PATTERN = [1,1,1,1,1,1,1];
const NUMBER_OF_KEYS = 61;
const OCTAVES = 5;
const INITIAL_OCTAVE = 2;
const NOTE_PREFIXES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];



let mMidiNoteMap = {};


function initializeMidiNoteMap(){





}




function createUIKeyboard(){

    setBlackKeys();
    setWhiteKeys();

    setClickListeners();


    



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