const http = require("http");
const fs = require("fs");
//const { encode } = require("punycode");
//проверка изменений
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
    const filePath = request.url.substring(1); // здесь получаем название запрос, напр."hello"
    //Далее начинается обработка запроса и отправка ответа.
    let elementFile = filePath.slice(0, 5);
    const { Client } = require('pg');
    const client = new Client({
    host: "localhost",
    user: "postgres",
    password: "15426378",
    database: "kc-service",
    });
    if (filePath === "") {
        fs.readFile("index.html", function (error, data) {
            response.end(data);   
        });
    }
    else if (filePath === "styles.css") {
        fs.readFile("styles.css", function (error, data) {
            response.end(data);   
        });
    }
    else if (filePath === "scripts.js") {
        fs.readFile("scripts.js", function (error, data) {
            response.end(data);   
        });
    }
    else if (elementFile == "icons") {
        fs.readFile(filePath, function (error, data) {
            response.end(data);   
        });
    }
    else if (filePath === "sql") {      
        client.connect()
            .then(() => console.log("Connected to PostgreSQL"))
            .catch(err => console.error("Connection error", err.stack));
        client.query('SELECT * FROM orders ORDER BY orders DESC', (err, result) => {
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
    else if (filePath === "index") {
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
    
    else if (filePath === "update") { //данные из изменения элемента таблицы
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
    else if (filePath === "check") {
        if (request.headers.accept && request.headers.accept === "text/event-stream") {
                         
                client.connect()
                    .then(() => console.log("Checked"))
                    .catch(err => console.error("Connection error", err.stack));
                setInterval(()=> {       
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
            },5000);  
        }
        else {
            response.writeHead(400);
            response.end("Что-то пошло не так");
        }
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