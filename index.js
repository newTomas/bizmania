// ==UserScript==
// @name         bizmania
// @namespace    http://tampermonkey.net/
// @version      2024-03-08
// @description  try to take over the world!
// @author       You
// @match        https://bizmania.ru/units/shop/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bizmania.ru
// @updateURL    https://raw.githubusercontent.com/newTomas/bizmania/main/index.js
// @downloadURL  https://raw.githubusercontent.com/newTomas/bizmania/main/index.js
// @grant        none
// ==/UserScript==

//Вкладка снабжения
function supply(){
    [...document.querySelectorAll("#goods tbody > tr")].forEach(e => {
        let haveEl = e.childNodes[9];
        let have = parseInt(e.childNodes[9].innerText.replace(" ", ""));
        let needEl = e.childNodes[12].querySelector("input");
        let need = parseInt(e.childNodes[12].querySelector("input").value.replace(" ", ""));
        if(have < need) {
            haveEl.style.backgroundColor = "#CD5C5C";

            //Это чтобы при пополнении склада убрать красный фон. Проще отловить изменения html кода чем запрос
            var observer = new MutationObserver(function(mutations) {
                haveEl.style.backgroundColor = "";
                observer.disconnect();
            });

            var config = {characterData: true, subtree: true, childList: true, attributes: true, attributeOldValue: true, };
            observer.observe(haveEl, config);
        }
    });
}

//Вкладка подразделения
function divisions(){
    [...document.querySelectorAll(".goods > tbody > tr:nth-child(odd)")].forEach(e => {
        const level = +e.querySelector("td > span").innerText.replace("Уровень ", "");
        const tBody = e.querySelector("td:nth-child(3) tbody");
        const profitEl = tBody.querySelector("tr:nth-last-child(1)");
        const profit = parseInt(profitEl.innerText.slice(19).replaceAll(" ", ""));
        const profitPerLevel = Math.floor(profit / level);
        const newTr = profitEl.cloneNode(true);
        newTr.querySelector("td:nth-child(1)").innerText = "Прибыль/лвл :";
        newTr.querySelector("td:nth-child(2)").innerText = `${profitPerLevel.toLocaleString()} p.`;
        tBody.appendChild(newTr);
    });
}

//После выбора конкретного подразделения
function division(){
    const tBody = document.querySelector(".infotable > tbody");
    const levelText = document.querySelector(".dualbox .level").innerText.split("+");
    let level = +levelText[0];
    const profit = parseInt(tBody.querySelector("tr:nth-last-child(2) td:nth-last-child(1)").innerText.replaceAll(" ", ""));
    const profitPerLevel = Math.floor(profit / level);
    console.log(profit, level);
    const newTd = tBody.querySelector("tr:nth-last-child(1)");
    newTd.querySelector("td:nth-last-child(2)").innerText = "Прибыль/лвл:";
    newTd.querySelector("td:nth-last-child(1)").innerText = `${profitPerLevel.toLocaleString()} p.`;
    newTd.querySelector("td:nth-last-child(1)").align = "right";
}

(function() {
    'use strict';

    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");
    switch(tab){
        case "supply": supply(); break;
        case "divisions": {
            if(searchParams.has("division")) division();
            else divisions();
            break;
        }
    }
})();
