var openOrders, inProgressOrders, readyOrders;
var openEle, inProgressEle, readyEle;
var lastChangeTime = 0;
var config = {};
async function init() {
    openEle = document.getElementById("open");
    openEle = document.getElementById("in_progress");
    openEle = document.getElementById("ready");

    autoUpdate();
    setInterval(autoUpdate, 5000);
}

async function autoUpdate() {
    config = await getConfig();
    if(!lastChangeTime > 0) {
        console.log(">Initial fetch made:");
        update();
        lastChangeTime = config.lastEdited;
    }
    else if(config.lastEdited > lastChangeTime) {
        lastChangeTime = config.lastEdited;
        console.log(">Fetched source:");
        update();
    }
}
async function update() {
    openOrders = await getOpen();
    inProgressOrders = await getInProgress();
    readyOrders = await getReady();
    let now = new Date().getTime();
    let dif = lastChangeTime - now;
    let difInS = dif/1000;
    let prefix = "";
    let s = Math.floor(Math.abs((difInS)%60));
    let m = Math.floor(Math.abs((difInS/60)%60));
    let h = Math.floor(Math.abs((difInS/3600)%24));
    let d = Math.floor(Math.abs(difInS/3600/24)%365);
    if(difInS*-1 > 0) {
        prefix = "-";
    }
    else {
        prefix = "+";
    }
    let obj = {
        timestampNow: new Date(now).toLocaleString(),
        timeSinceLastChange: (prefix + d + "d " + h + "h " + m + "m " + s + "s"),
        timestampLastChange: new Date(lastChangeTime).toLocaleString()
    }
    console.log(">> ", obj, openOrders, inProgressOrders, readyOrders);
}

    async function getConfig() {
    let response = await fetch("/getConfig");
    return await response.json();
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
    let response = await fetch("/getOpen", options);
    return await response.json();

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
    let response = await fetch("/getInProgress", options);
    return await response.json();
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
    let response = await fetch("/getReady", options);
    return await response.json(response);
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