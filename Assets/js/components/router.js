//router & history
document.addEventListener("DOMContentLoaded", () => {
  pages.history = [];
})
function parseUrl() {
  let url = decodeURIComponent(location.hash);
  let mark = url.indexOf("?");
  let page = "";
  let paramsStr = "";
  let params = {};
  //Parametre yoksa
  if (mark == -1) {
    page = url.slice(1);
    paramsStr = null;
  }
  //Parametre varsa
  else {
    page = url.slice(1, mark);
    paramsStr = url.slice(mark).slice(1);
    let paramsArr = paramsStr.split("&");

    for (let param of paramsArr) {
      param = param.split("=");
      params[param[0]] = param[1];
    }
  }
  return { page: page, params: params };
}

function applyUrl() {
  if (location.hash[0] != "#") {
    return
  }

  let page = parseUrl().page;
  let params = parseUrl().params;

  loadPage(page, params);
}

window.addEventListener("DOMContentLoaded", () => {
  applyUrl();
})

window.onhashchange = (event) => {
  applyUrl();
}

function updateRouter(pageName, params) {
  //console.log(pageName, params);
  let url = `#${pageName}`;

  //parametre yoksa
  if (params) {
    let paramsUrlStr = "";
    for (let key in params) {
      paramsUrlStr += `${key}=${params[key]}&`;
    }
    paramsUrlStr = paramsUrlStr.slice(0, -1);
    url = url + `?${paramsUrlStr}`;
  }

  location.hash = url;
}