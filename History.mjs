import { clearAllNotes, displayNotes } from "./Display.mjs";
import { addNote, filterNotes, modifyNote, swapNotes, deleteNote} from "./Notes.mjs";

let record = [];
let max_records = 20;

export function register(func, data){
    console.log(func,data);
    if (record.length === max_records){
        record.shift();
    }
    record.push([func,data]);
}

export function undo(){
    if (record.length > 0){
        let lastRecord = record.pop()
        console.log(lastRecord);
        let func = lastRecord[0];
        if (func === "creation"){
            let id = lastRecord[1];
            window.notes.execute(new deleteNote(id));
            document.getElementById(`note${id}`).remove();
        }
        if (func === "destroy"){
            let note = lastRecord[1];
            window.notes.execute(new addNote(note.title,note.text,note.creationDate,note.modificationDate));
            clearAllNotes();
            displayNotes(window.notes.execute(new filterNotes("")));
        }
        if (func === "modification"){
            let note = lastRecord[1];
            window.notes.execute(new modifyNote(note.id, note.title, note.text));
            let noteElem = document.getElementById(`note${note.id}`);
            noteElem.querySelector(".note_input_title").value = note.title;
            noteElem.querySelector(".note_input_body").value = note.text;
        }
        if (func === "ordering"){
            let id1 = lastRecord[1].note1;
            let id2 = lastRecord[1].note2;
            let note1 = window.notes.notes[id1];
            let note2 = window.notes.notes[id2];
            console.log(note1,document.getElementById(`note${note1.id}`));
            console.log(note2,document.getElementById(`note${note2.id}`));
            
            let note1Elem = document.getElementById(`note${id1}`);
            note1Elem.querySelector(".note_input_title").value = note2.title;
            note1Elem.querySelector(".note_input_body").value = note2.text;
            note1Elem.querySelector("input[name='creation_date']").value = note2.creationDate;
            note1Elem.querySelector("input[name='modification_date']").value = note2.modificationDate;

            let note2Elem = document.getElementById(`note${id2}`);
            note2Elem.querySelector(".note_input_title").value = note1.title;
            note2Elem.querySelector(".note_input_body").value = note1.text;
            note2Elem.querySelector("input[name='creation_date']").value = note1.creationDate;
            note2Elem.querySelector("input[name='modification_date']").value = note1.modificationDate;
            
            window.notes.execute(new swapNotes(note1.id,note2.id));
        }
    }
    else{
        console.log("history record empty");
    }
}