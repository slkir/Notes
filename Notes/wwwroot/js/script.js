import { loadNotes } from './server.js'
import { createNote } from './server.js'
import { deleteNote } from './server.js'
import { updateNote } from './server.js'

let url = 'https://localhost:44346/api/notes/';

function CreateNote(id, text, isImportant, isCompleted) {
    this.id = id;
    this.text = text;
    this.isImportant = isImportant;
    this.isCompleted = isCompleted;
}

loadNotes();


$(document).ready(function () {

    $(document).on('click', '#btn_add', function () {
        add();
    })

    $(document).on('click', '#btn_del', function () {
        del(this);
    }) 

    // Зарегистрировать клавиши для быстрого добавления заметки и отмены ввода.
    $('#task').on('keydown', function (arg) {
        registerKeys(arg, 'Enter', 'Escape');
    });

    // Нажатие на звездчоку (важная заметка).
    $(document).on('click', '.fa-star', function (e) {
        let parent = $(this).parent();
        let id = $(this).parent().attr('id');
        let text = $(this).parent().find('#text').val();
        let isImportant = $(this).hasClass('fas');
        let isCompleted = $(this).find('#text').is(':checked');

        if (isImportant) {
            $(this).removeClass('fas').addClass('far');
        }
        else {
            $(this).removeClass('far').addClass('fas');
        }

        let note = new CreateNote(id, text, !isImportant, isCompleted);
        delete note.id;

        updateNote(id, note);
    }) 

    // Нажатие на checkbox (Задача выполнена)
    $(document).on('click', '.task_item__checkbox', function (e) {
        console.log('checkbox clicked');

        let noteId = $(this).parent().attr('id');
 
        noteToEdit.isCompleted = !noteToEdit.isCompleted;
        if (noteToEdit.isCompleted) {
            $(this).prop('checked', true);
        }
        else {
            $(this).prop('checked', false);
        }

        let copy = Object.assign({}, noteToEdit);
        delete copy.id;

        updateNote(noteId, copy);
    }) 


    // Нажатие на checkbox (Задача выполнена)
    //$(document).on('click', '.task_item__checkbox', function (e) {
    //    console.log('checkbox clicked');

    //    let noteId = $(this).parent().attr('id');

    //    let noteToEdit = notesList.find((x) => {
    //        return x.id == noteId;
    //    });

    //    noteToEdit.isCompleted = !noteToEdit.isCompleted;
    //    if (noteToEdit.isCompleted) {
    //        $(this).prop('checked', true);
    //    }
    //    else {
    //        $(this).prop('checked', false);
    //    }

    //    let copy = Object.assign({}, noteToEdit);
    //    delete copy.id;

    //    updateNote(noteId, copy);
    //}) 
})

function add() {    
    let noteText = $('#task').val();

    if (noteText == '') {
        return;
    }

    let note = new CreateNote(NaN, noteText, false, false);
    createNote(note)
}

function del(context) {
    let id = $(context).parent().attr('id');
    deleteNote(id);
}

function registerKeys(arg, addKeyName, resetKeyName) {
    if (arg.key == addKeyName) {
        add();
    }
    else if (arg.key == resetKeyName) {
        $('#task').val('');
    }
}
