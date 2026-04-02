function starter() {
    MakeReport()
    checkPersents();
    // SumaKolClick();
    SelectedSumNeoplocheno();
    calchBloksSuma();
    showBtn(isCapt('zakaz1tovara'), 'prepareorder');
    showBtn(isCapt('sezonnost'), 'season');
    colorTheTops(isCapt('sezonnost'));
    if (isCapt('Zayavka')) setITog('Итого: ' + SumaZayavka() + ' грн.')
}


function MakeReport() {
    if (DATA.length === 0) {
        SetContent('<div class="notfound">Не чего не найдено</div>');
        return
    }

    var colNames = getColNames(COL_NAMES)
    var html = MakeReportFromJSON('ReportTable', colNames, DATA, SORT_BY);
    SetContent(html)
    showITog()
}

function getColNames(cols) {
    var rus = [];
    var eng = [];
    for (var key in cols) {
        if (cols.hasOwnProperty(key)) {
            rus.push(cols[key]);
            eng.push(key);
        }
    }
    return {
        rus: rus,
        eng: eng
    };
}

/* not FOR IE10
function getColNamesNew(cols) {
    return {
        rus: Object.values(cols),
        eng: Object.keys(cols)
    }
}
*/

function isCapt(capt) {
    return getEngCapt().indexOf(capt) > -1 ? true : false
}

function SetContent(contex) {
    document.getElementsByClassName('content')[0].innerHTML = contex
}

function trCollapse(inx) {
    var tr = document.getElementsByTagName('tr')
    for (var j = 0; j < tr.length; j++) {
        var blok = tr[j].getAttribute('block')
        //  console.log(blok);
        if (blok === inx) {
            if (tr[j].style.display === 'none') {
                tr[j].style.display = ''
            } else {
                tr[j].style.display = 'none'
            }
        }
    }
}


function seasonBtnClick() {
    var m = document.getElementById('seasonCtrl').value
    var rows = document.querySelectorAll('.rowA,.rowB');
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].getAttribute('season') !== m) rows[i].classList.toggle('hidden')
    }
}


function setSeasonMounth() {
    var m = document.getElementById('seasonCtrl').value
    var header = document.getElementsByClassName('trHeaderStyle')[0]
    var td = header.getElementsByClassName('tdStyle')
    for (var i = 1; i < 13; i++) {
        if (Number(td[i].innerText) === m) td[i].classList.add('SeasonSelected')
        else {
            td[i].classList.remove('SeasonSelected')
            td[i].classList.add('tdStyle')
        }
    }
    resetTops();
    getTopByMounth(Number(m));
    document.getElementsByClassName('MounthVal')[0].innerHTML = m;
}

function collapseBtnClick2() {
    var rows = document.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++)
        if (/rowA|rowB/.test(rows[i].className))
            rows[i].hidden = !rows[i].hidden;
}

function collapseBtnClick() {
    var rows = document.querySelectorAll('.rowA,.rowB');
    // console.log(rows);
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.display = rows[i].style.display === 'none' ? '' : 'none';
    }
}

function setColNames(col, tip) {
    var ar = []
    if (!tip) { tip = '' }
    for (var i = 0; i < col.length; i++) {
        if (col[i].toLowerCase() != tip.toLowerCase()) {
            ar.push('<td class="tdStyle">' + col[i] + '</td>')
        }
    }
    var v = '<tr class="trHeaderStyle"><td class="tdStyle">No</td>'
    return v + ar.join('\n')
}

function getEngCapt() {
    return document.getElementById('engCaption').innerText
}
function getRusCapt() {
    return document.getElementById('rusCaption').innerText
}

function setCapt(rus, eng) {
    document.getElementById('engCaption').innerText = eng
    document.getElementById('rusCaption').innerText = rus
}

function setITog(val) {
    var itog = document.getElementById('itog')
    if (!itog) return
    itog.classList.toggle('hidden')
    itog.innerText = val;
}

function showITog() {
    var itog = document.getElementById('itog')
    if (itog && itog.innerText) itog.classList.toggle('hidden')
}

function showBtn(see, btn) {
    if (see) document.getElementById(btn).classList.toggle('hidden')
}

