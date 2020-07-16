var now;
var open, inProgress, ready;
var openEle, inProgressEle, readyEle;
function init() {
    openEle = document.getElementById("open");
    openEle = document.getElementById("in_progress");
    openEle = document.getElementById("ready");

    update();
    setInterval(update, 10000);
}

function update() {
    console.log("update");
    getOpen();
    getInProgress();
    getReady();
}

async function getOpen() {
    const response = await fetch("/getOpen");
    open = await response.json();
    console.log(open);
}
async function getInProgress() {
    const response = await fetch("/getInProgress");
    inProgress = await response.json();
    console.log(inProgress)
}
async function getReady() {
    const response = await fetch("/getReady");
    ready = await response.json();
    console.log(ready)
}
function initOpen() {

}
function initInProgress() {

}
function initReady() {

}

function setOpen() {
    
}
function setInProgress() {

}
function setReady() {

}

function register_setOpenB() {
    
}
function register_setInProgressB() {

}
function register_setReadyB() {

}