// Buttons
const addTaskBtn = document.getElementById("add-task-btn"); 
const yesBtn = document.getElementById("yes-btn"); 
const noBtn = document.getElementById("no-btn"); 
const setTimeBtn = document.getElementById("set-time-btn"); 

// Dialogs
const setTimeDialog = document.getElementById("set-time-dialog");
const inputTimeDialog = document.getElementById("input-time-dialog");

// Inputs
const inputTask = document.getElementById("input-task"); 
const inputTime = document.getElementById("input-time"); 

// Task container 
const tasksContainer = document.getElementById("tasks-container"); 
const todoListApp = document.getElementById("todo-list-app"); 

// LI tags
const militaryOrStandardTime = document.getElementById("military-or-standard-time"); 

let kindOfTime = JSON.parse(localStorage.getItem("data2")) || "";
const taskArr = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {}; 

// FUNCTIONS
const displayTime = () => {
    if(!kindOfTime){
        kindOfTime = "Standard Time"; 
        militaryOrStandardTime.innerText = kindOfTime; 
    }
    militaryOrStandardTime.innerText = kindOfTime; 
}

displayTime(); 



// this function changes the default military time and returns standard time
const cleanTime = str =>{

    const arr = str.split('');
    let a = arr[0] + arr[1]; 
    const b = arr[2] + arr[3] + arr[4]

    if(a === "00"){
        a = 12; 
        return a + b + " AM" 
    } else if (a >= 1 && a < 10){
        a = a - 0; 
        return a + b + " AM" 
    } else if (a >= 10 && a < 12){
        return a + b + " AM"
    } else if (a === "12"){
        return a + b + " PM"; 
    } else if (a >= 13){
        a = a - 12;
        return a + b + " PM" 
    } 
}

// This function displays the setTimeDialog
const displayTimeDialog = () =>{
    if(!inputTask.value){
        alert("Please type a task"); 
        return; 
    }
    yesBtn.disabled = true; 
    noBtn.disabled = true; 
    setTimeDialog.showModal();  
    todoListApp.classList.toggle("hidden"); 
    yesBtn.disabled = false; 
    noBtn.disabled = false; 
}

// This function displays the task the user inputs to the tasksContainer div
const displayTask = (value, time) =>{
    const taskObj = {
        id: `${value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
        title: value,
        time: time,
        checked: false
    }

    currentTask = taskObj; 

    taskArr.unshift(taskObj); 
    localStorage.setItem("data", JSON.stringify(taskArr)); 
    updateTaskContainer()
    inputTask.value = ""; 
    
}

const updateTaskContainer = () =>{
    tasksContainer.innerHTML = ""; 
    taskArr.forEach(({id, title, time, checked}) => {
        console.log(checked)
        tasksContainer.innerHTML += `
        <div id=${id}>
            <span>${title}</span>
            <i class="fa-solid fa-x"></i>
        </div>`
        if(time){
            const taskId = document.getElementById(id); 
            if(kindOfTime === "Standard Time"){
                taskId.innerHTML += `<p>${cleanTime(time)}</p>`
            } else {
                taskId.innerHTML += `<p>${time}</p>`
            }
            
        }
        if(checked){
            const spanElement = document.querySelector(`#${id} span`);
            spanElement.classList.toggle("checked"); 
        }
    })
}

if(taskArr.length){
    updateTaskContainer(); 
}

// ONCLICKS If the user clicks on the tiny "x" next to the task the task will be deleted. 
// If the user clicks on the task it self the task will be "completed"
tasksContainer.addEventListener("click", e => {
    
    if(e.target.tagName === "SPAN"){
        e.target.classList.toggle("checked"); 
        const taskArrIndex = taskArr.findIndex((item) => item.id === e.target.parentElement.id)
        if(taskArr[taskArrIndex].checked){
            taskArr[taskArrIndex].checked = false; 
            localStorage.setItem("data", JSON.stringify(taskArr)); 
        } else {
            taskArr[taskArrIndex].checked = true; 
            localStorage.setItem("data", JSON.stringify(taskArr)); 
        }
    } else if (e.target.tagName === "I"){
        e.target.parentElement.remove(); 
        const taskArrIndex = taskArr.findIndex((item) => item.id === e.target.parentElement.id)
        taskArr.splice(taskArrIndex, 1); 
        localStorage.setItem("data", JSON.stringify(taskArr)); 
    }
})

// LOCALStorage


// AddEventListeners
militaryOrStandardTime.addEventListener("click", ()=>{
    if(kindOfTime === "Standard Time"){
        kindOfTime = "Military Time"; 
        militaryOrStandardTime.innerText = kindOfTime;
        localStorage.setItem("data2", JSON.stringify(kindOfTime)); 
        updateTaskContainer();
    } else {
        kindOfTime = "Standard Time"; 
        militaryOrStandardTime.innerText = kindOfTime; 
        localStorage.setItem("data2", JSON.stringify(kindOfTime)); 
        updateTaskContainer();
    }
})

// This addEventListener is for if the user wants to add a task without a time
noBtn.addEventListener("click", ()=>{
    setTimeDialog.close(); 
    todoListApp.classList.toggle("hidden"); 
    displayTask(inputTask.value); 
})

// This addEventListener is for if the user wants to add a task with a time
yesBtn.addEventListener("click", ()=>{
    setTimeDialog.close();  
    inputTimeDialog.showModal(); 
})

// This addEventListener is for when the user sets a time for a task
setTimeBtn.addEventListener("click", ()=>{
    if(!inputTime.value){
        alert("Please input a time"); 
        return; 
    }
    inputTimeDialog.close(); 
    todoListApp.classList.toggle("hidden");
    displayTask(inputTask.value, inputTime.value); 
})


// Calling addTask function events 

// This addEventListener is for when the user wants to add a task
addTaskBtn.addEventListener("click", displayTimeDialog); 

// This addEventListener is for when the user wants to add a task with the "Enter" key
inputTask.addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){
        displayTimeDialog(); 
    }
})


