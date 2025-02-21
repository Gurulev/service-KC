let tooltip = document.querySelector("#tooltip");

let ansServ = document.querySelector("#ansServ");
let addBtn = document.querySelector("#add");
let fieldset = document.querySelector("fieldset");
let manInput = document.querySelector("#manInput");
let manLabel = document.querySelector("#manLabel");
let form = document.querySelector("#formAdd");
let dateInInput = form.querySelector("#dateIn");
let jobInput = form.querySelector("#job");
let phoneInput = form.querySelector("#phone");
let deviceInput = form.querySelector("#device");
let clientInput = form.querySelector("#client");
let docsInput = form.querySelector("#docs");

let addItemCont = document.querySelector("#addItemContainer");
let closeAddItem = document.querySelector("#closeAddItem");
let inputAddItem = document.querySelector("#inputAddItem");
let idOrderItem = document.querySelector("#idOrderItem");
let jobItem = document.querySelector("#jobItem");
let manInputItem = document.querySelector("#manInputItem");
let manLabelItem = document.querySelector("#manLabelItem");
let commentItem = document.querySelector("#commentItem");
let addItem = document.querySelector("#addItem");
let submitAddItem = document.querySelector("#submitAddItem");

let srchInput = document.querySelector("#search");
let searchCont = document.querySelector("#searchCont");
let srchBtn = document.querySelector("#srchBtn");
let outs = document.querySelector("#outs");

let dateStart = document.querySelector("#dateStart");
let dateEnd = document.querySelector("#dateEnd");
let filterBtn = document.querySelector("#filterBtn");
let slideShowBtn = document.querySelector("#slideShowBtn");
let arrPaths = [];
let currentNumb;
let totalImg;
let idForFoto;
let modal = document.querySelector("#myModal");
let slideCont = document.querySelector("#slideshow-container");
let prev = document.querySelector("#prev");
let next = document.querySelector("#next");
let close = document.querySelector("#close");

let moreBtn = document.querySelector("#more");
let topBtn = document.querySelector("#toTop");

let formfilter = document.querySelector("#formFilter");

let colorRow;

