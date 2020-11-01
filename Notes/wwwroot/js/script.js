let noteList = [];

function сreateTask(id, isChecked, text, isImportant) {
    return {
        id,
        isChecked,
        text,
        isImportant
    };
}

// Temp solution while server doesn't exist.
function createRandomId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 
function addTask() {

    console.log('addTask() function');

    if ($('#task').val() == '') {
        return;
    }

    // Add task to array.
    let task = сreateTask(createRandomId(5), false, `${$('#task').val()}`, false);
    noteList.push(task);

    // Add task to html.
    $('.todo_list').append(`
    <li id='${task.id}' class="task_item">
        <i class="far fa-star"></i>
        <input class="task_item__checkbox" type="checkbox" unchecked>${task.text}<i class="far fa-times-circle btn_del"></i>
    </li>
    `);

    $('#task').val('');

    $(`li#${task.id}`).fadeOut(0);
    $(`li#${task.id}`).fadeIn(350);

    console.log(noteList);
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


loadNotesFromServer('https://localhost:44346/api/notes');

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
        $('.todo_list').append(`
        <li id='${note.id}' class="task_item">
            <i class="${note.isImportant ? 'fas' : 'far'} fa-star"></i>
            <input class="task_item__checkbox" type="checkbox" ${note.isCompleted ? 'checked' : 'unchecked'}>${note.text}<i class="far fa-times-circle btn_del"></i>
        </li>
        `);
    })
}