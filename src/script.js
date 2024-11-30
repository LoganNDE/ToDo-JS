    class Tarea{
        constructor(id, name, deadline, date, time, status, description){
            this.id = id;
            this.name = name;
            this.deadline = deadline
            this.date = date
            this.time = time;
            this.status = status;
            this.description = description;
        }
    }

    const body = $("body")
    let idTask = 0;
    let listID = [];
    let currentPage = 1;
    let taskPerPage = 5;
    let index = 0;

    let tableCreate = false;
    let addingTask = false;
    let editingTask = false;
    let taskModified = false;

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
    const pagination = $(".pagination");
    //let tasks = [{"id": 1,"name": "Practicar Js","date": "2024-11-21","time": "1h y 30min","status": "En Progreso","description": "jdksaldjksadsadsa"},{"id": 2,"name": "Practicar GO","date": "2024-11-21","time": "2h","status": "En Progreso","description": "En proceso de aprendizaje"},{"id": 3,"name": "Practicar PHP","date": "2024-11-21","time": "9h","status": "En Progreso","description": "Socorro, PHP"}];
    let tasks = [];

    const ShowMessageHome = () =>{
        $(".noTasks").show();
    }

    const deleteTable = () => {
        listID = [];
        tableCreate = false;
        $(".tableTask").remove();
    }

    const createTable = () => {
            const table = $("<table>")
            .addClass("tableTask")
            
            const titles = ["Nombre", "Fecha Limite" ,"Fecha Alta", "Tiempo", "Estado", "Descripción", "Acciones"];
            let thead = $("<thead>");
    
            titles.forEach(t => {
                let title = $("<td>").text(t)
                thead.append(title);
                if (t == "Fecha Limite"){
                title.append($("<span>").html('<i class="fa-solid fa-arrow-down-short-wide shortDateLower"></i>' + '<i class="fa-solid fa-arrow-up-wide-short shortDateUp"></i>'));
                
                // Elimina los eventos previos antes de añadir nuevos manejadores
                $("body").off("click", ".shortDateLower", shortDateLower);
                $("body").off("click", ".shortDateUp", shortDateUP);
                /*Delega el evento click al elemento body y lo aplicará a cualquier elemento con la clase shortDate, incluso si se crea dinámicamente.*/
                $("body").on("click", ".shortDateLower", shortDateLower);
                $("body").on("click", ".shortDateUp", shortDateUP);

                }
            });
    
            table.append(thead)
            tasksContainer.append(table);
            tableCreate = true;
        }
 
    loadTask = (currPage = 1) =>{
        if (tasks.length > 0){
            $(".noTasks").hide();
            
            if (!tableCreate) {
                createTable();
            }

            currentPage = currPage;
            let limit = taskPerPage * currentPage; // Define el máximo de iteraciones que deseas realizar
            index = limit - taskPerPage;

            for (index; index < tasks.length && index < limit; index++) {
                let task = tasks[index]; // Toma el elemento actual del array
                
                if (!listID.includes(task.id) || taskModified) {
                    taskModified = false;
                    listID.push(task.id);
            
                    let table = $(".tableTask");
            
                    let trow = $("<tr>");
                    trow.addClass("row");
                    trow.attr('id', task.id);
                    
                    table.append(trow);
            
                    let title = $("<td>").text(task.name);
                    trow.append(title);
            
                    let deadline = $("<td>").text(task.deadline);
                    trow.append(deadline);

                    let date = $("<td>").text(task.date);
                    trow.append(date);
            
                    let time = $("<td>").text(task.time);
                    trow.append(time);
            
                    let status = $("<td>").text(task.status);
                    trow.append(status);
            
                    let descriptionText = task.description;
                    let description = $("<td>");
            
                    if (descriptionText.length > 30) {
                        let descriptionV1 = descriptionText.slice(0, 30) + "...";
                        description.text(descriptionV1);
                    } else {
                        description.text(descriptionText);
                    }
                    trow.append(description);
            
                    let options = $("<td>");
                    let optionDelete = $('<i class="fa-solid fa-trash"></i>').attr('id', "btnRemove");
                    let optionEdit = $('<i class="fa-solid fa-pen"></i>').attr('id', "btnEdit");
            
                    options.addClass("options");
                    options.append(optionDelete);
                    options.append(optionEdit);
                    trow.append(options);
            
                    optionDelete.click((event) => deleteTask(event));
                    optionEdit.click((event) => editTask(event));
                }
            }
            
        }else{
            ShowMessageHome();
            pagination.hide();
            deleteTable();
        }

    }
    
    loadTask();

    addTask.click(() =>{
        if (!addingTask){
            inNewTask();
        }else{
            inHome();
        }
    })

    btnAdd.click(() =>{
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
                if (result.isDenied){
                    inHome();
                }
                if (result.isConfirmed){
                    clearFields();
                }
              });

              idTask++;
              let task = new Tarea(idTask, nameTask.val(), dateTask.val(), checkDay() ,timeTask.val(), statusTask.val(), descriptionTask.val())
              tasks.push(task);
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
        if (tasks.length !== 0) showPagination();
    }

    const inNewTask = () => {
        addingTask = true
        clearFields();
        checkAction();
        dateTask.val(checkDay());
        containerTasks.hide();
        containerNewTask.show();
        pagination.hide();
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

    const clearFields = () =>{
        nameTask.val('');
        timeTask.val('');
        descriptionTask.val(''); 
    }


    const deleteTask = (event) =>{
        let taskId = $(event.target).closest('tr').attr('id');
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
                idTaskDelete = tasks.findIndex(task => task.id == taskId);
                tasks.splice(idTaskDelete, 1);
                if (tasks.length > 0){
                    showPagination();
                    console.log(tasks)
                    deleteTable();    
                }
                loadTask();
            }
        })
    }

    const inEditTask = () => {
        editingTask = true
        containerTasks.hide();
        containerNewTask.show();
        iconAddTask.hide();
        iconHome.show();
        pagination.hide();
    }

    const editTask = (event) =>{
        inEditTask();
        checkAction();
        let taskId = $(event.target).closest('tr').attr('id') - 1; //- 1 (Para coincidir con los index del array task)
        console.log(taskId);

        actTask = new Tarea();
        console.log(actTask);
        console.log("1212 " + tasks[parseInt(taskId)]);
        actTask = tasks[parseInt(taskId)];

        nameTask.val(actTask.name);
        dateTask.val(actTask.deadline);
        timeTask.val(actTask.time);
        statusTask.val(actTask.status);
        descriptionTask.val(actTask.description);
        
        btnEdit.click(() => aplyEditTask(taskId))
    }

        const aplyEditTask = (id) =>{
        Swal.fire({
            title: "¿Estas seguro que desea modificar esta tarea?",
            text: "Esta acción no se podrá revertir.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "¡Si, deseo actualizarla!"
        }).then((result) => {
            if (result.isConfirmed) {
            Swal.fire({
                icon: "success",
                title: "La tarea se ha modificado correctamente",
                confirmButtonText: "Agregar nueva tarea",
                showDenyButton: true,
                denyButtonText: `Volver al inicio`
              }).then((result) =>{
                if (result.isDenied){
                    inHome();
                }
                if (result.isConfirmed){
                    clearFields();
                    editingTask = false;
                    checkAction();
                }
              });
              console.log(tasks[id])
              tasks[id].name = nameTask.val();
              tasks[id].date = dateTask.val();
              tasks[id].time = timeTask.val();
              tasks[id].status = statusTask.val();
              tasks[id].description = descriptionTask.val();
              taskModified = true;
              $(`#${id + 1}`).remove();
            }
        })

        console.log(tasks);
    }

    const showPagination = () => {
        if ($("#pageSection") != null){
            $("#pageSection").remove();
        }

        const paginationSection = $("<div>").attr("id", "pageSection");
        pagination.append(paginationSection);
        let numberPages = Math.ceil(tasks.length/taskPerPage);
        pages = [];
        for (let i = 0; i < numberPages; i++){
            pages.push(i+1)
        }

        paginationSection.append($("<span>").text("<").addClass("changerPage changerLeft").attr('onclick', "previousPage()"));

        for (let i = 0; i < pages.length; i++){
            paginationSection.append($("<span>").text(i+1).addClass("page").attr('onclick', "changePage("+ (i+1) +")"));
        }

        paginationSection.append($("<span>").text(">").addClass("changerPage changerRight").attr('onclick', "nextPage()"));

        pagination.show();
    }

    const changePage = (currPage) =>{
        deleteTable();
        loadTask(currPage);
    }

    const previousPage = () =>{
        if (currentPage > 1){
            currentPage--;
            deleteTable();
            loadTask(currentPage);
        }
    }

    const nextPage = () =>{
        console.log(currentPage < Math.ceil(tasks.length/taskPerPage));
        if (currentPage < Math.ceil(tasks.length/taskPerPage)){
            currentPage++;
            deleteTable();
            loadTask(currentPage);
        }
    }

    const shortDateLower = () => {
        console.log("ORDENAR MENOR A MAYOR"); 
        tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)) //Orden ascendente (menor a mayor fecha)
        console.log("Tareas ordenadas (ascendente):", tasks);
        deleteTable();
        loadTask();
    }

    const shortDateUP = () => {
        console.log("ORDENAR MAYOR A MENOR");
        tasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline)) //Orden descendentemente (mayor a menor fecha)
        console.log("Tareas ordenadas (descendentemente):", tasks);
        deleteTable();
        loadTask();
    }

    const checkDay = () => {
        var today = new Date();
        return (today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate());
    }










