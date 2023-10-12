import { swapNotes, deleteNote, modifyNote } from "./Notes.mjs";


function tabHandler(e) {
    if (e.key == 'Tab') {
        e.preventDefault();
        let start = e.target.selectionStart;
        let end = e.target.selectionEnd;

        e.target.value = e.target.value.substring(0, start) +
            "\t" + e.target.value.substring(end);

        e.target.selectionStart =
            e.target.selectionEnd = start + 1;
    }
}

function displayNote(note) {
    const noteTemplate = document.querySelector('#template');
    const noteClone = noteTemplate.content.cloneNode(true);
    const noteDiv = noteClone.querySelector(".note");
    noteDiv.id = `note${note.id}`;
    noteDiv.addEventListener('dragstart', handleDragStart);
    noteDiv.addEventListener('dragover', handleDragOver);
    noteDiv.addEventListener('dragenter', handleDragEnter);
    noteDiv.addEventListener('dragleave', handleDragLeave);
    noteDiv.addEventListener('dragend', handleDragEnd);
    noteDiv.addEventListener('drop', handleDrop);
    noteDiv.querySelector('button[name="destroyer"]').addEventListener('click',handleDestroy)
    let body = noteClone.querySelector(".note_input_body")
    body.value = note.text;
    body.addEventListener('keydown', tabHandler);
    body.addEventListener('change', modificationHandler);
    noteClone.querySelector(".note_input_title").value = note.title;
    noteClone.querySelector(".note_input_title").addEventListener('change', modificationHandler);
    noteDiv.querySelector('input[name="creation_date"]').value = note.creationDate;
    noteDiv.querySelector('input[name="modification_date"]').value = note.modificationDate;
    let notes = document.querySelector(".notes");
    notes.appendChild(noteClone);
}

export function displayNotes(notes) {
    for (let note of notes) {
        displayNote(note);
    }
}

export function clearAllNotes() {
    let notes = document.querySelectorAll(".note")
    notes.forEach((note) => note.remove())
}

function modificationHandler(e){
    let note = this.parentElement;
    window.observer.notify("modification", window.notes.notes[Number(note.id.replace("note",""))]);
    window.notes.execute(new modifyNote(Number(note.id.replace("note","")),note.querySelector(".note_input_title").value, note.querySelector(".note_input_body").value));
}

function handleDestroy(){
    let noteElem = this.parentNode.parentNode;
    let note = window.notes.execute(new deleteNote(Number(noteElem.id.replace("note",""))));
    observer.notify("destroy",note);
    noteElem.remove();
}

let dragSrcEl,data;

function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    data = {
        title: this.querySelector(".note_input_title").value, 
        text: this.querySelector(".note_input_body").value, 
        creation: this.querySelector("input[name='creation_date']").value, 
        modification: this.querySelector("input[name='modification_date']").value
    }
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    e.stopPropagation();

    // if (dragSrcEl !== this) {
    //     dragSrcEl.innerHTML = this.innerHTML;
    //     this.innerHTML = e.dataTransfer.getData('text/html');
    // }
    if (dragSrcEl !== this){
        dragSrcEl.querySelector(".note_input_title").value = this.querySelector(".note_input_title").value;
        dragSrcEl.querySelector(".note_input_body").value =  this.querySelector(".note_input_body").value;
        dragSrcEl.querySelector("input[name='creation_date']").value = this.querySelector("input[name='creation_date']").value;
        dragSrcEl.querySelector("input[name='modification_date']").value = this.querySelector("input[name='modification_date']").value;

        this.querySelector(".note_input_title").value = data.title;
        this.querySelector(".note_input_body").value =  data.text;
        this.querySelector("input[name='creation_date']").value = data.creation;
        this.querySelector("input[name='modification_date']").value = data.modification;
    }

    window.observer.notify("ordering",{ note1:Number(dragSrcEl.id.replace("note","")), note2:Number(this.id.replace("note","")) });
    window.notes.execute(new swapNotes(Number(dragSrcEl.id.replace("note","")), Number(this.id.replace("note",""))));
    return false;
}