function MakeReportFromJSON(tabName, colNames, jsonData, sortBy, offset = null) {

    var data = jsonData
    var cols = colNames.eng;
    var rusColNames = colNames.rus
    //  console.log(COL_NAMES.rus,DATA[0],Object.keys(DATA[1]));
    var sortByTip = false
    var zakaz = getEngCapt().indexOf('zakaz1tovara') > -1 ? true : false
    var zkz = 0 + (offset === null ? 0 : offset);
    var header = '<table class="' + tabName + '" id=id_"' + tabName + '"><tbody>\n'
    var sortByEng = sortBy.eng
    if (sortBy.rus) {
        sortByTip = true
    }
    // console.log(sortBy,sortByTip);
    //table Section 
    var sdata = ''
    var scol = ''
    var pevTip = tr = editIco = dollarIco = blockIco = '';
    var BlockCount = 0;


    for (var index = 0; index < data.length; index++) {
        var el = data[index]
        tr = '<tr block="' + BlockCount + '" class="' + (index % 2 === 0 ? "rowA" : "rowB") + '" id="tr_' + index + '">' +
            '<td class="tdStyle">' + Number(index + 1) + '</td>\n'

        if (sortByTip) {
            if ((el[sortByEng]).toLowerCase() != pevTip.toLowerCase()) {
                pevTip = el[sortByEng];
                BlockCount++;

                tr = '<tr class="sortByclass">\n' +
                    ' <th class="hBlock" id="hBlock_' + BlockCount + '"' +
                    ' onclick=trCollapse("' + BlockCount + '")' +
                    ' colspan= ' + Number(Number(cols.length) + Number(zkz) + 3) + '>' +
                    pevTip + '</th></tr>' +
                    ' <tr block="' + BlockCount + '" class="' + (index % 2 === 0 ? "rowA" : "rowB") + '" id="tr_' + index + '">' +
                    '<td class="tdStyle">' + Number(index + 1) + '</td>\n'
            }
        }


        for (var i = 0; i < cols.length; i++) {
            var names = cols[i]
            var addstyle = ''
            // console.log('row=', index, i, ') col=', names)
            if (!(sortByTip && names.toLowerCase() === sortByEng.toLowerCase())) {
                var addLink = `<td class="${names}" id="${names}_${index}">${el[names]}</td>`;

                if (names == 'barkod') {
                    addLink = `<td class="barkod" id="barkod_${index}">${el[names]}</td>`
                }

                if (names == 'kod' || names === 'kodtov' || names == 'kod1tovara') {
                    addLink = '<td class="kod" id="kod_' + index + '">' + el[names] + '</td>'
                }

                if (names == 'img') {
                    addLink = '<td class="pic" id="' + tabName + 'img_' + index + '"> ' + el[names] + '</td>'
                }

                if (names.indexOf('nazv') > -1 || names.trim().toLowerCase().indexOf('naimen') > -1) {
                    addLink = '<td class="name" id="name_' + index + '">' + el[names] + '</td>\n'
                }

                if (names.indexOf('kodzak') > -1 || names.indexOf('kod1zak') > -1) {
                    //addLink = '<td class="kodzak" id="kodzak_' + index + '"><a href="/report?repID=15&kod=' + el[names] + '">' + el[names] + '</a></td>'
                    addLink = `<td class="kodzak" id="kodzak_${index}">${el[names]}</td>`
                }

                if (names.trim().toLowerCase().indexOf('klient') > -1) {
                    addLink = `<td class="client" id="client_${index}">${el[names]}</td>`
                    //  addLink = '<td class="client" id="klient_' + index + '"><a href="/report?repID=14&client=' + el[names] + '">' + el[names] + '</a></td>\n'
                }

                if (names.trim().toLowerCase().indexOf("kodzav") > -1 || names.trim().toLowerCase().indexOf("kod1zav") > -1) {
                    addLink = `<td class="kodzav" id="kodzav_${index}">${el[names]}</td>`
                    //  addLink = '<td class="kodzav" id="kodzav_' + index + '"><a href="/report?repID=16&kod=' + el[names] + '">' + el[names] + '</a></td>\n'
                }


                if (names.toLowerCase().trim().indexOf('tip') > -1) {
                    if (getEngCapt().indexOf('po1tipam') > -1) {
                        addLink = `<td class="potipam" id="potipam_${index}">${el[names]}</td>`
                    } else
                        addLink = '<td class="tip" id="tip_' + index + '">' + el[names] + '</td>'
                }

                if (names.toLowerCase().trim().indexOf('blok') > -1) {
                    if (el[names] === false) { addLink = '<img class="unblock" src="/public/img/unlock.ico" width=24px; height=24px>\n' }
                    else { addLink = '<td><img class="blocked" id="blocked_' + index + '" src="/public/img/lock.ico" width=24px; height=24px></td>\n' }
                    addstyle = 'style="text-align:center; width:24px; height:24px"'
                }

                if ((names.toLowerCase().trim().indexOf('ost') > -1) && !(names.trim().indexOf('postav') > -1)) {
                    el[names] < 1 ? addstyle = "ost red" : addstyle = "ost"
                    addLink = `<td class="${addstyle}" id="ost_${index}"> ${el[names]}</td>`
                }

                if (names.toLowerCase().trim().indexOf('postav') > -1) {
                    addLink = '<td class="postav" id="postav_' + index + '">' + el[names] + '</td>'
                    //addLink = '<td class="postav" id="postav_' + index + '"><a href="/report?repID=20&postav=' + el[names] + '">' + el[names] + '</a><td>\n'
                }

                if (names.toLowerCase() == 'inprice' || names.toLowerCase() == 'vhcena') {
                    addstyle = 'style="font-weight:bold;color:blue"'
                    addLink = '<td class="inprice" id="inprice_' + index + '">' + el[names] + '</td>\n'
                }

                if (names.toLowerCase().indexOf('flow') > -1) {
                    if (el[names] === 'U') {
                        addLink = '<td class="Change"><p class="arrowup">&#8679</p></td>'
                    }
                    if (el[names] === 'D') {
                        addLink = '<td class="Change"><p class="arrowdown">&#8681</p></td>'
                    }
                }

                if (names.toLowerCase().indexOf('change') > -1) {
                    addLink = '<td class="Change"><p class="change">' + el[names] + '</p></td>'
                }

                if (names.toLowerCase().indexOf('summa') > -1 || names.toLowerCase().indexOf('suma') > -1) {
                    addLink = '<td  block="' + BlockCount + '" class="Suma" id="' + names + index + '">' + el[names] + '</td>'
                }

                if (names.toLowerCase().indexOf('pers') > -1 || names.toLowerCase().indexOf('proc') > -1 || (names.toLowerCase().indexOf('srpr') > -1)) {
                    addLink = '<td  class="pers" id="pers_' + index + '">' + el[names] + '</td>'
                }

                if (names.toLowerCase().indexOf('vhlp') > -1 || names.toLowerCase().indexOf('kol') > -1) {
                    addLink = '<td  block="' + BlockCount + '" class="Kols" id="' + names + '_' + index + '">' + el[names] + '</td>'
                }
                if (names == 'btnUnChain') {
                    addLink = `<td  class="btnUnChain" id="btnUnChain_${index}>">
                    <button onclick="btnUnChainClick('${index}')">UnChain</button></td>`
                }
                if (names == 'btnChain') {
                    addLink = `<td  class="btnChain" id="btnChain_${index}>">
                    <button onclick="btnChainClick('${index}')">Chain</button></td>`
                }
                if (names == 'edit') {
                    addLink = `<td  class="defEdit"><input type="text" id="edit_${index}"></td>`
                }


                scol = scol + addLink
            }
        } //end col.map


        if (zakaz) { scol = scol + '<td class="tdStyle"><input class="edits" id="ed_' + index + '" type="text" size=5></td>' }

        sdata = sdata + tr + scol + '</tr>';
        scol = ''

    } //enf of map.data                 
    var ed = '';
    if (editIco != '') { ed = '<td>Заказ</td>' }
    if (zakaz) { rusColNames.push('Заказ'); }
    var mainTab = header + setColNames(rusColNames, sortBy.rus) + ed + '</tr>\n' + sdata + '</tbody></table>\n'
    //End of Table Section    

    return mainTab
}

