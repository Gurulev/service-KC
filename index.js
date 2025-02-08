const http = require("http");
const fs = require("fs");
const formidable = require("formidable");
const { ifError } = require("assert");
let prevId = 0;

/*function checkPg (response) {
    const { Client } = require('pg');
    const checkClient = new Client({
        host: "localhost",
        user: "postgres",
        password: "15426378",
        database: "kc-service",
    });
    checkClient.connect()
        .then(() => console.log("Checked"))
        .catch(err => console.error("Connection error", err.stack));
    checkClient.query('SELECT id_order FROM orders ORDER BY orders DESC LIMIT 1;', (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        let id = result.rows[0].id_order;
        if (prevId == 0) {
            prevId = id;
        }
        else if (prevId !== id) {
            console.log("ALARMA");
            prevId = id;          
        }
        
        checkClient.end();
    });
};
setInterval(checkPg, 5000);*/
//конец проверки измнений
//Здесь начинается сервер.

const server = http.createServer(function (request, response) {
    console.log(`Запрошенный адрес: ${request.url}`);
    const reqPath = request.url.substring(1); // здесь получаем название запрос, напр."hello"
    //Далее начинается обработка запроса и отправка ответа.
    let elementFile = reqPath.slice(0, reqPath.lastIndexOf("/"));
    let lastQuery = reqPath.substring(reqPath.lastIndexOf("/")+1);
//    console.log("zhopa:" + lastQuery);
    const { Client } = require('pg');
    const client = new Client({
    host: "localhost",
    user: "postgres",
    password: "15426378",
    database: "kc-service",
    });
    if (reqPath === "") {
        fs.readFile("index.html", function (error, data) {
            response.end(data);   
        });
    }
    else if (reqPath === "styles.css") {
        fs.readFile("styles.css", function (error, data) {
            response.end(data);   
        });
    }
    else if (reqPath === "scripts.js") {
        fs.readFile("scripts.js", function (error, data) {
            response.end(data);   
        });
    }
    else if (elementFile == "icons") {
        fs.readFile(reqPath, function (error, data) {
            response.end(data);   
        });
    }
    else if (elementFile == "images") {
        fs.readFile(reqPath, function (error, data) {
            response.end(data);   
        });
    }
    else if (reqPath === "sql") {      
        client.connect()
            .then(() => console.log("Connected to PostgreSQL"))
            .catch(err => console.error("Connection error", err.stack));
        client.query('SELECT * FROM orders ORDER BY orders DESC LIMIT 30', (err, result) => {
            if (err) {
            console.error(err);
            return;
            }
            const answer = JSON.stringify(result.rows);
            console.log("Answer SQL complete");
            response.end(answer);
        client.end();
    });          
    }
    else if (reqPath === "index") {
        let data = "";
        request.on("data", (chunk) => { //здесь приходят данные формы
            data += chunk;
        });
        request.on("end", () => {  //здесь обрабатываются данные формы
            const formData = require("querystring").parse(data);
            let formDateOut = "";
            let formComment = "";
            let formDocs = "";
            let formReady = "";
            if (formData.dateOut == "") {
                formDateOut = null;
            }
            else {
                formDateOut = `'${formData.dateOut}'`;
            }
            if (formData.comment == "") {
                formComment = null;
            }
            else {
                formComment = `'${formData.comment}'`;
            }
            if (formData.docs == "") {
                formDocs = null;
            }
            else {
                formDocs = `'${formData.docs}'`;
            }
            if (formData.ready == "") {
                formReady = null;
            }
            else {
                formReady = `'${formData.ready}'`;
            }
            let dataQuery = `INSERT INTO orders (date_in,date_out,job,comment,phone,device,client,docs,ready) VALUES('${formData.dateIn}',
            ${formDateOut},'${formData.job}',${formComment},${formData.phone},'${formData.device}',
            '${formData.client}',${formDocs},${formReady});`;
            client.connect()
                .then(() => console.log("Connected to PostgreSQL for adding data"))
                .catch(err => console.error("Connection error", err.stack));
            
            client.query(dataQuery, (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
            console.log("Adding complete");          
        client.end();
    });
        })
        response.statusCode = 301;
        response.setHeader('Location', '/');
        response.end();
    }
    
    else if (reqPath === "update") { //данные из изменения элемента таблицы
        let data = "";
        request.on("data", (chunk) => { //здесь приходят данные формы
            data += chunk;
        });
        request.on("end", () => {  //здесь обрабатываются данные формы
            const formData = require("querystring").parse(data);
            
            let id_order = formData.id_order;
            Object.defineProperties(formData, {
                id_order: { enumerable: false },
                man: { enumerable: false }
            });
            let element = Object.keys(formData);
            let dataQuery = `UPDATE orders SET ${element[0]} = '${formData[element[0]]}' WHERE id_order = ${id_order};`;
            client.connect()
                .then(() => console.log("Connected to PostgreSQL for adding data"))
                .catch(err => console.error("Connection error", err.stack));
            
            client.query(dataQuery, (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
            console.log("Adding complete");          
        client.end();
    });
        })
        response.statusCode = 301;
        response.setHeader('Location', '/');
        response.end();
    }
    else if (reqPath === "check") {
        if (request.headers.accept && request.headers.accept === "text/event-stream") {
            client.connect()
                .then(() => console.log("Checked"))
                .catch(err => console.error("Connection error", err.stack));
            setInterval(() => {
                client.query('SELECT id_order FROM orders ORDER BY orders DESC LIMIT 1;', (err, result) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    let id = result.rows[0].id_order;
                    if (prevId == 0) {
                        prevId = id;
                    }
                    else if (prevId !== id) {
                        console.log("ALARMA");
                        sendEvent(response);
                        prevId = id;
                    }
                    //client.end();
                });
            }, 5000);
        }
    }
    else if (elementFile === "paths") {      
        client.connect()
            .then(() => console.log("Connected to PostgreSQL"))
            .catch(err => console.error("Connection error", err.stack));
        client.query('SELECT img FROM orders WHERE id_order ='+lastQuery, (err, result) => {
            if (err) {
            console.error(err);
            return;
            }
            console.log("Answer SQL complete");
            response.end(result.rows[0].img);
        client.end();
    });          
    }
    else if (reqPath == "upload") {
        let formFile = new formidable.IncomingForm();
        formFile.parse(request, function (err, fields, files) {
            if (Object.keys(fields).length === 0) {
                response.statusCode = 400;
                response.end("Invalid request");
                return
            }
            let id = fields.id_order[0];
            let imagePaths = [];
            for (let i = 0; files.file.length > i; i++) {
                let oldpath = files.file[i].filepath;
                let oldName = files.file[i].originalFilename;
                let point = oldName.lastIndexOf(".");
                let exp = oldName.substring(point);
                let newpath = `C:/Users/russi/Desktop/service-KC/images/${id}_${i+1}${exp}`;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                });
                imagePaths += `images/${id}_${i+1}${exp}*`;
            }
            let dataQuery = `UPDATE orders SET img = '${imagePaths}' WHERE id_order = ${id};`;
            client.connect()
                .then(() => console.log("Connected to PostgreSQL for adding data"))
                .catch(err => console.error("Connection error", err.stack));
            
            client.query(dataQuery, (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
            console.log("Adding complete");          
            client.end();
        });
                response.statusCode = 301;
                response.setHeader('Location', '/');
                response.end();
            if (err) {
                res.write(err);
            }
            })
        }
        
    
        
    else {       
        response.statusCode = 404;
        response.end("Not found!!!");
    }


/*if (filePath === "") {
        fs.readFile("index.html", function (error, data) {
            response.end(data);   
        });
    }
    else if (filePath == "hello") {
        response.end("U tebya poluchilos!")
    }  
    else {       
        response.statusCode = 404;
        response.end("Not found!!!");
    }*/

}).listen(3000, function () { console.log("Сервер запущен на порте 3000"); });//Эту строку не трогать! Следить за закрытием функции createServer

function sendEvent(response) {
    response.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connecrion": "keep-alive"
    });
    checkMessage(response);
}
function checkMessage(response) {
    response.write("data: " + "В базе произошли изменения. Обновите страницу!" + "\n\n");
}