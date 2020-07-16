const express = require("express");
const fs = require('fs');
const Datastore = require("nedb");
const { version } = require("process");

const app = express();
const orders = new Datastore("data/orders.db");

orders.loadDatabase();

function FileHandler() {
this.createEmpty = function(url) {
    fs.open(url, "w", function (err) {
        if (err) {throw err;}
    });
}
this.create = function(url, text) { // bzw replace, bzw overwrite
    fs.writeFile(url, text, function (err) {
        if (err) {throw err;}
    }); 
}
this.read = function(url) {
    return(fs.readFileSync(url, 'utf8', function(error) {
        if(error) throw error;
    }));
}
this.append = function(url, text) {
    fs.appendFile(url, text, function (err) {
        if (err) {throw err;}
    }); 
}
this.replace = function(url, text) { // bzw overwrite
    this.create(url, text);
}
this.remove = function(url) {
    fs.unlink(url, function (err) {
        if (err) throw err;
    }); 
}
this.rename = function(url, newUrl) {
    fs.rename(url, newUrl, function (err) {
        if (err) throw err;
    }); 
}
}

const fh = new FileHandler();

const port = 3567;
app.listen(port, () => console.log('>Server is listening at port ' + port + "."));
app.use(express.static('./public/'));
app.use(express.json({limit: "5mb"}));

function server1() {
    app.get("/getTables", function(request, response) {
        var obj = JSON.parse(fh.read("data/tables.json"));
        response.contentType('application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(obj);
    });
    app.get("/getItems", function(request, response) {
        var obj = JSON.parse(fh.read("data/items.json"));
        response.contentType('application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(obj);
    });
    
    app.post("/sendOrder", function(request, response) {
        var configs = fh.read("data/config.json");
        var oID = parseInt((JSON.parse(configs)).nextOrderID);
        var timestamp = Date.now();
        var meta = {};
        meta.orderID = oID;
        meta.Opened = timestamp;
        meta.LastEdited = timestamp;
        meta.status = "open";
        var data = Object.assign(meta, request.body);
        orders.insert(data);

        configs = configs.replace("\"nextOrderID\" : " + oID, "\"nextOrderID\" : " + (oID+1));
        oID  = oID + 1;
        fh.replace("data/config.json", configs);

        response.contentType('application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json({status: 200}); // 200 = ok/successful 
    });
    app.get("/getOpen",function(request, response) {
        orders.find({status:"open"}).limit(0).sort({LastEdited: 1}).exec((err, data) => { //limit=0 -> all ; limit<0 and >0 -> all minus  n ones; 
            if(err) {
                response.end();
                return err;
            }
            response.contentType('application/json');
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.json(data);
        });
    });
    app.get("/getInProgress",function(request, response) {
        orders.find({status:"in-progress"}).limit(5).sort({LastEdited: 1}).exec((err, data) => {
            if(err) {
                response.end();
                return err;
            }
            response.contentType('application/json');
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.json(data);
        });
    });
    app.get("/getReady",function(request, response) {
        orders.find({status:"ready"}).limit(5).sort({LastEdited: 1}).exec((err, data) => {
            if(err) {
                response.end();
                return err;
            }
            response.contentType('application/json');
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.json(data);
        });
    });
}

server1();

/*     app.post("/api", function handleData(request, response) { //client->server
        var data = request.body;
        database.insert(data);
        response.json(data);
    });

    app.get("/api", function handleData(request, response) {//server->client
        database.find({}, (err, data) => {
            if(err) {
                response.end();
                return err;
            }
            response.json(data);
        });
    }); */