function prepareOrder() {
    var ar = []
    var postav = getRusCapt().trim().split(':')[1]
    setCapt('Заявка: ' + postav, 'zayavka')
    var edits = document.getElementsByClassName('edits')
    //  console.log(edits.length)
    for (var i = 0; i < edits.length; i++) {
        if (edits[i].value) {
            //   console.log(edits[i])
            var id = edits[i].id.split('_')[1]
            var kod = document.getElementById('kod_' + id).innerText
            var name = document.getElementById('name_' + id).innerText
            var inprice = document.getElementById('inprice_' + id).innerText
            var kol = edits[i].value;
            var barkod = document.getElementById('barkod_' + id)
            var suma = Number(kol * parseFloat(inprice))
            var no = Number(document.getElementById('kod_' + id).parentElement.getAttribute('block'))
            var tip = document.getElementById('hBlock_' + no).innerText;
            var jsn = { tip: tip, kod: kod, name: name, inprice: inprice, kol: kol, suma: suma }
            if (barkod) jsn.barkod = barkod.innerText
            ar.push(jsn)

        }
    }
    var colNames = {}
    if (!barkod) {
        colNames.rus = ['Тип', 'Код', 'Название', 'Кол', 'Цена', 'Сума']
        colNames.eng = ['tip', 'kod', 'name', 'kol', 'inprice', 'suma']
        var col = { "tip": "Тип", "kod": "Код", "name": "Название", "kol": "Кол", "inprice": "Цена", "suma": "Сума" }
        var html = MakeReportFromJSON('RP', colNames, ar, '')
    } else {
        colNames.rus = ['Тип', 'Баркод', 'Код', 'Название', 'Кол', 'Цена', 'Сума']
        colNames.eng = ['tip', 'barkod', 'kod', 'name', 'kol', 'inprice', 'suma']
        var col = { "tip": "Тип", "barkod": "Баркод", "kod": "Код", "name": "Название", "kol": "Кол", "inprice": "Цена", "suma": "Сума" }

        var html = MakeReportFromJSON('RP', colNames, ar, '', 1)
    }

    SetContent(html)

    var st = JSON.stringify(ar).slice(1, -1).replaceAll('"', '@')

    var cols = JSON.stringify(col).replaceAll('"', '@')
    var msg = `"message": "prepareorder", "id": "${postav}", "data": "${st}", "colNames":"${cols}","value":"Заявка-${postav}","sortByRus":"Тип","sortByEng":"tip"`;
    console.log(msg) // <--- НЕ УДАЛЯТЬ!!! Delphi request
}

