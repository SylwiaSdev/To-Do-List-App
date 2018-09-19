var todoTasks = [];
var doneTasks = [];

$(document).ready(function(){
    updateLists();
})

$("#newTask").on("click", showNewTaskForm);
$("#newTaskMobile").on("click", showNewTaskForm);

function showNewTaskForm (){
    $(".popup-holder").css({"display":"flex"});
}

$(".formSwitcher").on("click", hideNewTaskForm);
$(".popup-holder").on("click", hideNewTaskForm);

$(".popup-form").click(function(e){
    e.stopPropagation();
});

function hideNewTaskForm() {
    $(".popup-holder").hide();
}

$("#add").on("click", newTask);

function newTask(){
    
    var task = {
        title: $("#title").val(),
        description: $("#description").val(),
        status: $("#done").is(":checked")
    }
    if (task.status){
        doneTasks.push(task);
    } else {
        todoTasks.push(task);
    }
    saveToLocalStorage();
    hideNewTaskForm();
    clearForm();
    updateLists();
}


function clearForm() {
    $("#title").val("");
    $("#description").val("");
    $("#done").prop("checked", false);
}

function saveToLocalStorage(){
    localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
    localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
}

function updateLists() {
    synchronizeDatabase();
    updateTodoList();
    updateDoneList();
    $(".trush").on("click", function(){
        var taskId = parseInt($(this).attr("taskId"));
        var taskList = $(this).attr("taskList");
        removeTask(taskId, taskList);
    });
    $(".check").change(function(){
        var taskId = parseInt($(this).attr("taskId"));
        var taskList = $(this).attr("taskList");
        var state = $(this).prop("checked");
        changeTaskState(taskId, taskList, state);
    });
}

function updateTodoList() {
    $("#todoTaskList").html("");
    if (todoTasks.length>0){
        $.each(todoTasks, function(k,v){
            var taskHTML = "<li><div class='task-state'>"+
            "<input class='check' type='checkbox' askId='"+k+
            "'taskList='todoTasks'>"+
            "</div><div class='task-title'>"+v.title+"</div>"+
            "<div class='task-options'>"+
            "<i class='far fa-trash-alt trush' taskId='"+k+
            "' taskList='todoTasks'></i></div></li>";
            $("#todoTaskList").append(taskHTML);
        });
    } else{
        $("#todoTaskList").append("<div class='noTasks'>Brak zadań do zrobienia</div>");
    }
    
}   

function updateDoneList() {
    $("#doneTaskList").html("");
    if (doneTasks.length>0){
        $.each(doneTasks, function(k,v){
            var taskHTML = "<li><div class='task-state'>"+
            "<input class='check' type='checkbox' checked taskId='"+k+
            "'taskList='doneTasks'>"+
            "</div><div class='task-title'>"+v.title+"</div>"+
            "<div class='task-options'>"+
            "<i class='far fa-trash-alt trush' taskId='"+k+
            "' taskList='doneTasks'></i></div></li>";
            $("#doneTaskList").append(taskHTML);
        }); 
    } else {
        $("#doneTaskList").append("<div class='noTasks'>Brak wykonanych zadań</div>");
    }
}

function synchronizeDatabase() {
    doneTasks = JSON.parse(localStorage.getItem("doneTasks"));
    todoTasks = JSON.parse(localStorage.getItem("todoTasks"));
    console.log(doneTasks, todoTasks);
}

function removeTask(taskId, taskList){
    if(taskList=="doneTasks") {
      doneTasks.splice(taskId, 1);
    } else if(taskList=="todoTasks") {
        todoTasks.splice(taskId, 1);
    }
    saveToLocalStorage();
    updateLists();
}

function changeTaskState(taskId, taskList, newState){
    if(taskList=="doneTasks") {
        var deleted = doneTasks.splice(taskId, 1);
        todoTasks.push(deleted[0]);
    } else if(taskList=="todoTasks") {
        var deleted = todoTasks.splice(taskId, 1);
        doneTasks.push(deleted[0]);
    }
    saveToLocalStorage();
    updateLists();
}

