'use strict'

let noteCount, noteArray;

function newNote(id, title="New note", text="", left, top, creationDate, modificationDate){
    const noteTemplate = document.querySelector('#template');
    const noteClone = noteTemplate.content.cloneNode(true);
    const noteDiv = noteClone.querySelector(".note");
    noteDiv.id = id ? id : `note${noteCount}`;
    noteDiv.addEventListener('mousedown', startDrag);
    noteClone.querySelector(".note_input_body").value = text;
    noteClone.querySelector(".note_input_body").addEventListener('keydown', tabHandler);
    noteClone.querySelector(".note_input_title").value = title;
    noteDiv.style.left = left ? left : 0;
    noteDiv.style.top = top ? top : 42;
    noteDiv.querySelector('input[name="creation_date"]').value = creationDate ? creationDate : new Date().toLocaleDateString();
    noteDiv.querySelector('input[name="modification_date"]').value = modificationDate ? modificationDate : new Date().toLocaleDateString();
    if (id === undefined){
        noteCount += 1;
    }
    let notes = document.querySelector(".notes");
    notes.appendChild(noteClone);
}


function startDrag(e) {
    // To only work with header
    if (e.target.classList.contains("note_header")){
        let diffX = e.clientX - e.currentTarget.offsetLeft;
        let diffY = e.clientY - e.currentTarget.offsetTop;
        
        // to not select any document target
        function moveAlong(e) {
            if (e.target.classList.contains("note_header")){
                console.log(e.target.parentElement);
                e.target.parentElement.style.left = (e.clientX - diffX) + 'px';
                e.target.parentElement.style.top = (e.clientY - diffY) + 'px';
            }
        }
        
        function stopDrag() {
            document.removeEventListener('mousemove', moveAlong);
            document.removeEventListener('mouseup', stopDrag);
        }
        
        document.addEventListener('mousemove', moveAlong);
        document.addEventListener('mouseup', stopDrag);
    }
}

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

function noteDestroyer(e){
    e.currentTarget.parentElement.parentElement.remove();
}

function modificationHandler(e){
    e.currentTarget.parentElement.querySelector('input[name="modification_date"]').value = new Date().toLocaleDateString();
}

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem('noteArray')) {
        noteCount = parseInt(localStorage.getItem('noteCount'));
        noteArray = JSON.parse(localStorage.getItem('noteArray'));

        for (let note of noteArray){
            newNote(note.id,note.title,note.text,note.left,note.top,note.creationDate,note.modificationDate);
        }
    }
    else{
        noteArray = [];
        noteCount = 0;
    }

});

window.addEventListener("beforeunload", function () {
    let newNoteArray = [];
    for(let note of document.querySelectorAll(".note")){
        newNoteArray.push({
            id: note.id,
            title: note.querySelector(".note_input_title").value,
            text: note.querySelector(".note_input_body").value,
            left: note.style.left,
            top: note.style.top,
            creationDate: note.querySelector('input[name="creation_date"]').value,
            modificationDate: note.querySelector('input[name="modification_date"]').value,
        });
    }
    localStorage.setItem('noteArray', JSON.stringify(newNoteArray));
    localStorage.setItem('noteCount', noteCount);
});