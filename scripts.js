let ansServ = document.querySelector("#ansServ");
let addBtn = document.querySelector("#add");
let fieldset = document.querySelector("fieldset");
let tooltip = document.querySelector("#tooltip");
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
let srchInput = document.querySelector("#search");
let srchBtn = document.querySelector("#srchBtn");
let colorRow;

const revision = new EventSource("/check");
revision.onmessage = (event) => {
  //Здесь обработка ответа сеервера
    alert(event.data);
};

const days = [0,"01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17",
            "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    
    let dateIn = dateInInput.value;
    let phone = phoneInput.value;
    let device = deviceInput.value;
    let client = clientInput.value;
    if (!dateIn || !job || !phone || !device || !client) {
        alert("Заполните обязательные поля!");
        return;
    }
    form.submit();
    let btn = this.querySelector("input[type=submit]");
    btn.disabled = true; //--- предотвращение повторного нажатия на кнопку отправки
    });

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
        </tr>`;
    }
    
    ansServ.innerHTML =
    `<tr>
            <th class="col1">Наряд</th>
            <th class="col2">Дата приемки</th>
            <th class="col3">Дата выдачи</th>
            <th class="col4">Работы</th>
            <th class="col5">Комментарии</th>
            <th class="col6">Телефон</th>
            <th class="col7">Аппарат</th>
            <th class="col8">Ф.И.О.</th>
            <th class="col9">Документы</th>
            <th class="col10">Аппарат</th>
            <th class="col11"></th>
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
function fieldsetShow() {
    let fieldsetStatus = fieldset.style.display;
    let previousOrder = document.querySelector("td.col1").innerHTML;
    let nextOrder = Number(previousOrder) + 1;    
    if (fieldsetStatus == "none") {
        document.querySelector("legend").innerHTML = `<b>Новая запись №${nextOrder}</b>`;   
        srchInput.style.display = "none"
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
    console.log(manInput.checked);
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
    let windWidth = document.documentElement.clientWidth;
    let windHeight = document.documentElement.clientHeight;
    let target = event.target;
    let text = target.innerHTML;
    let itemClass = target.className;
    let valueIdOrder = Number(target.parentElement.firstElementChild.innerHTML);
    console.log();
    let posX = event.clientX;
    let posY = event.clientY;
        
    if (event.target != event.currentTarget) {
        idOrderItem.value = valueIdOrder;
        addItemCont.style.display = "inline-block";
        switch (itemClass) {
            case "col1":
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none"
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
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none"
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
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none"
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
                inputAddItem.disabled = true;
                inputAddItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none"
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
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none"
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
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none"
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
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none"
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
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none"
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
                inputAddItem.disabled = false;
                inputAddItem.style.display = "initial";
                commentItem.disabled = true;
                commentItem.style.display = "none";
                jobItem.disabled = true;
                jobItem.style.display = "none"
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
        //.textContent = text;
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
    let search = document.querySelector("#search");
    let filter = search.value.toUpperCase();
    let table = document.querySelector("#ansServ");
    let tr = table.querySelectorAll("tr");
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
function searchShow() {
    let srchStatus = srchInput.style.display;
    if (srchStatus == "none") {
        fieldset.style.display = "none";
        srchInput.style.display = "block";
        srchInput.focus();        
    }
    else {
        srchInput.style.display = "none";
    }

}



  
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
