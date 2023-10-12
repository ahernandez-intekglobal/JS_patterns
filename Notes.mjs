class Command {
    constructor(execute) {
        this.execute = execute;
    }
}

export class Notes {
    constructor() {
        this.notes = {};
        this.lastID = {value: 0};
    }
    execute(command, ...args) {
        return command.execute(this.lastID, this.notes, ...args);
    }
}

class Note {
    constructor(id, title = "New note", text = "", creationDate, modificationDate) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.creationDate = creationDate;
        this.modificationDate = modificationDate;
    }
}

export function addNote(title, text, creationDate, modificationDate) {
    return new Command((lastID, notes) => {
        lastID.value += 1;
        let note = new Note(lastID.value, title, text, creationDate, modificationDate)
        note.id = lastID.value;
        notes[lastID.value] = note;
        return lastID.value;
    });
}

export function deleteNote(id){
    return new Command((lastID, notes) => {
        if (notes[id] === undefined){
            return;
        }
        let note = notes[id];
        delete notes[id];
        return note;
    });
}

export function modifyNote(id, title, text){
    return new Command((lastID, notes) => {
        if (notes[id] === undefined){
            throw new Error("Note does not exist");
        }
        notes[id].title = title;
        notes[id].text = text;
    });
}

export function swapNotes(id1,id2){
    return new Command((lastID, notes) => {
        if (notes[id1] === undefined || notes[id2] === undefined){
            console.log(id1,id2);
            throw new Error("Note does not exist");
        }
        let aux = notes[id1];
        notes[id1] = notes[id2];
        notes[id2] = aux;
        notes[id1].id = id2;
        notes[id2].id = id1;
    });
}

export function filterNotes(substring){
    return new Command((lastID, notes) =>{
        let result = [];
        for(let note of Object.values(notes)){
            if (note.title.includes(substring) || note.text.includes(substring)){
                result.push(note);
            }
        }
        return result;
    });
}

export function loadNotes(){
    return new Command((lastID, notes) => {
        let savedNotes = localStorage.getItem('notes');
        if (savedNotes === null) {
            console.log("There is no notes to load");
            return false;
        }
        savedNotes = JSON.parse(savedNotes);
        lastID.value = 0;

        for (let note of Object.values(savedNotes)){
            let newNote = new Note(lastID.value,note.title,note.text,note.creationDate,note.modificationDate);
            notes[lastID.value] = newNote;
            lastID.value += 1;
        }
        return true;
    });
}

export function saveNotes(){
    return new Command((lastID, notes) => {
        localStorage.setItem('notes', JSON.stringify(notes));
    });
}