const days = [0,"01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17",
            "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];


/*async function add(){
    const response = await fetch("/hello");
    const responseText = await response.text();
    console.log(responseText);
} ---------   шаблон запроса на сервер*/ 
async function requestToSQL() {
    const response = await fetch("/sql");
    const responseText = await response.text();
    const datasql = JSON.parse(responseText);
    let table = "";
    const arrayDatesIn = [];
    const arrayDatesOut = [];
    const arrayDocs = [];
    const arrayReady = [];
    const arrayComments = [];
    const arrayCall = [];
    for (let i = 0; i < datasql.length; i++) {
        let dateIn = datasql[i].date_in;
        let dateOut = datasql[i].date_out;
        let dateDocs = datasql[i].docs;
        let dateReady = datasql[i].ready;
        let com = datasql[i].comment;
        let call = datasql[i].call;
        
        if (dateIn == null) {
            arrayDatesIn.push("");
        } else {
            let dIn = new Date(dateIn);
            let fullDateIn = `${days[dIn.getDate()]}.${months[dIn.getMonth()]}.${dIn.getFullYear()}`;
            arrayDatesIn.push(fullDateIn);
        }
        if (dateOut == null) {
            arrayDatesOut.push("");
        } else {
            let dOut = new Date(dateOut);
            let fullDateOut = `${days[dOut.getDate()]}.${months[dOut.getMonth()]}.${dOut.getFullYear()}`;
            arrayDatesOut.push(fullDateOut);
        }
        if (dateDocs == null) {
            arrayDocs.push("");
        } else {
            let dDocs = new Date(dateDocs);
            switch (dDocs.getFullYear() ) {
                case 1900:
                    arrayDocs.push("у менеджеров");
                break;
                default:
                    let fullDateDocs = `${days[dDocs.getDate()]}.${months[dDocs.getMonth()]}.${dDocs.getFullYear()}`;
                    arrayDocs.push(fullDateDocs);
            }
        }
        if (dateReady == null) {
            arrayReady.push("");
        } else {
            let dReady = new Date(dateReady);
            let fullDateReady = `${days[dReady.getDate()]}.${months[dReady.getMonth()]}.${dReady.getFullYear()}`;
            arrayReady.push(fullDateReady);
        }
        if (com == null) {
            arrayComments.push("");
        } else {
            arrayComments.push(com);
        }
        if (call == null) {
            arrayCall.push("");
        } else {
            let dCall = new Date(call);
            let fullCall = `${days[dCall.getDate()]}.${months[dCall.getMonth()]}.${dCall.getFullYear()}`;
            arrayCall.push(fullCall);
            arrayComments[i] += ` Клиент уведомлен: ${fullCall}.`;
        }

    }   
    
    for (let i = 0; i < datasql.length; i++) {
        let img
        if (datasql[i].img !== null) {
            img = "icons/imgyes.png";
        } else {
            img = "icons/imgno.png";
        }
        table +=
        `<tr>
            <td class="col1">${datasql[i].id_order}</td>
            <td class="col2">${arrayDatesIn[i]}</td>
            <td class="col3">${arrayDatesOut[i]}</td>
            <td class="col4">${datasql[i].job}</td>
            <td class="col5">${arrayComments[i]}</td>
            <td class="col6">${datasql[i].phone}</td>
            <td class="col7">${datasql[i].device}</td>
            <td class="col8">${datasql[i].client}</td>
            <td class="col9">${arrayDocs[i]}</td>
            <td class="col10">${arrayReady[i]}</td>
            <td class="col11">${arrayCall[i]}</td>
            <td class="col12"><img class="foto" src="${img}" alt="foto" style="width:45%"></img></td>
        </tr>`;
    }
    
    ansServ.innerHTML =
    `<tr>
            <th class="col1">Наряд</th>
            <th class="col2">Дата<br>приемки</th>
            <th class="col3">Дата<br>выдачи</th>
            <th class="col4">Работы</th>
            <th class="col5">Комментарии</th>
            <th class="col6">Телефон</th>
            <th class="col7">Аппарат</th>
            <th class="col8">Ф.И.О.</th>
            <th class="col9">Документы</th>
            <th class="col10">Аппарат</th>
            <th class="col11"></th>
            <th class="col12"></th>
        </tr>
        ${table}`;
    // tr background style
   
    let nodeList = document.querySelectorAll("tr");
    for (let i = 1; i < nodeList.length; i++) {
        let row = nodeList[i];
        if (row.children[2].innerText !== "") {
            row.style.backgroundColor = "var(--olive)";
        }
        else if (row.children[8].innerText !== "" && row.children[10].innerText !== "") {
            row.style.backgroundColor = "var(--red)";
        }
        else if (row.children[8].innerText !== "" && row.children[9].innerText !== "" && row.children[10].innerText !== "") {
            row.style.backgroundColor = "var(--red)";
        }   
        else if (row.children[8].innerText !== "" || row.children[9].innerText !== "") {
            row.style.backgroundColor = "var(--yellow)";
        }      
    }
    await setInterval(check, 10000);
}
function fieldsetShow() {
    let fieldsetStatus = fieldset.style.display;
    let previousOrder = document.querySelector("td.col1").innerHTML;
    let nextOrder = Number(previousOrder) + 1;    
    if (fieldsetStatus == "none") {
        document.querySelector("legend").innerHTML = `<b>Новая запись №${nextOrder}</b>`;   
        searchCont.style.display = "none"
        fieldset.style.display = "block";
        fieldset.style.animation = "open 2s ease";
        dateInInput.focus();   
    }
    else {
        fieldset.style.animation = "closed 1s";
        setTimeout(() => { fieldset.style.display = "none"; }, 700);
    }
}
function tooltipShow(event) {
    let target = event.target;
    let text = target.innerHTML;
    let itemClass = target.className;
    let posX = event.clientX;
    let posY = event.clientY;
    if (event.target != event.currentTarget && itemClass == "col8" || itemClass == "col5") {
        tooltip.style.display = "inline-block";    
        tooltip.textContent = text;
        tooltip.style.left = posX + "px";
        tooltip.style.top = posY  + "px";
    }
    event.stopPropagation();
    setTimeout(() => { tooltip.style.display = "none";}, 10000);
}
function disabledDocsItem() {
    if (manInputItem.checked === true) {
        inputAddItem.value = "01.01.1900";
        inputAddItem.style.visibility = "hidden";
    }
    else {
        inputAddItem.value = "";
        inputAddItem.style.visibility = "visible";
    }
}
function disabledDocs() {
    if (manInput.checked === true) {      
        docsInput.value = "01.01.1900";
        docsInput.style.visibility = "hidden";
    }
    else {
        docsInput.value = "";
        docsInput.style.visibility = "visible";
    }
}
function addItemShow(event) {
    let target = event.target;
    let itemClass = target.className;
    let text = target.innerHTML;
    let windWidth = document.documentElement.clientWidth;
    let windHeight = document.documentElement.clientHeight;
    idForFoto = Number(event.target.parentElement.parentElement.firstElementChild.innerHTML);
    let valueIdOrder = Number(target.parentElement.firstElementChild.innerHTML);
    let valueIdOrderAlt = Number(event.target.parentElement.parentElement.firstElementChild.innerHTML);
    let posX = event.clientX;
    let posY = event.clientY;
        
    if (event.target != event.currentTarget) {
        if (valueIdOrder == 0) {
            idOrderItem.value = valueIdOrderAlt;
        } else {
            idOrderItem.value = valueIdOrder;
        }
        addItemCont.style.display = "inline-block";
        switch (itemClass) {
            case "col1":
                addItem.removeAttribute("enctype");
                slideShowBtn.style.display = "none";
                addItem.action = "update";
                submitAddItem.value = "Записать";
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none";
                manInputItem.disabled = true;
                manInputItem.style.display = "none";
                manLabelItem.disabled = true;
                manLabelItem.style.display = "none";
                inputAddItem.type = "datetime";
                inputAddItem.name = "call";
                inputAddItem.placeholder = "Дата оповещения";
                inputAddItem.pattern = "[0-3]{1}[0-9]{1}[.][0-1]{1}[0-9]{1}[.][0-9]{4}";
                inputAddItem.title = "дд.мм.гггг";
                break;
            case "col2":
                addItem.removeAttribute("enctype");
                slideShowBtn.style.display = "none";
                addItem.action = "update";
                submitAddItem.value = "Записать";
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none";
                manInputItem.disabled = true;
                manInputItem.style.display = "none";
                manLabelItem.disabled = true;
                manLabelItem.style.display = "none";
                inputAddItem.type = "datetime";
                inputAddItem.name = "date_in";
                inputAddItem.placeholder = "Дата приема";
                inputAddItem.pattern = "[0-3]{1}[0-9]{1}[.][0-1]{1}[0-9]{1}[.][0-9]{4}";
                inputAddItem.title = "дд.мм.гггг";
                break;
            case "col3":
                addItem.removeAttribute("enctype");
                slideShowBtn.style.display = "none";
                addItem.action = "update";
                submitAddItem.value = "Записать";
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none";
                manInputItem.disabled = true;
                manInputItem.style.display = "none";
                manLabelItem.disabled = true;
                manLabelItem.style.display = "none";
                inputAddItem.type = "datetime";
                inputAddItem.name = "date_out";
                inputAddItem.placeholder = "Дата выдачи";
                inputAddItem.pattern = "[0-3]{1}[0-9]{1}[.][0-1]{1}[0-9]{1}[.][0-9]{4}";
                inputAddItem.title = "дд.мм.гггг";
                break;
            case "col4":
                addItem.removeAttribute("enctype");
                slideShowBtn.style.display = "none";
                addItem.action = "update";
                submitAddItem.value = "Записать";
                inputAddItem.disabled = true;
                inputAddItem.style.display = "none";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                manInputItem.disabled = true;
                manInputItem.style.display = "none";
                manLabelItem.disabled = true;
                manLabelItem.style.display = "none";
                inputAddItem.type = "datetime";
                jobItem.disabled = false;
                jobItem.style.display = "initial";
                break;
            case "col5":
                addItem.removeAttribute("enctype");
                slideShowBtn.style.display = "none";
                addItem.action = "update";
                submitAddItem.value = "Записать";
                inputAddItem.disabled = true;
                inputAddItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none";
                manInputItem.disabled = true;
                manInputItem.style.display = "none";
                manLabelItem.disabled = true;
                manLabelItem.style.display = "none";
                commentItem.style.display = "initial";
                commentItem.disabled = false;
                commentItem.value = text;
                commentItem.focus();
                break;
            case "col6":
                addItem.removeAttribute("enctype");
                slideShowBtn.style.display = "none";
                addItem.action = "update";
                submitAddItem.value = "Записать";
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none";
                manInputItem.disabled = true;
                manInputItem.style.display = "none";
                manLabelItem.disabled = true;
                manLabelItem.style.display = "none";
                inputAddItem.type = "tel";
                inputAddItem.name = "phone";
                inputAddItem.maxLength = "10";
                inputAddItem.placeholder = "Телефон без 8";
                inputAddItem.pattern = "[9]{1}[0-9]{9}";
                inputAddItem.title = "9#########";
                break;
            case "col7":
                addItem.removeAttribute("enctype");
                slideShowBtn.style.display = "none";
                addItem.action = "update";
                submitAddItem.value = "Записать";
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none";
                manInputItem.disabled = true;
                manInputItem.style.display = "none";
                manLabelItem.disabled = true;
                manLabelItem.style.display = "none";
                inputAddItem.type = "text";
                inputAddItem.name = "device";
                inputAddItem.placeholder = "Аппарат";
                inputAddItem.removeAttribute("pattern");
                inputAddItem.removeAttribute("title");
                break;
            case "col8":
                addItem.removeAttribute("enctype");
                slideShowBtn.style.display = "none";
                addItem.action = "update";
                submitAddItem.value = "Записать";
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none";
                manInputItem.disabled = true;
                manInputItem.style.display = "none";
                manLabelItem.disabled = true;
                manLabelItem.style.display = "none";
                inputAddItem.type = "text";
                inputAddItem.name = "client";
                inputAddItem.removeAttribute("pattern");
                inputAddItem.removeAttribute("title");
                inputAddItem.placeholder = "Ф.И.О. клиента";
                break;
            case "col9":
                addItem.removeAttribute("enctype");
                slideShowBtn.style.display = "none";
                addItem.action = "update";
                submitAddItem.value = "Записать";
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none";
                manInputItem.disabled = false;
                manInputItem.style.display = "initial";
                manLabelItem.disabled = false;
                manLabelItem.style.display = "initial";
                inputAddItem.type = "datetime";
                inputAddItem.name = "docs";
                inputAddItem.placeholder = "Документы";
                inputAddItem.pattern = "[0-3]{1}[0-9]{1}[.][0-1]{1}[0-9]{1}[.][0-9]{4}";
                inputAddItem.title = "дд.мм.гггг";
                break;
            case "col10":
                addItem.removeAttribute("enctype");
                slideShowBtn.style.display = "none";
                addItem.action = "update";
                submitAddItem.value = "Записать";
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none";
                manInputItem.disabled = true;
                manInputItem.style.display = "none";
                manLabelItem.disabled = true;
                manLabelItem.style.display = "none";
                inputAddItem.type = "datetime";
                inputAddItem.name = "ready";
                inputAddItem.placeholder = "Дата готовности";
                inputAddItem.pattern = "[0-3]{1}[0-9]{1}[.][0-1]{1}[0-9]{1}[.][0-9]{4}";
                inputAddItem.title = "дд.мм.гггг";
                break;
            case "foto":
                
                if (itemClass == "foto" && target.getAttribute("src") == "icons/imgyes.png") {
                    slideShowBtn.style.display = "block";
                    submitAddItem.value = "Добавить";
                    
                }
                else {
                    slideShowBtn.style.display = "none";
                    submitAddItem.value = "Загрузить";
                }
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none";
                manInputItem.disabled = true;
                manInputItem.style.display = "none";
                manLabelItem.disabled = true;
                manLabelItem.style.display = "none";
                inputAddItem.type = "file";
                inputAddItem.name = "file";
                inputAddItem.multiple = true;
                inputAddItem.removeAttribute("pattern");
                inputAddItem.removeAttribute("title");
                inputAddItem.removeAttribute("placeholder");
                addItem.enctype = "multipart/form-data";
                addItem.action = "upload";
                
                break;
            default:
                break;
        }
        let widthItem = addItemCont.offsetWidth;
        let heightItem = addItemCont.offsetHeight;
        
        
        if (posX + widthItem > windWidth) {         
            posX = (windWidth - widthItem) / 1.02;                       
        }
        if (posY + heightItem > windHeight) {
            posY = (windHeight - heightItem) / 1.02;
        }
        addItemCont.style.left = posX + "px";
        addItemCont.style.top = posY + "px";
        inputAddItem.focus();
        
    }
    event.stopPropagation();
}
function addItemHide(event) {
    event.preventDefault();
    addItemCont.style.display = "none";
}
function bgRowHover(event) {
    let el = event.target.parentElement;
    if (el.tagName == "TR") {
        colorRow = el.style.backgroundColor;
        el.style.backgroundColor = "var(--turquoise)"
        el.style.boxShadow = "0 0 10px var(--gray)";
    }
}
function bgRowOut(event) {
    let el = event.target.parentElement;
    if (el.tagName == "TR") {
        el.style.backgroundColor = colorRow;
        el.style.boxShadow = "none";
    }
}
function search() {
    let filter = srchInput.value.toUpperCase();
    let tr = ansServ.querySelectorAll("tr");
    for (i = 0; i < tr.length; i++) {
        let tdOrd = tr[i].querySelectorAll("td")[0];
        let tdPh = tr[i].querySelectorAll("td")[5];
        let tdCl = tr[i].querySelectorAll("td")[7];
      if (tdOrd, tdPh, tdCl) {
          let txtValueOrd = tdOrd.textContent || tdOrd.innerText;
          let txtValuePh = tdPh.textContent || tdPh.innerText;
          let txtValueCl = tdCl.textContent || tdCl.innerText;
        if (txtValueOrd.toUpperCase().indexOf(filter) > -1 ||txtValuePh.toUpperCase().indexOf(filter) > -1 || txtValueCl.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
}
function outsOrders() {
    if (outs.checked === true) {
        let tr = ansServ.querySelectorAll("tr");
        for (i = 0; i < tr.length; i++) {
            let tdOrd = tr[i].querySelectorAll("td")[2];
            if (tdOrd) {
                let txtValueOrd = tdOrd.textContent || tdOrd.innerText;
                if (txtValueOrd !== "") {
                    tr[i].style.display = "none";
                } else {
                    tr[i].style.display = "";
                }
            }
        }
    } else { requestToSQL(); }
}            
function searchShow() {
    let srchStatus = searchCont.style.display;
    if (srchStatus == "none") {
        fieldset.style.display = "none";
        searchCont.style.display = "block";
        srchInput.focus();
        outs.style.margin = "0.3em 0.3em 0.3em 2em"
    }
    else {
        searchCont.style.display = "none";
    }
}
async function modalShow() {
    addItemCont.style.display = "none";
    const response = await fetch("/paths/" + idForFoto);
    const responseText = await response.text();
    modal.style.display = "block";
    arrPaths = responseText.split("*");
    totalImg = arrPaths.length - 1;
    slideCont.innerHTML =
    `<div class="myslides fade">
    <div id="numberText">1/${totalImg}</div>
    <img id="modal-content" src="${arrPaths[0]}" alt="img">
    <div id="text">${arrPaths[0].substring(arrPaths[0].lastIndexOf("/") + 1)}</div>
    </div>
    <a id="prev">&#10094;</a>
    <a id="next">&#10095;</a>
    <span id="close">&times;</span>
    </div>`;
        document.querySelector("#next").addEventListener("click", nextImg, false);
        document.querySelector("#prev").addEventListener("click", prevImg, false);
        document.querySelector("#close").addEventListener("click", modalClose, false);
        currentNumb = 1;
}   
function nextImg() {
    if (totalImg > currentNumb) {
        let nextNumb = currentNumb + 1;
        document.querySelector("#numberText").innerHTML = `${nextNumb++}/${totalImg}`;
        document.querySelector("#modal-content").src = arrPaths[currentNumb];
        document.querySelector("#text").innerHTML = `${arrPaths[currentNumb].substring(arrPaths[currentNumb].lastIndexOf("/") + 1)}`;
        currentNumb = currentNumb + 1;
    } else {
        return
    }
}
function prevImg() {
    if (currentNumb>1) {
        let prevNumb = currentNumb - 1;
        document.querySelector("#numberText").innerHTML = `${prevNumb--}/${totalImg}`;
        document.querySelector("#modal-content").src = arrPaths[prevNumb];
        document.querySelector("#text").innerHTML = `${arrPaths[prevNumb].substring(arrPaths[prevNumb].lastIndexOf("/") + 1)}`;
        currentNumb = currentNumb - 1;
    } else {
        return
    }
}
function modalClose() {
    modal.style.display = "none";
}
async function more() {
        let tblRows = ansServ.querySelectorAll("tr").length - 1;
        const response = await fetch(`/more/${tblRows}`);
        const responseText = await response.text();
        const datasql = JSON.parse(responseText);
        let table = "";
        const arrayDatesIn = [];
        const arrayDatesOut = [];
        const arrayDocs = [];
        const arrayReady = [];
        const arrayComments = [];
        const arrayCall = [];
        for (let i = 0; i < datasql.length; i++) {
            let dateIn = datasql[i].date_in;
            let dateOut = datasql[i].date_out;
            let dateDocs = datasql[i].docs;
            let dateReady = datasql[i].ready;
            let com = datasql[i].comment;
            let call = datasql[i].call;
            
            if (dateIn == null) {
                arrayDatesIn.push("");
            } else {
                let dIn = new Date(dateIn);
                let fullDateIn = `${days[dIn.getDate()]}.${months[dIn.getMonth()]}.${dIn.getFullYear()}`;
                arrayDatesIn.push(fullDateIn);
            }
            if (dateOut == null) {
                arrayDatesOut.push("");
            } else {
                let dOut = new Date(dateOut);
                let fullDateOut = `${days[dOut.getDate()]}.${months[dOut.getMonth()]}.${dOut.getFullYear()}`;
                arrayDatesOut.push(fullDateOut);
            }
            if (dateDocs == null) {
                arrayDocs.push("");
            } else {
                let dDocs = new Date(dateDocs);
                switch (dDocs.getFullYear() ) {
                    case 1900:
                        arrayDocs.push("у менеджеров");
                    break;
                    default:
                        let fullDateDocs = `${days[dDocs.getDate()]}.${months[dDocs.getMonth()]}.${dDocs.getFullYear()}`;
                        arrayDocs.push(fullDateDocs);
                }
            }
            if (dateReady == null) {
                arrayReady.push("");
            } else {
                let dReady = new Date(dateReady);
                let fullDateReady = `${days[dReady.getDate()]}.${months[dReady.getMonth()]}.${dReady.getFullYear()}`;
                arrayReady.push(fullDateReady);
            }
            if (com == null) {
                arrayComments.push("");
            } else {
                arrayComments.push(com);
            }
            if (call == null) {
                arrayCall.push("");
            } else {
                let dCall = new Date(call);
                let fullCall = `${days[dCall.getDate()]}.${months[dCall.getMonth()]}.${dCall.getFullYear()}`;
                arrayCall.push(fullCall);
                arrayComments[i] += ` Клиент уведомлен: ${fullCall}.`;
            }
    
        }   
        
        for (let i = 0; i < datasql.length; i++) {
            let img
            if (datasql[i].img !== null) {
                img = "icons/imgyes.png";
            } else {
                img = "icons/imgno.png";
            }
            table +=
            `<tr>
                <td class="col1">${datasql[i].id_order}</td>
                <td class="col2">${arrayDatesIn[i]}</td>
                <td class="col3">${arrayDatesOut[i]}</td>
                <td class="col4">${datasql[i].job}</td>
                <td class="col5">${arrayComments[i]}</td>
                <td class="col6">${datasql[i].phone}</td>
                <td class="col7">${datasql[i].device}</td>
                <td class="col8">${datasql[i].client}</td>
                <td class="col9">${arrayDocs[i]}</td>
                <td class="col10">${arrayReady[i]}</td>
                <td class="col11">${arrayCall[i]}</td>
                <td class="col12"><img class="foto" src="${img}" alt="foto" style="width:45%"></img></td>
            </tr>`;
        }
        
        ansServ.innerHTML += table;
        // tr background style
       
        let nodeList = document.querySelectorAll("tr");
        for (let i = 1; i < nodeList.length; i++) {
            let row = nodeList[i];
            if (row.children[2].innerText !== "") {
                row.style.backgroundColor = "var(--olive)";
            }
            else if (row.children[8].innerText !== "" && row.children[10].innerText !== "") {
                row.style.backgroundColor = "var(--red)";
            }
            else if (row.children[8].innerText !== "" && row.children[9].innerText !== "" && row.children[10].innerText !== "") {
                row.style.backgroundColor = "var(--red)";
            }   
            else if (row.children[8].innerText !== "" || row.children[9].innerText !== "") {
                row.style.backgroundColor = "var(--yellow)";
            }      
        }
}
function scrollFunc() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      topBtn.style.display = "block";
    } else {
      topBtn.style.display = "none";
    }
}
function totopFunc() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
async function filter() {
        
    const response = await fetch(`/filter/${dateStart.value}/${dateEnd.value}`);
    const responseText = await response.text();
    const datasql = JSON.parse(responseText);
    let table = "";
    const arrayDatesIn = [];
    const arrayDatesOut = [];
    const arrayDocs = [];
    const arrayReady = [];
    const arrayComments = [];
    const arrayCall = [];
    for (let i = 0; i < datasql.length; i++) {
        let dateIn = datasql[i].date_in;
        let dateOut = datasql[i].date_out;
        let dateDocs = datasql[i].docs;
        let dateReady = datasql[i].ready;
        let com = datasql[i].comment;
        let call = datasql[i].call;
        
        if (dateIn == null) {
            arrayDatesIn.push("");
        } else {
            let dIn = new Date(dateIn);
            let fullDateIn = `${days[dIn.getDate()]}.${months[dIn.getMonth()]}.${dIn.getFullYear()}`;
            arrayDatesIn.push(fullDateIn);
        }
        if (dateOut == null) {
            arrayDatesOut.push("");
        } else {
            let dOut = new Date(dateOut);
            let fullDateOut = `${days[dOut.getDate()]}.${months[dOut.getMonth()]}.${dOut.getFullYear()}`;
            arrayDatesOut.push(fullDateOut);
        }
        if (dateDocs == null) {
            arrayDocs.push("");
        } else {
            let dDocs = new Date(dateDocs);
            switch (dDocs.getFullYear() ) {
                case 1900:
                    arrayDocs.push("у менеджеров");
                break;
                default:
                    let fullDateDocs = `${days[dDocs.getDate()]}.${months[dDocs.getMonth()]}.${dDocs.getFullYear()}`;
                    arrayDocs.push(fullDateDocs);
            }
        }
        if (dateReady == null) {
            arrayReady.push("");
        } else {
            let dReady = new Date(dateReady);
            let fullDateReady = `${days[dReady.getDate()]}.${months[dReady.getMonth()]}.${dReady.getFullYear()}`;
            arrayReady.push(fullDateReady);
        }
        if (com == null) {
            arrayComments.push("");
        } else {
            arrayComments.push(com);
        }
        if (call == null) {
            arrayCall.push("");
        } else {
            let dCall = new Date(call);
            let fullCall = `${days[dCall.getDate()]}.${months[dCall.getMonth()]}.${dCall.getFullYear()}`;
            arrayCall.push(fullCall);
            arrayComments[i] += ` Клиент уведомлен: ${fullCall}.`;
        }

    }   
    
    for (let i = 0; i < datasql.length; i++) {
        let img
        if (datasql[i].img !== null) {
            img = "icons/imgyes.png";
        } else {
            img = "icons/imgno.png";
        }
        table +=
        `<tr>
            <td class="col1">${datasql[i].id_order}</td>
            <td class="col2">${arrayDatesIn[i]}</td>
            <td class="col3">${arrayDatesOut[i]}</td>
            <td class="col4">${datasql[i].job}</td>
            <td class="col5">${arrayComments[i]}</td>
            <td class="col6">${datasql[i].phone}</td>
            <td class="col7">${datasql[i].device}</td>
            <td class="col8">${datasql[i].client}</td>
            <td class="col9">${arrayDocs[i]}</td>
            <td class="col10">${arrayReady[i]}</td>
            <td class="col11">${arrayCall[i]}</td>
            <td class="col12"><img class="foto" src="${img}" alt="foto" style="width:45%"></img></td>
        </tr>`;
    }
    
    ansServ.innerHTML =
    `<tr>
            <th class="col1">Наряд</th>
            <th class="col2">Дата<br>приемки</th>
            <th class="col3">Дата<br>выдачи</th>
            <th class="col4">Работы</th>
            <th class="col5">Комментарии</th>
            <th class="col6">Телефон</th>
            <th class="col7">Аппарат</th>
            <th class="col8">Ф.И.О.</th>
            <th class="col9">Документы</th>
            <th class="col10">Аппарат</th>
            <th class="col11"></th>
            <th class="col12"></th>
        </tr>
        ${table}`;
    // tr background style
   
    let nodeList = document.querySelectorAll("tr");
    for (let i = 1; i < nodeList.length; i++) {
        let row = nodeList[i];
        if (row.children[2].innerText !== "") {
            row.style.backgroundColor = "var(--olive)";
        }
        else if (row.children[8].innerText !== "" && row.children[10].innerText !== "") {
            row.style.backgroundColor = "var(--red)";
        }
        else if (row.children[8].innerText !== "" && row.children[9].innerText !== "" && row.children[10].innerText !== "") {
            row.style.backgroundColor = "var(--red)";
        }   
        else if (row.children[8].innerText !== "" || row.children[9].innerText !== "") {
            row.style.backgroundColor = "var(--yellow)";
        }      
    }
}
async function check() {
    let id = ansServ.children[1].children[0].innerText;
    const response = await fetch(`/check/${id}`);
    const responseText = await response.text();
    if (responseText == "false") {
        alert("В базе произошли изменения! Обновите страницу!");
    }
}
addItem.addEventListener("submit", async function (evt) {
    evt.preventDefault();
    let action = addItem.getAttribute("action");
    const formData = new FormData(addItem);
    console.log(action);
    const response = await fetch(`/${action}`, {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (response.status == 200) {
                addItem.reset();
                addItemCont.style.display = "none";
                requestToSQL();
            };
        })
        .catch((error) => {
            alert(error);
        });
    
});
form.addEventListener("submit", async function (evt) {
    evt.preventDefault();
    const formData = new FormData(form);
    let dateIn = dateInInput.value;
    let phone = phoneInput.value;
    let device = deviceInput.value;
    let client = clientInput.value;
    if (!dateIn || !job || !phone || !device || !client) {
        alert("Заполните обязательные поля!");
        return;
    }
    const response = await fetch("/add", {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            requestToSQL();
            if (response.status == 200) {
            form.reset();
            fieldset.style.animation = "closed 1s";
            setTimeout(() => { fieldset.style.display = "none"; }, 700);
            
        };
        })
        .catch((error) => {
            alert(error);
        });
});





document.addEventListener("DOMContentLoaded", requestToSQL, false);
addBtn.addEventListener("click", fieldsetShow,false);
manInput.addEventListener("click", disabledDocs);
ansServ.addEventListener("mouseover", tooltipShow, false);
ansServ.addEventListener("dblclick", addItemShow, false);
closeAddItem.addEventListener("click", addItemHide, false);
manInputItem.addEventListener("click", disabledDocsItem);
ansServ.addEventListener("mouseover", bgRowHover, false);
ansServ.addEventListener("mouseout", bgRowOut, false);
srchInput.addEventListener("keyup", search);
srchBtn.addEventListener("click", searchShow, false);
outs.addEventListener("click", outsOrders, false);
moreBtn.addEventListener("click", more, false);
topBtn.addEventListener("click", totopFunc, false);
window.onscroll = function () { scrollFunc() };
filterBtn.addEventListener("click", filter, false);
slideShowBtn.addEventListener("click", modalShow, false);
