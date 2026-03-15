function starter() {
    MakeReport();
    checkPersents();
    SelectedSumNeoplocheno();
    calchBloksSuma();
    showBtn(isCapt('zakaz1tovara'), 'prepareorder');
    showBtn(isCapt('sezonnost'), 'season');
    colorTheTops(isCapt('sezonnost'));
}

function MakeReport() {
    if (DATA.length === 0) {
        SetContent('<div class="notfound">Не чего не найдено</div>');
        return
    }

    var colNames = getColNames(COL_NAMES)
    var html = MakeReportFromJSON('ReportTable', colNames, DATA, SORT_BY);
    SetContent(html)
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

function setCapt(rus, eng) {
    document.getElementById('engCaption').innerText = eng
    document.getElementById('rusCaption').innerText = rus
}

/*function getRUCol(engName) {
    var { rus, eng } = getColNames(COL_NAMES)
    var inx = eng.indexOf(engName)
    return (inx !== -1) ? rus[inx] : engName
}
*/

function showBtn(see, btn) {
    if (see) document.getElementById(btn).classList.toggle('hidden')
}

function MakeReportFromJSON(tabName, colNames, jsonData, sortBy) {

    var data = jsonData
    var cols = colNames.eng;
    var rusColNames = colNames.rus
    //  console.log(COL_NAMES.rus,DATA[0],Object.keys(DATA[1]));
    var sortByTip = false
    var zakaz = getEngCapt().indexOf('zakaz1tovara') > -1 ? true : false
    var zkz = 0
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
            //  console.log('row=',index,i,') col=',names)
            if (!(sortByTip && names.toLowerCase() === sortByEng.toLowerCase())) {
                var addLink = '<td>' + el[names] + '</td>';

                if (names == 'barkod') {
                    addLink = '<td class="barkod" id="' + tabName + 'brkd_' + index + ' barkod="' + el[names] + '>' + el[names] + '</td>'
                }

                if (names == 'kod' || names === 'kodtov' || names == 'kod1tovara') {
                    addLink = '<td class="kod" id="kod_' + index + '">' + el[names] + '</td>'
                }

                if (names == 'img') {
                    addLink = '<td class="pic" id="' + tabName + 'img_' + index + '"> ' + el[names] + '</td>'
                }

                if (names.indexOf('nazv') > -1 || names.trim().toLowerCase().indexOf('наимен') > -1 || names.trim().toLowerCase().indexOf('назван') > -1) {
                    addLink = '<td class="name" id="name_' + index + '">' + el[names] + '</td>\n'
                }

                if (names.trim().toLowerCase().indexOf('кодзак') > -1 || names.indexOf('kodzak') > -1) {
                    addLink = '<td><a class="kodzak" href="/report?repID=15&kod=' + el[names] + '">' + el[names] + '</a></td>'
                }

                if (names.trim().toLowerCase().indexOf('клиент') > -1 || names.indexOf('klient') > -1) {
                    addLink = '<td><a class="client" href="/report?repID=14&client=' + el[names] + '">' + el[names] + '</a></td>\n'
                }

                if (names.trim().toLowerCase().indexOf("постав") > -1 || names.indexOf('postav') > -1) {
                    addLink = '<td><a class="postav" href="/report?repID=20&postav=' + el[names] + '">' + el[names] + '</a><td>\n'
                }

                if (names.trim().toLowerCase().indexOf('кодзав') > -1 || names.indexOf("kodzav") > -1) {
                    addLink = '<td><a class="kodzav" href="/report?repID=16&kod=' + el[names] + '">' + el[names] + '</a></td>\n'
                }


                if (names.toLowerCase().trim().indexOf('тип') > -1 || names.indexOf('tip') > -1) {
                    addLink = '<td><a class="tip" href="/report?repID=1&tip=' + el[names] + '">' + el[names] + '</a></td>\n'
                }

                if (names.toLowerCase().trim().indexOf('блок') > -1 || names.toLowerCase().trim().indexOf('block') > -1) {
                    if (el[names] === false) { addLink = '<img class="unblock" src="/public/img/unlock.ico" width=24px; height=24px>\n' }
                    else { addLink = '<td><img class="blocked" src="/public/img/lock.ico" width=24px; height=24px></td>\n' }
                    addstyle = 'style="text-align:center; width:24px; height:24px"'
                }

                if (names.toLowerCase().trim().indexOf('ост') > -1 || names == 'ost') {
                    addLink = '<td class="ost">' + el[names] + '</td>'
                    if (el[names] < 1) {
                        addstyle = 'style="font-weight:bold;color:red"'
                    } else { addstyle = 'style="font-weight:bold"' }
                }

                if (names == 'ВхЦена' || names == 'inPrice' || names == 'vhcena') {
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
    //   console.log('prepOrdr')
    setCapt('Заявка', 'zayavka')
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
            var suma = Number(kol * parseFloat(inprice))
            ar.push({ kod: kod, name: name, inprice: inprice, kol: kol, suma: suma })
        }
    }
    var colNames = {}
    colNames.rus = ['Код', 'Название', 'Кол', 'Цена', 'Сума']
    colNames.eng = ['kod', 'name', 'inprice', 'kol', 'suma']
    var html = MakeReportFromJSON('RP', colNames, ar, '')
    SetContent(html)
}

function RequestFromDelphi() {
    document.addEventListener('click', function (e) {
        var el = e.traget
        if (!el) return
        var no = el.id.split('_')[1]
        var kod = document.getElementById('kod_' + no).innerText
        var inf = `"id": "${el.id}", "className": "${el.className}", "value": "${kod}"`

        if (el.className.indexOf('kod') > -1) {
            var msg = `"message": "searchBy_Kod",`
        }
        if (names.indexOf('nazv') > -1 || names.indexOf('name') > -1) {
            var msg = `"message": "searchBy_Name",`
        }

        if (names.indexOf('kodzak') > -1) {
            var msg = `"message": "searchBy_Kodzak",`
        }

        if (names.indexOf('klient') > -1) {
            var msg = `"message": "searchBy_Client",`
        }

        if (names.indexOf('postav') > -1) {
            var msg = `"message": "searchBy_Postav",`
        }

        if (names.indexOf("kodzav") > -1) {
            var msg = `"message": "searchBy_Kodzav",`
        }

        if (names.indexOf('tip') > -1) {
            var msg = `"message": "searchBy_Tip",`
        }
        if (names.indexOf('vhcena') > -1 || names.indexOf('inprice') > -1) {
            var msg = `"message": "zakaz_zavoz",`
        }
        if (names.indexOf('procent') > -1 || names.indexOf('pers') > -1) {
            var msg = `"message": "priceWindow",`
        }
        console.log(msg + inf)
    })
}