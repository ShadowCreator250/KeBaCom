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

const port = 80;
app.listen(port, () => console.log('>Server is listening on port ' + port + "."));
app.use(express.static('./public/'));
app.use(express.json({limit: "5mb"}));

function server1() {
    app.get("/getTables", function(request, response) {
        let obj = JSON.parse(fh.read("data/tables.json"));
        response.contentType('application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(obj);
    });
    app.get("/getItems", function(request, response) {
        let obj = JSON.parse(fh.read("data/items.json"));
        response.contentType('application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(obj);
    });
    app.get("/getConfig", function(request, response) {
        let obj = JSON.parse(fh.read("data/config.json"));
        response.contentType('application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(obj);
    });
    
    app.post("/registerOrder", function(request, response) {
        let config = JSON.parse(fh.read("data/config.json"));
        let oID = config.nextOrderID;
        let timestamp = Date.now();
        let meta = {};
        meta.orderID = oID;
        meta.opened = timestamp;
        meta.lastEdited = timestamp;
        meta.status = "open";
        let data = Object.assign(meta, request.body);
        orders.insert(data);

        config.nextOrderID = oID+1;
        config.lastEdited = timestamp;
        oID  = oID + 1;
        fh.replace("data/config.json", JSON.stringify(config));

        // response.contentType('application/json');
        // response.setHeader("Access-Control-Allow-Origin", "*");
        // response.json({status: 200}); // 200 = ok/successful 
    });

    app.post("/getOpen",function(request, response) {
        let options = request.body;
        orders.find({status:"open"}).sort({lastEdited: 1}).limit(options.limit).exec((err, data) => {
            if(err) {
                response.end();
                return err;
            }
            response.contentType('application/json');
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.json(data);
        });
    });
    app.post("/getInProgress",function(request, response) {
        let options = request.body;
        orders.find({status:"in-progress"}).sort({lastEdited: 1}).limit(options.limit).exec((err, data) => {
            if(err) {
                response.end();
                return err;
            }
            response.contentType('application/json');
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.json(data);
        });
    });
    app.post("/getReady",function(request, response) {
        let options = request.body;
        orders.find({status:"ready"}).sort({lastEdited: 1}).limit(options.limit).exec((err, data) => {
            if(err) {
                response.end();
                return err;
            }
            response.contentType('application/json');
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.json(data);
        });
    });
    app.post("/getAll", function handleData(request, response) {
        database.find({}, (err, data) => {
            if(err) {
                response.end();
                return err;
            }
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