import { Notes, addNote, filterNotes, loadNotes, saveNotes } from "./Notes.mjs"
import observer from "./Observable.mjs";
import { displayNotes, clearAllNotes } from "./Display.mjs"
import { register, undo } from "./History.mjs";

function newNote(){
    let now = new Date().toLocaleDateString();
    let newID = window.notes.execute(new addNote("New note","",now,now));
    observer.notify("creation",newID);
    clearAllNotes();
    displayNotes(window.notes.execute(new filterNotes("")));
}

function searchHandler(){
    let searchStr = document.getElementById("searchBox").value;
    clearAllNotes();
    displayNotes(window.notes.execute(new filterNotes(searchStr)));
}

function KeyPressCtrlZ(e) {
    var evtobj = window.event? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey){
        undo();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    window.notes = new Notes();
    window.observer = observer;
    window.observer.subscribe(register);
    window.notes.execute(new loadNotes());
    // Assignation of functions
    displayNotes(window.notes.execute(new filterNotes("")));
    document.getElementById('newNoteButton').addEventListener('click', newNote);
    document.getElementById("searchBox").addEventListener("change",searchHandler);
    document.onkeydown = KeyPressCtrlZ;
});

window.addEventListener("beforeunload", () => {
    window.notes.execute(new saveNotes());
});