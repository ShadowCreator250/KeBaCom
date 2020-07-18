var now;
var open, inProgress, ready;
var openEle, inProgressEle, readyEle;
var lastChangeTime;
var config;
console.log(lastChangeTime>0);
function init() {
    openEle = document.getElementById("open");
    openEle = document.getElementById("in_progress");
    openEle = document.getElementById("ready");

    getConfig();
    update();
    setInterval(autoUpdate, 5000);
}

function autoUpdate() {
    if(!lastChangeTime > 0) {
        update();
        lastChangeTime = config.lastEdited;
    }
    else if(checkForUpdate()) {
        update();
    }
}
function update() {
    getOpen();
    getInProgress();
    getReady();
}
async function getConfig() {
    let response = await fetch("/getConfig");
    config = await response.json();
}
function checkForUpdate() {
    let r = false;
    getConfig();
    let temp = config.lastEdited;
    if(temp > lastChangeTime) {
        r = true;
        lastChangeTime = temp;
    }
    return r;
}

async function getOpen(entryLimit = 0) { //if no parameter is given, the default of 0 is taken
    if(typeof(entryLimit) != "number") {
        console.warn('The parameter is NaN. It was set to default.'); //antiError
        entryLimit = 0;
    }
    let data = {limit: entryLimit};
    let options = {
        method:"post",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await fetch("/getOpen", options);
    let json = await response.json(response);
    console.log(json);
}
async function getInProgress(entryLimit = 0) { //if no parameter is given, the default of 0 is taken
    if(typeof(entryLimit) != "number") {
        console.warn('The parameter is NaN. It was set to default.'); //antiError
        entryLimit = 0;
    }
    let data = {limit: entryLimit};
    let options = {
        method:"post",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await fetch("/getInProgress", options);
    let json = await response.json(response);
    console.log(json);
}
async function getReady(entryLimit = 0) { //if no parameter is given, the default of 0 is taken
    if(typeof(entryLimit) != "number") {
        console.warn('The parameter is NaN. It was set to default.'); //antiError
        entryLimit = 0;
    }
    let data = {limit: entryLimit};
    let options = {
        method:"post",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await fetch("/getReady", options);
    let json = await response.json(response);
    console.log(json);
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