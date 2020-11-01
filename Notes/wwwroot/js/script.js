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

                    addNoteMarkup(note);
                    
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

    $(`li#${id}`).fadeOut(350, function(){
        noteList.splice(index, 1);
        this.remove();                
        console.log(noteList);
    })  

    $.ajax({
        type: "DELETE",
        url: api + id,
        success: function () { console.log('Deleted from server') },        
    });
}

// Обработчики событий.
$(document).ready(function () {

    // Нажатие на красный крестик (удаление заметки).
    $(document).on('click', '.btn_del', function (e) {
        if (confirm('Вы действительно хотите удалить эту заметку?')) {   
            let taskId = $(this).parent().attr('id');
            deleteTask(taskId);
        }
        else {
            console.log('Отмена удаления')
        }
    }) 

    // Нажатие на звездчоку (важная заметка).
    $(document).on('click', '.fa-star', function (e) {
        
        let noteId = $(this).parent().attr('id');

        let taskToEdit = noteList.find((x) => {
            return x.id == noteId;
        });
        
        taskToEdit.isImportant = !taskToEdit.isImportant;
        if (taskToEdit.isImportant){
            $(this).removeClass('far').addClass('fas');
        }
        else{
            $(this).removeClass('fas').addClass('far');
        }
    }) 
});

$('#task').on('keydown', function (arg) {
    if (arg.key == 'Enter') {
        addTask();
    }
    else if (arg.key == 'Escape') {
        $('#task').val('');
    }
});

function loadNotesFromServer(url) {
    loadedTaskList = [];
    $.ajax({
        url
    }).done(function (data) {
        noteList = data;
        loadTasks();
    });
}

function loadTasks() {
    noteList.forEach((note) => {
        addNoteMarkup(note)
    })

    $(`.todo_list li`).fadeOut(0);
    $(`.todo_list li`).fadeIn(350);
}

function addNoteMarkup(note) {
    $('.todo_list').append(
        `
        <li id='${note.id}' class="task_item">
            <i class="${note.isImportant ? 'fas' : 'far'} fa-star"></i>
            <input class="task_item__checkbox" type="checkbox" ${note.isCompleted ? 'checked' : 'unchecked'}>${note.text}<i class="far fa-times-circle btn_del"></i>
        </li>
        `
    );
}
