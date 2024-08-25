//window.onerror = () => console.log(error);

//Add a background video if screen is wide
document.addEventListener("DOMContentLoaded", () => {
  if (parseInt(getComputedStyle(document.body)["width"]) > 830) {
    bgVideo(
      "https://videos.pexels.com/video-files/1779257/1779257-hd_1280_720_25fps.mp4",
      ""
    );
  }
})

//
let endPoint = "https://idteizlemebackend.onrender.com";
//
endPoint = "http://localhost:3000";
//endPoint = "https://odd-pear-parrot-gown.cyclic.app/";

//
function isValuePresent(val) {
  return document.getElementsByTagName("html")[0].innerHTML.indexOf(val) > -1;
}

function loadResource(type, url) {
  if (isValuePresent(url)) {
    return;
  }

  //
  let resource = null;
  if (type == "script") {
    resource = document.createElement("script");
    resource.setAttribute("src", url);
    //
    document.body.append(resource);
  } else if (type == "style") {
    resource = document.createElement("link");
    resource.setAttribute("rel", "stylesheet");
    resource.setAttribute("href", url);
    //
    document.getElementsByTagName("head")[0].append(resource);
  } else {
    console.log("type should be either style or script!");
  }
}
// 
let pages = {
  currentPage: "",
}
//
function loadPage(page, params) {
  pages.currentPage = page;
  //
  if (pages[page]) {
    pages[page] = {
      ...pages[page],
      params: params
    }
    pages[page].link();
  }
  else {
    pages[page] = {
      ...pages[page],
      params: params
    }
    loadResource("script", `./Assets/js/pages/${page}.js`);
  }
  //
  //

  //updateRouter(page, params);
}

function getParams() {
  return pages[pages.currentPage].params ? pages[pages.currentPage].params : "";
}

function toggleItem(elem) {
  if (elem.classList.contains("hidden")) {
    elem.classList.remove("hidden");
  }
  else {
    elem.classList.add("hidden");
  }
}

function strToDOM(target, strHTML) {
  let container = document.createElement("template");
  container.innerHTML = strHTML;
  target.append(container.content);
  return target;
}

function nextOnEnter(event) {
  if (event.key == "Enter") {
    if (!event.target.nextElementSibling) {
      event.target.closest(".form").getElementsByClassName("btn-submit")[0].focus();
    }
    else {
      event.target.nextElementSibling.focus();
    }
  }
}

//trim and encode input
function finput(str) {
  return encodeURIComponent(str.trim());
}

function getFormState(formNode) {
  let currentFormBody = {};
  let inputs = [...formNode.querySelectorAll("[name]")];
  let requiredInputs = inputs.filter(item => item.hasAttribute("required"))
  let unFilledRequiredInputs = requiredInputs.filter(item => item.value == "");
  //
  inputs.forEach(item => {
    if (item.getAttribute("type") == "number") {
      return currentFormBody[item.getAttribute("name")] = parseFloat(item.value);
    }
    else {
      return currentFormBody[item.getAttribute("name")] = item.value;
    }
  })

  return {
    currentFormBody: currentFormBody,
    isFormReady: !unFilledRequiredInputs.length,
    inputs: inputs,
    unFilledRequiredInputs: unFilledRequiredInputs
  };
}

function formCheck(formNode) {
  let formState = getFormState(formNode);
  //Form doldurulmadıysa
  if (!formState.isFormReady) {
    //uyarı mesajı
    // formNode.querySelector(".warnArea").innerText = "* ile işaretli alanlar doldurulmalıdır.";
    msgBox("* ile işaretli alanlar doldurulmalıdır.", false, null, "warn");

    //doldurulan alanları temizle
    formState.inputs.forEach(input => input.closest(".inputContainer").getElementsByTagName("p")[0].classList.remove("clr-danger"));

    //doldurulmayan alanları işaretle
    formState.unFilledRequiredInputs.forEach(input => input.closest(".inputContainer").getElementsByTagName("p")[0].classList.add("clr-danger"));

    return false;
  }
  else {
    //uyarı mesajını kaldır
    //formNode.querySelector(".warnArea").innerText = "";
    //doldurulan alanları temizle
    formState.inputs.forEach(input => input.closest(".inputContainer").getElementsByTagName("p")[0].classList.remove("clr-danger"));

    return true;
  }
}

