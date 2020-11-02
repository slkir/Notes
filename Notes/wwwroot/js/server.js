// CRUD операции для работы с сервером.
// После выполнения операций происходит добавление необходимой разметки на странице.

const url = 'https://localhost:44346/api/notes/';

export function loadNotes() {
    $.ajax({
        url
    }).done(function (data) {
        data.forEach((note) => {
            createNoteMarkup(note)
        })

        $(`.todo_list li`).fadeOut(0);
        $(`.todo_list li`).fadeIn(350);
    });
}

export function createNote(note) {
    // Id генерируется на сервере.
    delete note.id;

    // Создаем заметку на сервере.
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        url: url,
        data: JSON.stringify(note),
        dataType: 'json',
        success: function (data, status, xhr) {

            // Генерирует html разметку для созданной на сервере заметки.
            let createdNoteUrl = xhr.getResponseHeader('Location');

            $.ajax({
                url: createdNoteUrl,
                success: function (data) {
                    note.id = data.id;

                    createNoteMarkup(note);

                    $('#task').val('');
                    $(`li#${note.id}`).fadeOut(0);
                    $(`li#${note.id}`).fadeIn(350);
                }
            });
        }
    });
}

export function deleteNote(id) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "DELETE",
        url: url + id,
        success: function () {
            $(`li#${id}`).fadeOut(350, function () {
                this.remove();
            })

            console.log('Deleted successfuly');
        }
    });
}

export function updateNote(id, note) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: url + id,
        method: 'put',
        data: JSON.stringify(note),
        dataType: 'json'
    })
}


function createNoteMarkup(note) {
    $('.todo_list').append(
        `
        <li id='${note.id}' class="task_item">
            <i class="${note.isImportant ? 'fas' : 'far'} fa-star"></i>
            <input id='text' class="task_item__checkbox" type="checkbox" ${note.isCompleted ? 'checked' : 'unchecked'}>${note.text}<i id='btn_del' class="far fa-times-circle"></i>
        </li>
        `
    );
}

