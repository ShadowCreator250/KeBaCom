var tidselect; // TableID select element
var famselect; // FamilyID select element
var list; // element for selection list
var tables; // object for the information about the tables
var items; // object for the information about the items

function init() {
    tidselect = document.getElementById("tableID");
    famselect = document.getElementById("famName");
    list = document.getElementById("list");
    getTables(); 
    getItems();
}

async function getTables() {
    const response = await fetch("/getTables");
    tables = await response.json();
    inputTables();
}

function inputTables() {
    for(item of tables) {
        var o = document.createElement("option");
        o.value = item.id;
        o.text = item.name;
        tidselect.appendChild(o);
    }
    updateFamNames();
}

function updateFamNames() {
    famselect.innerHTML = "";
    var index = tidselect.selectedIndex;
    for(fam of tables[index].familien) {
        var o = document.createElement("option");
        o.value = fam.fid;
        o.text = fam.name;
        famselect.appendChild(o);
    }  
}

async function getItems() {
    const response = await fetch("/getItems");
    items = await response.json();
    inputItems();
}

function inputItems() {
    for(group of items) {
        var accorditem = document.createElement("div");
        accorditem.classList.add("accordionItem");
        accorditem.classList.add("close");
        var h = document.createElement("span");
        h.classList.add("groupname");
        h.classList.add("accordionItemHeading");
        h.innerText = group.gruppenname;
        var c = document.createElement("div");
        c.classList.add("accordionItemContent");
        c.classList.add("sublist");

        if(group.inhalt.length === 0) {
            c.innerHTML = "<ul><li class=\"empty\">Hier ist nichts!</li></ul>";
        }
        else if(group.inhalt.length >= 1) {
            for(var i = 0; i < group.inhalt.length; i++) {
                var ul = document.createElement("ul");
                ul.classList.add("item");

                var liname = document.createElement("li");
                liname.classList.add("name");
                var lipreis = document.createElement("li");
                lipreis.classList.add("price");
                var lizutaten = document.createElement("li");
                lipreis.classList.add("ingredients");
                var lianzahl = document.createElement("li");
                lianzahl.classList.add("amount");

                var ids = document.createElement("span");
                ids.classList.add("id");
                ids.innerText = group.inhalt[i].id;
                liname.appendChild(ids);
                
                lizutaten.innerText = "Zutaten: ";
                for(var j = 0; j<group.inhalt[i].zutaten.length; j++) {
                    if(j+1 == group.inhalt[i].zutaten.length) {
                        lizutaten.innerText += group.inhalt[i].zutaten[j];
                    }
                    else {
                        lizutaten.innerText += group.inhalt[i].zutaten[j] + ", ";
                    }
                }

                var bminus = document.createElement("button");
                bminus.innerText = "-";
                bminus.classList.add("minus");
                var count = document.createElement("span");
                count.classList.add("count");
                count.innerText = "0";
                var bplus = document.createElement("button");
                bplus.innerText = "+";
                bplus.classList.add("plus");
                
                lianzahl.appendChild(bminus);
                lianzahl.appendChild(count);
                lianzahl.appendChild(bplus);
                
                liname.innerHTML += ": " + group.inhalt[i].name;
                lipreis.innerHTML = group.inhalt[i].preis + "€";

                ul.appendChild(liname);
                ul.appendChild(lizutaten);
                ul.appendChild(lipreis);
                ul.appendChild(lianzahl);
                c.appendChild(ul);
            }
        }
        accorditem.appendChild(h);
        accorditem.appendChild(c);
        list.appendChild(accorditem);
    }
    register_accordion();
    register_minus();
    register_plus();
}

function register_accordion() {
    var accItem = document.getElementsByClassName('accordionItem');
    var accHD = document.getElementsByClassName('accordionItemHeading');
    for (accHead of accHD) {
        accHead.addEventListener('click', toggleItem, false);
    }
    function toggleItem() {
        var itemClass = this.parentNode.className;
        for (accI of accItem) {
            accI.className = 'accordionItem close';
        }
        if (itemClass == 'accordionItem close') {
            this.parentNode.className = 'accordionItem open';
        }
    }
}
function register_minus() {
    var minusb = document.getElementsByClassName("minus");
    for (item of minusb) {
        item.addEventListener('click', subone, false);
    }
    function subone() {
        var counts = this.nextElementSibling;
        if(parseInt(counts.innerText) >= 1) {
            counts.innerText = parseInt(counts.innerText) -1;
        }
    }
}
function register_plus() {
    var plusb = document.getElementsByClassName("plus");
    for (item of plusb) {
        item.addEventListener('click', addone, false);
    }
    function addone() {
        var counts = this.previousElementSibling;
        if(parseInt(counts.innerText) >= 0) {
            counts.innerText = parseInt(counts.innerText) +1;
        }
    }
}

async function sendData() {
    var tableID = parseInt(document.getElementById("tableID").selectedIndex);
    var fid = parseInt(document.getElementById("famName")[document.getElementById("famName").selectedIndex].value);
    
    var counts = document.getElementsByClassName("count");
    var amounts = [];
    var notesTxt = document.getElementById("notes").value;
    for(item of counts) {
        var count = parseInt(item.innerText);
        var itemID = parseInt(item.parentElement.parentElement.firstChild.firstChild.innerText);
        if(count > 0) {
            amounts.push({itemID, count});
        }
    }

    var data = {
        "tableID" : tableID,
        "familyID" : fid,
        order : amounts,
        notes : notesTxt
    };

    var options = {
        method:"post",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    };
    var response = await fetch("/sendOrder", options);
    var respdata = await response.json();
    //console.log(respdata)
    reset();
}

function reset() {
    document.getElementById("tableID").selectedIndex = 0;
    updateFamNames();
    document.getElementById("famName").selectedIndex = 0;
    var counts = document.getElementsByClassName("count");
    for(var i = 0; i<counts.length; i++) {
        counts[i].innerText = "0";
    }
    document.getElementById("notes").value = "";
}