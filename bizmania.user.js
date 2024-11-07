// ==UserScript==
// @name         bizmania
// @version      2024-10-07
// @description  Расширение возможностей bizmania
// @author       newTomas
// @match        https://bizmania.ru/units/shop*
// @match        https://bizmania.ru/person*
// @match        https://bizmania.ru/company*
// @match        https://bizmania.ru/units/factory/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bizmania.ru
// @homepageURL  https://github.com/newTomas/bizmania/
// @updateURL    https://raw.githubusercontent.com/newTomas/bizmania/main/bizmania.user.js
// @downloadURL  https://raw.githubusercontent.com/newTomas/bizmania/main/bizmania.user.js
// @grant        none
// ==/UserScript==

const characters = [["beautysaloon.png",60],
                    ["lightprod.gif",90],
                    ["machine.gif",90],
                    ["steel.gif",90],
                    ["electronics.gif",90],
                    ["chemistry.gif",90],
                    ["foodprod.gif",90],
                    ["tradefood.png",75],
                    ["tradegoods.png",75],
                    ["pharma.trade.gif",75],
                    ["catering.gif",75],
                    ["oil.gif",150],
                    ["mining.gif",150],
                    ["pit.gif",150],
                    ["husbandry.gif",60],
                    ["science.electronics.gif",75],
                    ["science.food.gif",75],
                    ["science.light.gif",75],
                    ["science.chemical.gif",75],
                    ["science.car.gif",75],
                    ["science.engineering.gif",75],
                    ["science.metallurgy.gif",75],
                    ["science.jewelry.gif",75],
                    ["constructmaterials.gif",90],
                    ["pharma.produce.gif",90],
                    ["sport.produce.blue.gif",90],
                    ["warehouse.gif",60],
                    ["production.gif",500],
                    ["agri.gif",150],
                    ["trade.gif",450],
                    ["build.gif",250],
                    ["energyproduction.gif",150],
                    ["science.gif",750],
                    ["servicegreen.gif",150],
                    ["tradeelectronics.png",75],
                    ["tradecar.png",75],
                    ["tradeconstruction.png",75],
                    ["tradeclothes.png",75],
                    ["tradeluxury.png",75],
                    ["sport.trade.blue.gif",75],
                    ["childtrade.gif",75],
                    ["digging.gif",350],
                    ["animal.gif",60],
                    ["greenhouse2.gif",60],
                    ["science.extractive.gif",75],
                    ["science.wood.gif",75],
                    ["science.building.gif",75],
                    ["science.glass.gif",75],
                    ["science.pharma.gif",75],
                    ["science.sport.gif",75]];

const factoryStaff = {
    "factory.wood.gif": 300,
    "factory.car.gif": 600,
    "factory.consmaterials.gif": 600,
    "factory.machinery.gif": 1500,
    "factory.steel.gif": 15,
    "factory.food.gif": 30,
    "factory.manufacture.gif": 300,
    "factory.chemicals.gif": 15,
    "factory.electronics.gif": 30,
    "factory.jewelry.gif": 150,
    "factory.pharma.gif": 30,
    "factory.sport.gif": 300,
}

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
    var imgs = [...document.querySelectorAll(".characters img")].map(e => e.src.split("/").at(-1));
    var lvls = [...document.querySelectorAll(".characters td:nth-child(3n)")].map(e => +e.innerText);

    var sum = 0;

    for (let i = 0; i < imgs.length; i++) {
        var character = characters.find(e => e[0] == imgs[i])[1];
        sum += character * lvls[i];
        console.log(`${imgs[i]}: ${lvls[i]} * ${character} = ${character * lvls[i]}`);
    }

    console.log("sum", sum);

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

function factory(){
    if(window.numerics) return;

    const factoryCode = document.querySelector(".unitpageicon").src.split("/").at(-1);
    const equipmentPerLvl = factoryStaff[factoryCode];
    if(!equipmentPerLvl) return;

    let totalEquipment = 0;
    unitMapData.divisions.forEach(e => {
        const lvl = e.level;
        let equipment = equipmentPerLvl / 3;
        if(lvl == 2) equipment *= 2;
        else if(lvl > 2) {
            equipment *= 4;
            equipment += (lvl-3)*equipmentPerLvl;
        }
        totalEquipment += equipment;
    });
    document.querySelector("#content > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr").innerHTML +=`<td nowrap="true"><h2>(оборудований: ${totalEquipment})</h2></td>`;
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
            break;
        }
        case "units/factory": {
            if(tab) break;
            factory();
        }
    }
})();
