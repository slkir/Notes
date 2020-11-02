let noteList = [];
let api = 'https://localhost:44346/api/notes/';

loadNotesFromServer(api);

function addTask() {    
    if ($('#task').val() == '') {
        return;
    }
   
    let note = {
        text: `${$('#task').val()}`,
        isCompleted: false,
        isImportant: false
    }

    // Add task to server.
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        type: "POST",
        url: api,
        data: JSON.stringify(note),
        dataType: 'json',
        success: function (data, status, xhr) {
            let createdNoteUrl = xhr.getResponseHeader('Location');

            $.ajax({
                url: createdNoteUrl,
                success: function (data) {
                    note.id = data.id;
                    noteList.push(note);

                    createNoteMarkup(note);
                    
                    $('#task').val('');
                    $(`li#${note.id}`).fadeOut(0);
                    $(`li#${note.id}`).fadeIn(350);

                    console.log(noteList);
                }
            });
        }
    });   
}

function deleteTask(id){
    let index = noteList.findIndex((x) =>{
        return x.id == id;
    });

    $.ajax({
        type: "DELETE",
        url: api + id,
        success: function () {
            $(`li#${id}`).fadeOut(350, function () {
                noteList.splice(index, 1);
                this.remove();
            })  

            console.log('Deleted successfuly');
        }
    });
}

function updateNote(noteId, updatedNote) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: api + noteId,
        method: 'put',
        data: JSON.stringify(updatedNote),
        dataType: 'json'
    })
}


// Обработчики событий.
$(document).ready(function () {

    // Нажатие на красный крестик (удаление заметки).
    $(document).on('click', '.btn_del', function (e) {
        let taskId = $(this).parent().attr('id');
        let taskToDelete = noteList.find((note) => {
            return note.id == taskId;
        });

        Swal.fire({
            title: 'Удалить заметку?',
            text: taskToDelete.text,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Отмена',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Удалить'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTask(taskId);
            }
        })
    }) 

    // Нажатие на звездчоку (важная заметка).
    $(document).on('click', '.fa-star', function (e) {
        
        let noteId = $(this).parent().attr('id');

        let noteToEdit = noteList.find((x) => {
            return x.id == noteId;
        });
        
        noteToEdit.isImportant = !noteToEdit.isImportant;
        if (noteToEdit.isImportant){
            $(this).removeClass('far').addClass('fas');
        }
        else{
            $(this).removeClass('fas').addClass('far');
        }

        let copy = Object.assign({}, noteToEdit);
        delete copy.id;
        updateNote(noteId, copy);
    }) 


    // Нажатие на checkbox (Задача выполнена)
    $(document).on('click', '.task_item__checkbox', function (e) {
        console.log('checkbox clicked');

        let noteId = $(this).parent().attr('id');

        let noteToEdit = noteList.find((x) => {
            return x.id == noteId;
        });

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

    // Enter - создать заметку. 
    // Escape - очистить поле ввода
    $('#task').on('keydown', function (arg) {
        if (arg.key == 'Enter') {
            addTask();
        }
        else if (arg.key == 'Escape') {
            $('#task').val('');
        }
    });
});


function loadNotesFromServer(url) {
    loadedTaskList = [];
    $.ajax({
        url
    }).done(function (data) {
        noteList = data;

        noteList.forEach((note) => {
            createNoteMarkup(note)
        })

        $(`.todo_list li`).fadeOut(0);
        $(`.todo_list li`).fadeIn(350);
    });
}


function createNoteMarkup(note) {
    $('.todo_list').append(
        `
        <li id='${note.id}' class="task_item">
            <i class="${note.isImportant ? 'fas' : 'far'} fa-star"></i>
            <input class="task_item__checkbox" type="checkbox" ${note.isCompleted ? 'checked' : 'unchecked'}>${note.text}<i class="far fa-times-circle btn_del"></i>
        </li>
        `
    );
}