function RequestFromDelphi() {
    document.addEventListener('click', function (e) {
        var el = e.target
        if (!el) return
        var no = el.id.split('_')[1]

        var kod = document.getElementById('kod_' + no)
        var potipam = document.getElementById('potipam_' + no)
        var kodzak = document.getElementById('kodzak_' + no)
        var kodzav = document.getElementById('kodzav_' + no)
        var postav = document.getElementById('postav_' + no)
        var client = document.getElementById('client_' + no)
        var tip = document.getElementById('tip_' + no)

        if (!(kod || potipam || kodzak || kodzav || postav || client || tip)) return

        var msg = `"message":"${el.className}_click",`
        var names = el.className;
        var inf = `"id": "${el.id}", "className": "${el.className}", "value": "${el.innerText}"`

        if (names.indexOf('vhcena') > -1 || names.indexOf('inprice') > -1) {
            msg = `"message": "zakaz_zavoz",`
            inf = `"id": "${el.id}", "className": "${el.className}", "value": "${el.innerText}","data":"${kod.innerText}"`
        } else
            if (names.indexOf('proc') > -1 || names.indexOf('pers') > -1) {
                msg = `"message": "priceWindow",`
                inf = `"id": "${el.id}", "className": "${el.className}", "value": "${el.innerText}","data":"${kod.innerText}"`
            }
        console.log(msg + inf) // не менять!<- точка обмена с Delphi через TChronium  
        return msg + inf
    })
}

function SaveCurrentPage(fileName) {
    var tbody = document.getElementsByTagName('table')[0];
    // console.log(fileName);
    var css = `.rowA {background-color: #99FF99;}
                .rowB {background-color: #99CCFF;}
                .ReportTable td{padding:4px 6px;border-bottom:1px solid #ddd;}
                td{padding: 5px 10px 5px 10px text-align: left;}
                tr{height: 40px;}
                .trHeaderStyle { background-color: rgb(233, 197, 238); position: sticky;top:40px;z-index:500;}
                .tdStyle{border: none;background-color: initial;}
                .header{color: white;background-color: #1c4267;font-size: 26px;margin:auto;width:auto;`


    var html = `<!DOCTYPE html>
                <html lang="ru">
                <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>
                <style type="text/css"> ${css}</style></head><body>
                 <div class="header">${getRusCapt()}</div>
                 <div class="content" id="id_content"><table class="ReportTable">${tbody.outerHTML}</table></div>
                </body></html>`

    const inlined = inlineStylesFromString(html);

    var raw = inlined.replaceAll('"', '@')
    var msg = `"message":"savePage","data":"${raw}","id":"${getRusCapt()}","value":"${fileName}"`
    console.log(msg) //<-- !!! Delphi
}


function btnUnChainClick(index) {
    var barkod = document.getElementById('barkod_' + index)
    if (!barkod) return
    var msg = `"message":"UnChain","data":"${barkod.innerText}"`
    console.log(msg); //<-- !!! Delphi
}

async function btnChainClick(index) {
    try {
        var kod = document.getElementById('kod_' + index)
        var val = document.getElementById('edit_' + index)
        var barkod = document.getElementById('barkod_' + index)
        var name = document.getElementById('name_' + index)
        var artikul = document.getElementById('artikul_' + index)
        if (!(val && kod)) return
        if (val.value == '') {
            popupMSG("Поле Код:", " Введите значение")
            return
        }
        const res = await confirm_WND(`Связать коды: ${barkod.innerText} = ${val.value}`,
            '<p>' + artikul.innerText + '</p><p>' + name.innerText + '</p>')
        if (res == 'YES') {
            var msg = `"message":"Chain","data":"${barkod.innerText}","value":"${val.value}"`
            console.log(msg); //<-- !!! Delphi
        }
    } catch (err) {
        console.log(err);
    }
}