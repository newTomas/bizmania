// ==UserScript==
// @name         bizmania
// @version      2024-06-11
// @description  Расширение возможностей bizmania
// @author       newTomas
// @match        https://bizmania.ru/units/shop*
// @match        https://bizmania.ru/person*
// @match        https://bizmania.ru/company*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bizmania.ru
// @homepageURL  https://github.com/newTomas/bizmania/
// @updateURL    https://raw.githubusercontent.com/newTomas/bizmania/main/bizmania.user.js
// @downloadURL  https://raw.githubusercontent.com/newTomas/bizmania/main/bizmania.user.js
// @grant        none
// ==/UserScript==

const characters = [["Оптовая торговля", 60], ["Торговля", 450], ["Производство", 500], ["Добыча ископаемых", 350], ["Сельское хозяйство", 150], ["Строительство", 250], ["Энергетика", 60], ["Наука", 750], ["Продукты питания", 75], ["Промтовары", 75], ["Электроника", 75], ["Автотовары", 75], ["Стройматериалы", 75], ["Одежда", 75], ["Предметы роскоши", 75], ["Аптеки", 75], ["Спорттовары", 75], ["Детские товары", 75], ["Рестораны", 75], ["Производство стройматериалов", 90], ["Пищевое производство", 90], ["Легкая промышленность", 90], ["Машиностроение", 90], ["Металлургия", 90], ["Электроника", 90], ["Химия", 90], ["Фармацевтика", 90], ["Спортивные товары", 90], ["Нефтедобыча", 150], ["Добыча руды", 150], ["Карьерная добыча", 150], ["Земледелие", 60], ["Животноводство", 60], ["Теплицы", 60], ["Пищевая промышленность", 75], ["Легкая промышленность", 75], ["Химическая промышленность", 75], ["Электроника", 75], ["Легкое машиностроение", 75], ["Тяжелое машиностроение", 75], ["Металлургия", 75], ["Ювелирное мастерство", 75], ["Добывающая промышленность", 75], ["Деревообработка", 75], ["Строительные материалы", 75], ["Стекольная промышленность", 75], ["Лекарства", 75], ["Спорт", 75]];

//Вкладка снабжения
function supply() {
    [...document.querySelectorAll("#goods tbody > tr")].forEach(e => {
        let haveEl = e.childNodes[9];
        let have = parseInt(e.childNodes[9].innerText.replace(" ", ""));
        let needEl = e.childNodes[12].querySelector("input");
        let need = parseInt(e.childNodes[12].querySelector("input").value.replace(" ", ""));
        if (have < need) {
            haveEl.style.backgroundColor = "#CD5C5C";

            //Это чтобы при пополнении склада убрать красный фон. Проще отловить изменения html кода чем запрос
            var observer = new MutationObserver(function (mutations) {
                haveEl.style.backgroundColor = "";
                observer.disconnect();
            });

            var config = { characterData: true, subtree: true, childList: true, attributes: true, attributeOldValue: true, };
            observer.observe(haveEl, config);
        }
    });
}

//Вкладка подразделения
function divisions() {
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
function division() {
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

function person() {
    var curlvl = +document.querySelector(".level").innerText;
    var names = [...document.querySelectorAll(".characters td:nth-child(3n - 1)")].map(e => e.innerText);
    var lvls = [...document.querySelectorAll(".characters td:nth-child(3n)")].map(e => +e.innerText);

    var sum = 0;

    for (let i = 0; i < names.length; i++) {
        var character = characters.find(e => e[0] == names[i])[1];
        sum += character * lvls[i];
        console.log(names[i], lvls[i], character * lvls[i]);
    }

    var unitinfo = document.querySelector(".unitinfo tbody");
    var tr = document.createElement("tr");
    tr.innerHTML = `<td>Свободная квалификация:</td><td colspan="2">${Math.max(curlvl*750-sum, 0)} - ${(curlvl+1)*750-sum}</td>`;
    unitinfo.appendChild(tr);
}

function company(){
    var url = document.querySelector("#content > table:nth-child(4) > tbody > tr:nth-child(1) > td.hidecompact > table > tbody > tr > td:nth-child(1) > a");
    var img = document.querySelector("#content > table:nth-child(4) > tbody > tr:nth-child(1) > td.hidecompact > table > tbody > tr > td:nth-child(1) > a > img");
    var id = /([0-9]+)/.exec(img.src)[0];
    url.href = `/person/?id=${id}`;
}

(function () {
    'use strict';

    const pathname = window.location.pathname.split("/").filter(e => e).join("/");
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");

    switch(pathname){
        case "person": person(); break;
        case "company": company(); break;
        case "units/shop": {
            switch (tab) {
                case "supply": supply(); break;
                case "divisions": {
                    if (searchParams.has("division")) division();
                    else divisions();
                    break;
                }
                case "characters": person(); break;
            }
        }
    }
})();
