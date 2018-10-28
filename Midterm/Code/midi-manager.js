


function getNoteFromMIDIMessage(e){
    return e.note.name+e.note.octave;
}

function getVelocityFromMIDIMessage(e){
    return e.velocity;
}