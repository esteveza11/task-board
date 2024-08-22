// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
        if (!nextId) {
            nextId = 1; // Set initial value if not found in localStorage
        }
        localStorage.setItem("nextId", JSON.stringify(nextId + 1));
        return nextId++;
    }
    

// Todo: create a function to create a task card
function createTaskCard(task) {
    return `
    <div class="task-card" id="task-${task.id}" draggable="true">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Due: ${task.dueDate}</p>
        <button class="delete-task" data-id="${task.id}">Delete</button>
    </div>`;
}


// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#task-container").html(""); // Clear container
    taskList = taskList || [];
    
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        $("#task-container").append(taskCard);
    });

    // Make tasks draggable
    $(".task-card").draggable();
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const title = $("#task-title").val();
    const description = $("#task-desc").val();
    const dueDate = $("#task-due").val();
    
    const newTask = {
        id: generateTaskId(),
        title,
        description,
        dueDate,
        status: "todo"
    };
    
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).data("id");
    
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = $(ui.draggable).attr("id").split("-")[1];
    const newStatus = $(event.target).attr("data-status");

    const task = taskList.find(t => t.id == taskId);
    if (task) {
        task.status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    
    // Add task submission handler
    $("#add-task-form").on("submit", handleAddTask);

    // Add delete handler (delegation needed since tasks are dynamic)
    $(document).on("click", ".delete-task", handleDeleteTask);

    // Make lanes droppable
    $(".task-lane").droppable({
        drop: handleDrop
    });

    // Make the due date field a date picker
    $("#task-due").datepicker();
});