function isStrDigitOnly(str) {
  return !/[^0-9.]/gi.test(str);
}
function digitOnlyInput(event) {
  //
  let inputElem = event.target;
  let value = inputElem.value;
  if (value == "") {
    inputElem.value = "";
  }
}

function inputNumber() {
  return 'type="number" onkeyup="digitOnlyInput(event)"';
}


function createNode(type, innerText, attributes, eventListeners) {
  let elem = document.createElement(type);
  elem.innerText = innerText;
  //
  attributes ? Object.keys(attributes).forEach(key => elem.setAttribute(key, attributes[key])) : "";
  //
  eventListeners ? Object.keys(eventListeners).forEach(key => elem.addEventListener(key, eventListeners[key])) : "";
  //
  return elem;
}

function fillForm(formNode, obj) {
  //console.log(obj);
  let inputsToFill = formNode.querySelectorAll("[name]")

  inputsToFill.forEach(input =>
    input.value = obj[input.getAttribute("name")]
  )
}

function toTranslate(enInputName, trInputName) {

  let enInput = document.querySelectorAll(`[name=${enInputName}]`)[0];
  let trInput = document.querySelectorAll(`[name=${trInputName}]`)[0];

  if (trInput.value == "") {
    msgBox("Çeviri için Türkçe bir metin giriniz.", false, null, "warn");
    trInput.focus();
    return;
  }

  toggleLoader("Çeviri yapılıyor...")
  fetch(
    `${endPoint}/translate/`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ "toBeTranslated": trInput.value })
  }
  )

    .then((res) => res.json())
    .then((data) => {
      toggleLoader();
      if (data.result === 0) {
        msgBox(`Çeviri yapılacak metin en fazla 500 karakter uzunluğunda olmalıdır! (Karakter sayısı: ${trInput.value.length})`, false, null, "fail")
        return;
      }
      enInput.value = data.result;
    });
}

function translateInput({ type, tr, en, isRequired, value }) {

  return /*html */`
    
    <${type == "textarea" ? "textarea" : "input"} 
      name='${en}'
      ${isRequired ? "required" : ""} 
      value='${value}'
    >${type == "textarea" ? "</textarea>" : ""}
    <button class="btn" title="Çeviri için tıklayınız." onclick="toTranslate('${en}', '${tr}')">
      <img src="./Assets/img/translate.png" alt="">
    </button>`
}

function toOptions(arrOfOptObjs, selectedValue) {
  /*
    <select>
          ${toOptions([
        { innerText: "Opt 1", value: "opt1" },
        { innerText: "Opt 2", value: "opt2" },
        { innerText: "Opt 3", value: "opt3" }
      ], "opt3")}
    </select>
  */

  let templateOfOptions = ``;

  for (let opt of arrOfOptObjs) {
    let optLiteral = /*html*/`
      <option 
        value='${opt.value}' 
        ${opt.value == selectedValue ? " selected" : ""}
      >
        ${opt.innerText ? opt.innerText : ""}
      </option>
      `;
    //console.log(optLiteral);
    templateOfOptions += optLiteral;
  }
  return templateOfOptions;
}

function getPageData(idToFindInResult) {

  let pageData = pages[pages.currentPage].data;

  if (idToFindInResult) {
    return pageData.result.filter(item => item._id == idToFindInResult)[0];
  }
  else {
    return pageData;
  }
}

function getRandomNum() {
  return (new Date()).getMilliseconds() + Math.floor(Math.random() * 10000);
}