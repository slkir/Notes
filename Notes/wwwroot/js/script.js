import { loadNotes } from './note.js'
import { createNote } from './note.js'
import { deleteNote } from './note.js'
import { updateNote } from './note.js'

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

    // Установить важность заметки.
    $(document).on('click', '.fa-star', function (e) {
        toggleStar(this);
        update(this);
    }) 

    // Нажатие на checkbox (Задача выполнена)
    $(document).on('click', '.task_item__checkbox', function (e) {
        update(this);
    }) 
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

function update(context) {
    let parent = $(context).parent();
    let id = parent.attr('id');

    let note = new CreateNote(
        id,
        parent.find('.note_text').text(),
        parent.find('.fa-star').hasClass('fas'),
        parent.find('.task_item__checkbox').is(':checked'));

    delete note.id;

    updateNote(id, note);
}

function registerKeys(arg, addKeyName, resetKeyName) {
    if (arg.key == addKeyName) {
        add();
    }
    else if (arg.key == resetKeyName) {
        $('#task').val('');
    }
}

function toggleStar(context) {
    if ($(context).hasClass('fas')) {
        $(context).removeClass('fas').addClass('far');
    }
    else {
        $(context).removeClass('far').addClass('fas');
    }
}
