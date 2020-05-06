var tidselect;
var famselect;
var list;
var tables;
var items;

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

    // console.log(tables);
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
    // console.log(items);
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
    for (var i = 0; i < accHD.length; i++) {
        accHD[i].addEventListener('click', toggleItem, false);
    }
    function toggleItem() {
        var itemClass = this.parentNode.className;
        for (var i = 0; i < accItem.length; i++) {
            accItem[i].className = 'accordionItem close';
        }
        if (itemClass == 'accordionItem close') {
            this.parentNode.className = 'accordionItem open';
        }
    }
}
function register_minus() {
    var minusb = document.getElementsByClassName("minus");
    for (var i = 0; i < minusb.length; i++) {
        minusb[i].addEventListener('click', subone, false);
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
    for (var i = 0; i < plusb.length; i++) {
        plusb[i].addEventListener('click', addone, false);
    }
    function addone() {
        var counts = this.previousElementSibling;
        if(parseInt(counts.innerText) >= 0) {
            counts.innerText = parseInt(counts.innerText) +1;
        }
    }
}

function sendData() {
    var tableID = parseInt(document.getElementById("tableID").selectedIndex);
    var fid = parseInt(document.getElementById("famName")[document.getElementById("famName").selectedIndex].value);
    
    var counts = document.getElementsByClassName("count");
    var amounts = []
    for(var i = 0; i<counts.length; i++) {
        var count = parseInt(counts[i].innerText);
        var itemID = parseInt(counts[i].parentElement.parentElement.firstChild.firstChild.innerText);
        amounts.push({itemID, count})
    }

    var data = {
        "tabeleID" : tableID,
        "familyID" : fid,
        order : amounts
    };
    // console.log(data);

    var options = {
        method:"post",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    };
    var response = fetch("/order", options);
    const json = response.json();
    console.log(json);

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
}