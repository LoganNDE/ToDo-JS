const body = $("body")
let idTask = 0;
let listID = [];


class Tarea{
    constructor(id, name, date, time, status, description){
        this.id = id;
        this.name = name;
        this.date = date
        this.time = time;
        this.status = status;
        this.description = description;
    }
}


body.ready( () => {


    const containerTasks = $(".containerTasks");
    const containerNewTask = $(".containerNewTask");
    const tasksContainer = $(".tasks");
    const addTask = $(".addTask");
    const iconAddTask = $(".iconAddTask");
    const iconHome = $(".iconHome");
    const btnAdd = $(".btnAdd");
    const btnEdit = $(".btnEdit");
    const btnCancel = $(".btnCancel")
    const nameTask = $("#nameTask");
    const timeTask = $("#timeTask");
    const dateTask = $("#dateTask");
    const statusTask = $("#statusTask");
    const descriptionTask = $("#descriptionTask");

    let tasks = [];

    let addingTask = false;
    let editingTask = false;
    let tableCreate = false;
    let messageCreate = false;
    let taskModified = false;


    loadTask = () =>{
        if (tasks.length > 0){
            $(".noTask").remove();

            if (!tableCreate){
                const table = $("<table>")
                .addClass("tableTask")
                
                const titles = ["Nombre", "Fecha", "Tiempo", "Estado", "Descripción", "Acciones"];
                let thead = $("<thead>");
        
                titles.forEach(t => {
                    let title = $("<td>").text(t)
                    thead.append(title);
                });
        
                table.append(thead)
                tasksContainer.append(table);
                tableCreate = true;
            }

            tasks.forEach(task => {
                if (!listID.includes(task.id) || taskModified){
                    taskModified = false;
                    listID.push(task.id);

                    let table = $(".tableTask")

                    let trow = $("<tr>");
                    trow.addClass("row");
                    trow.attr('id', task.id)
                    
                    table.append(trow);
        
                    let title = $("<td>").text(task.name)
                    trow.append(title);
        
                    let date = $("<td>").text(task.date)
                    trow.append(date);
                    
                    let time = $("<td>").text(task.time)
                    trow.append(time);
        
                    let status = $("<td>").text(task.status)
                    trow.append(status);
                    
                    let descriptionText = task.description;
                    let description = $("<td>");

                    if (descriptionText.length > 30){
                        let descriptionV1;
                        descriptionV1 = descriptionText.slice(0, 30) + "...";
                        description.text(descriptionV1);
                    }else{
                        description.text(descriptionText);
                    }
                    trow.append(description);

                    let options = $("<td>")
                    let optionDelete = $('<i class="fa-solid fa-trash"></i>').attr('id', "btnRemove");
                    let optionEdit = $('<i class="fa-solid fa-pen"></i>').attr('id', "btnEdit");
                    let optionView = $('<i class="fa-solid fa-eye"></i>').attr('id', "btnView");

                    options.addClass("options")
                    options.append(optionDelete);
                    options.append(optionEdit);
                    options.append(optionView);
                    trow.append(options);

                    
                    optionDelete.click(() => deleteTask(event));
                    optionEdit.click(() => editTask(event));
                }
            })
        }else{
            messageHome();
        }

    }

    addTask.click(() =>{
        if (!addingTask){
            inNewTask();
        }else{
            inHome();
        }
    })

    btnAdd.click(() =>{
        console.log(checkFileds());
        if (!checkFileds()){
            Swal.fire({
                title: '¡Error! Debes rellenar todos los campos',
                icon: 'error', 
                confirmButtonText: 'Reintentar'
              })
        }else{
            Swal.fire({
                icon: "success",
                title: "La tarea se ha agregado correctamente",
                confirmButtonText: "Agregar nueva tarea",
                showDenyButton: true,
                denyButtonText: `Volver al inicio`
              }).then((result) =>{
                console.log(result);
                if (result.isDenied){
                    inHome();
                }
                if (result.isConfirmed){
                    clearFields();
                }
              });

              idTask++;
              let task = new Tarea(idTask, nameTask.val(), dateTask.val(), timeTask.val(), statusTask.val(), descriptionTask.val())
              tasks.push(task);
              console.log(tasks);
        }
    })





    btnCancel.click(() => {
        inHome();
    })


    const checkFileds = () => {
        if (!nameTask.val() || !timeTask.val() || !dateTask.val() || !descriptionTask.val()){
            return false
        }

        return true;
    }

    const inHome = () => {
        loadTask();
        addingTask = false;
        editingTask = false;
        containerTasks.show();
        containerNewTask.hide();
        iconAddTask.show();
        iconHome.hide();
    }

    const inNewTask = () => {
        addingTask = true
        clearFields();
        checkAction();
        var today = new Date();
        dateTask.val(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate());
        console.log(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate());
        containerTasks.hide();
        containerNewTask.show();
        iconAddTask.hide();
        iconHome.show();
    }

    const inEditTask = (id) => {
        addingTask = true
        containerTasks.hide();
        containerNewTask.show();
        iconAddTask.hide();
        iconHome.show();
    }

    const checkAction = () =>{
        if(editingTask && !addingTask){
            btnAdd.hide();
            btnEdit.show();
        }else{
            btnAdd.show();
            btnEdit.hide();
        }
    } 

    const messageHome = () =>{
        if (!messageCreate){
            let message = $("<h3>").text("No se ha agregado ninguna tarea 😢").addClass("noTask");
            tasksContainer.append(message);
            messageCreate = true;
        }
    }

    const clearFields = () =>{
        nameTask.val('');
        timeTask.val('');
        descriptionTask.val(''); 
    }


    const deleteTask = (event) =>{
        let taskId = $(event.target).closest('tr').attr('id');
        console.log(taskId)
        Swal.fire({
            title: "¿Estas seguro de eliminar esta tarea?",
            text: "Esta acción no se podrá revertir.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "¡Si, deseo eliminarla!"
        }).then((result) => {
            if (result.isConfirmed) {
            Swal.fire({
                title: "Tarea borrada con exito!",
                icon: "success"
            });
            $(`#${taskId}`).remove();
            }
        })
    }


    const editTask = (event) =>{
        editingTask = true;
        checkAction();
        let taskId = $(event.target).closest('tr').attr('id') - 1; //- 1 (Para coincidir con los index del array task)
        inEditTask(taskId);

        actTask = new Tarea();
        actTask = tasks[parseInt(taskId)];

        nameTask.val(actTask.name);
        dateTask.val(actTask.date);
        timeTask.val(actTask.time);
        statusTask.val(actTask.status);
        descriptionTask.val(actTask.description);
        
        btnEdit.click(() => aplyEditTask(taskId))
    }

    const aplyEditTask = (id) =>{
        if (editingTask){
            console.log(tasks[id])

            tasks[id].name = nameTask.val();
            tasks[id].date = dateTask.val();
            tasks[id].time = timeTask.val();
            tasks[id].status = statusTask.val();
            tasks[id].description = descriptionTask.val();
            taskModified = true;
            $(`#${id + 1}`).remove();
        }

        console.log(tasks);
    }

    messageHome();
})







