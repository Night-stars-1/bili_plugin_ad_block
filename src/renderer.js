/*
 *Author: Night-stars-1 nujj1042633805@gmail.com
 *Date: 2024-11-08 23:42:20
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-11-09 18:56:18
 */
const upRelation = new Map();
regXhrAfter("x/web-interface/relation", (response) => {
  const url = response.responseURL;
  const upUid = url.split("mid=")[1].split("&")[0];
  const result = JSON.parse(response.responseText);
  const relation = result.data.relation;
  upRelation.set(upUid, relation);
  return false;
});

regFetchAfter("x/web-interface/wbi/index/top/feed/rcmd", async (response) => {
  const result = await response.json();
  result.data.item = result.data.item.filter((item) => item.goto != "ad");
  return result;
});

function getCookieValue(name) {
  // 使用正则表达式查找指定的 Cookie 名
  const match = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return match ? match.pop() : null; // 返回匹配到的值或 null
}

/**
 * 拉黑Up
 * @param {*} data
 * @param {*} isBlack 是否拉黑，true为拉黑
 */
function blackUp(data, isBlack) {
  const fid = data.upid;
  const csrf = getCookieValue("bili_jct");
  fetch("https://api.bilibili.com/x/relation/modify", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN",
      "content-type": "application/x-www-form-urlencoded",
      priority: "u=1, i",
      "sec-ch-ua": '"Not?A_Brand";v="99", "Chromium";v="130"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-app-version": "1.15.2",
    },
    referrer: "https://www.bilibili.com/client",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `fid=${fid}&act=${
      isBlack ? 5 : 6
    }&re_src=11&cross_domain=true&csrf=${csrf}`,
    method: "POST",
    mode: "cors",
    credentials: "include",
  }).then(async (response) => {
    const result = await response.json();
    const code = result.code;
    if (code != 0) return;
    const blackDiv = document.querySelector(`.black-${fid}-text`);
    if (blackDiv) {
      blackDiv.textContent = isBlack ? "取消拉黑" : "拉黑";
    }
  });
}
window.addEventListener("load", () => {
  let ugcUpUid;
  if (location.pathname == "/player.html") {
    vueEvent.on("on-vue-create", (component) => {
      component.onMounted(() => {
        if (component?.type?.__name == "UgcUp") {
          ugcUpUid = component.uid;
        }
        if (
          ugcUpUid &&
          component?.subTree?.props?.class ==
            "vui_dropdown vui_dropdown-is-bottom-start"
        ) {
          const ugcUpComponent = __VUE_IDS__.get(ugcUpUid)[0];
          const data = ugcUpComponent.scope.effects[0].computed.value;
          const relation = upRelation.get(data.upid);
          const isBlack = relation.attribute == 128;
          /**
           * @type {Element}
           */
          const el = component?.subTree.el;
          const ddSelectContent = el.querySelector(".dropdown-select-content");
          const button = document.createElement("li");
          button.classList.add("dropdown-select-option");
          button.innerHTML = `
          <span class="item-icon flex_center">
          <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="23" fill="#FFFFFF"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z"/></svg>
          </span>
          <div class="black-${data.upid}-text">${
            isBlack ? "取消拉黑" : "拉黑"
          }</div>`;
          button.onclick = () => blackUp(data, !isBlack);
          ddSelectContent.appendChild(button);
          const test = true;
        }
      });
    });
  }
});
