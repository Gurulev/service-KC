const http = require("http");
const fs = require("fs");
const formidable = require("formidable");
const { ifError } = require("assert");



//Здесь начинается сервер.

const server = http.createServer(async function (request, response) {
    console.log(`Запрошенный адрес: ${request.url}`);
    const reqPath = request.url.substring(1); // здесь получаем название запрос, напр."hello"
    //Далее начинается обработка запроса и отправка ответа.
    const queries = reqPath.split("/");
    const { Client, Pool } = require('pg');
    const client = new Pool({
        host: "localhost",
        user: "postgres",
        password: "15426378",
        database: "kc-service",
    });
    if (queries[0] === "") {
        fs.readFile("index.html", function (error, data) {
            response.end(data);
        });
    }
    else if (queries[0] === "home") {
        let data = "";
        request.on("data", (chunk) => { //здесь приходят данные формы
            data += chunk;
        });
        request.on("end", () => {  //здесь обрабатываются данные формы
            const formData = require("querystring").parse(data);
            let pass = formData.pass;
            client.connect()
                .then(() => console.log("Connected to PostgreSQL for enter"))
                .catch(err => console.error("Connection error", err.stack));
            
            client.query(
                `SELECT (password = crypt('${pass}', password)) 
            AS password_match
            FROM users
            WHERE identifier = 1;`, (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                let validity = result.rows[0].password_match;
                client.end();
                 
                if (validity == true) {
                    fs.readFile("home.html", function (error, data) {
                        response.end(data);
                    });
                } else {
                    response.statusCode = 401;
                    response.end("Invalid password");
                }
            });
        })
    }
    else if (queries[0] === "styles.css") {
        fs.readFile("styles.css", function (error, data) {
            response.end(data);
        });
    }
    else if (queries[0] === "scripts.js") {
        fs.readFile("scripts.js", function (error, data) {
            response.end(data);
        });
    }
    else if (queries[0] == "icons") {
        fs.readFile(reqPath, function (error, data) {
            response.end(data);
        });
    }
    else if (queries[0] == "images") {
        fs.readFile(reqPath, function (error, data) {
            response.end(data);
        });
    }
    else if (queries[0] === "sql") {
        client.connect()
            .then(() => console.log("Connected to PostgreSQL"))
            .catch(err => console.error("Connection error", err.stack));
        client.query('SELECT * FROM orders ORDER BY id_order DESC LIMIT 100', (err, result) => {
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
    else if (queries[0] === "filter") {
        client.connect()
            .then(() => console.log("Connected to PostgreSQL"))
            .catch(err => console.error("Connection error", err.stack));
        client.query(`SELECT * FROM orders WHERE date_in BETWEEN '${queries[1]}' AND '${queries[2]}' ORDER BY id_order DESC;`, (err, result) => {
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
    else if (queries[0] == "more") {
        client.connect()
            .then(() => console.log("Connected to PostgreSQL"))
            .catch(err => console.error("Connection error", err.stack));
        client.query(`SELECT * FROM orders ORDER BY id_order DESC LIMIT 100 OFFSET ${queries[1]}`, (err, result) => {
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
    else if (queries[0] === "add") {
        let formFile = await new formidable.IncomingForm();
        await formFile.parse(request, function (err, fields, files) {
            let formDateOut = "";
            let formComment = "";
            let formDocs = "";
            let formReady = "";
            if (fields.dateOut[0] == "") {
                formDateOut = null;
            }
            else {
                formDateOut = `'${fields.dateOut[0]}'`;
            }
            if (fields.comment[0] == "") {
                formComment = null;
            }
            else {
                formComment = `'${fields.comment[0]}'`;
            }
            if (fields.docs[0] == "") {
                formDocs = null;
            }
            else {
                formDocs = `'${fields.docs[0]}'`;
            }
            if (fields.ready[0] == "") {
                formReady = null;
            }
            else {
                formReady = `'${fields.ready[0]}'`;
            }
            let dataQuery = `INSERT INTO orders (date_in,date_out,job,comment,phone,device,client,docs,ready) VALUES('${fields.dateIn[0]}',
            ${formDateOut},'${fields.job[0]}',${formComment},${fields.phone[0]},'${fields.device[0]}',
            '${fields.client[0]}',${formDocs},${formReady});`;
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
            response.statusCode = 200;
            response.end();
        });
    

    }
    else if (queries[0] === "update") { //данные из изменения элемента таблицы
        
        let formFile = await new formidable.IncomingForm();
        await formFile.parse(request, function (err, fields, files) {
            let id_order = fields.id_order[0];
                       
            Object.defineProperties(fields, {
                id_order: { enumerable: false },
                man: { enumerable: false }
            });
            let element = Object.keys(fields);
            let dataQuery = `UPDATE orders SET ${element[0]} = '${fields[element[0]]}' WHERE id_order = ${id_order};`;
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
            response.statusCode = 200;
            response.end();
        });

        
        
        
        
    }
    else if (queries[0] === "check") {
        let clientId = Number(queries[1]);
        client.connect()
                .then(() => console.log("Checked"))
                .catch(err => console.error("Connection error", err.stack));
        client.query('SELECT id_order FROM orders ORDER BY id_order DESC LIMIT 1;', (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            let id = Number(result.rows[0].id_order);
            if (id !== clientId) {
                response.end("false");
            } else { response.end(); }
            client.end();
        });
}
    else if (queries[0] == "paths") {
        client.connect()
            .then(() => console.log("Connected to PostgreSQL"))
            .catch(err => console.error("Connection error", err.stack));
        client.query('SELECT img FROM orders WHERE id_order =' + queries[1], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Answer SQL complete");
            response.end(result.rows[0].img);
            client.end();
        });
    }
    else if (queries[0] == "upload") {
        let formFile = new formidable.IncomingForm();
        formFile.parse(request, function (err, fields, files) {
            if (Object.keys(fields).length === 0) {
                response.statusCode = 400;
                response.end("Invalid request");
                return
            }
            let id = fields.id_order[0];
            client.connect()
                .then(() => console.log("Connected to PostgreSQL for adding data"))
                .catch(err => console.error("Connection error", err.stack));
            client.query(`SELECT img FROM orders WHERE id_order = ${id};`, (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                let imagePaths = result.rows[0].img;
                save(imagePaths, id, files);
            })
            function save(imagePaths, id, files) { 
            let first;
            if (imagePaths == null) {
                first = 0;
                imagePaths = "";
            } else {
                first = imagePaths.split("*").length - 1;
            }
            for (let i = 0; files.file.length > i; i++) {
                let oldpath = files.file[i].filepath;
                let oldName = files.file[i].originalFilename;
                let point = oldName.lastIndexOf(".");
                let exp = oldName.substring(point);
                let newpath = `${__dirname}/images/${id}_${first + i + 1}${exp}`;
            fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                });
                imagePaths += `images/${id}_${first + i + 1}${exp}*`;
            }
            client.connect()
                .then(() => console.log("Connected to PostgreSQL for adding data"))
                .catch(err => console.error("Connection error", err.stack));
            client.query(`UPDATE orders SET img = '${imagePaths}' WHERE id_order = ${id};`, (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("Adding complete");
                client.end();
            });
            response.statusCode = 200;
            response.end();
            if (err) {
                res.write(err);
                }
            } 
        }
        )
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


    
    
    






