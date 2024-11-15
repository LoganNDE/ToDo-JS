const body = $("body")


class Tarea{
    constructor(name, date, time, status, description){
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
    const btnCancel = $(".btnCancel")
    const nameTask = $("#nameTask");
    const timeTask = $("#timeTask");
    const dateTask = $("#dateTask");
    const statusTask = $("#statusTask");
    const descriptionTask = $("#descriptionTask");

    let tasks = [];

    let addingTask = false;
    let tableCreate = false;


    loadTask = () =>{
        if (tasks.length > 0){
            $(".noTask").remove();

            if (!tableCreate){
                const table = $("<table>")
                .addClass("tableTask")
                
                const titles = ["Nombre", "Fecha", "Tiempo", "Estado", "Descripción"];
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
                let table = $(".tableTask")

                let trow = $("<tr>");
                table.append(trow);
    
                let title = $("<td>").text(task.name)
                trow.append(title);
    
                let date = $("<td>").text(task.date)
                trow.append(date);
                
                let time = $("<td>").text(task.name)
                trow.append(time);
    
                let status = $("<td>").text(task.status)
                trow.append(status);
                
                let description = $("<td>").text(task.description)
                trow.append(description);
                
            });
        }else{
            let message = $("<h3>").text("No se ha agregado ninguna tarea 😢").addClass("noTask");
            tasksContainer.append(message);
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

              let task = new Tarea(nameTask.val(), dateTask.val(), timeTask.val(), statusTask.val(), descriptionTask.val())
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
        containerTasks.show();
        containerNewTask.hide();
        iconAddTask.show();
        iconHome.hide();
    }

    const inNewTask = () => {
        addingTask = true
        containerTasks.hide();
        containerNewTask.show();
        iconAddTask.hide();
        iconHome.show();
    }

    const clearFields = () =>{
        nameTask.val('');
        timeTask.val('');
        dateTask.val('');
        descriptionTask.val(''); 
    }
})







