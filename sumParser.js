//var selected = []

function getFloat(vl) {
    return parseFloat(vl.replace(/,/, '.'));
}

function TrunkCent(s) {
    return s.slice(0, s.indexOf('.') + 3)
}

function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}


function addStyles() {

    var css =
        'td{padding:10px;text-align:left;}' +
        '.pik{color:red;text-align:center;}' +
        '.high{color:magenta;}' +
        '.default{color:black;}' +
        '.month{width:80px;float:left;padding:9px;font-size:16px;margin-right:10px;}' +
        '.topBtn{width:140px;float:left;padding:9px;font-size:16px;}' +
        '.monthLbl{padding:3px;font-size:16px;margin-right:10px;float:left;}' +
        '.tr-sticky{top:2px;background-color:#d3a6f8;font-family:Courier;letter-spacing:1px;}' +
        '.Сумма{cursor:pointer;}' +
        '.Сумма.selected{background:#28a745;color:#fff;font-weight:bold;}' +
        '.popup { position:absolute;background:#1f2937;color:#fff; padding:16px 30px; border-radius:6px; font-size:13px;line-height:1.35;box-shadow:0 4px 14px rgba(0,0,0,.25);pointer-events:none;z-index:9999;white-space:nowrap;}' +
        '.popup.hidden{display:none}' +
        '.total{background:green;color:#fff; padding:16px 30px; border-radius:6px; font-size:23px;width:20%;margin:auto;text-align:center}' +
        '.block{display:block;}' +
        '.block.hidden{display:none;width:0}' +
        '.EngCap{display:block;width:74%;margin:auto;background:#c4cd5b;padding: 25px;}' +
        '.info{float:left;width:70%;color:white}' +
        '.collapseBtn{float:right;width:4%}'


    var doc = document;

    // IE / TWebBrowser путь
    if (doc.createStyleSheet) {
        var styleSheet = doc.createStyleSheet();
        styleSheet.cssText = css;
        return;
    }

    // нормальные браузеры
    var style = doc.createElement('style');
    style.type = 'text/css';
    style.appendChild(doc.createTextNode(css));
    doc.getElementsByTagName('head')[0].appendChild(style);
}

function changeRowCapt() {
    var mon = ['jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sept', 'oct', 'nov', 'dec']
    var row = document.getElementById('iContent').children[0].children[1]
    row.className = row.className + ' tr-sticky'
    //  console.log(row)
    for (var i = 2; i < row.children.length; i++) {
        row.children[i].innerHTML = '<p>' + mon[i - 2] + '</p>'
    }
}

function getTops() {
    var rt = document.getElementById('rating-table')
    if (rt) {
        console.log(rt.innerHTML)
        rt.innerHTML = '';
    }
    var inx = 0;
    var res = []
    var month = Number(document.getElementById('month-id').value) || 1
    var bloks = document.getElementsByTagName('tr'); //bloks
    for (var i = 2; i < bloks.length; i++) {
        var v = bloks[i].getElementsByTagName('td')
        var tip = bloks[i].children[1].children[0].innerHTML //tip
        var id = bloks[i].children[1].id
        console.log(tip)
        var arr = []
        var m_max = -1;
        var m_min = 10000000;
        var inx_max = -1;
        var inx_min = -1;
        for (var j = 2; j < 14; j++) {
            var t = v[j].innerText
            //   console.log(t)
            if (t == '' || t == NaN || t == undefined) { t = '0' }
            if (Number(t) > m_max) {
                m_max = t;
                inx_max = j;
            }

            if (Number(t) < m_min) {
                m_min = t;
                inx_min = j;
            }
            arr.push(Number(t))
        }

        if (inx_max > 1) {
            v[inx_max].setAttribute('style', 'background-color: red; color: white')
        }
        if (inx_min > 1) {
            v[inx_min].setAttribute('style', 'background-color: blue; color: white')
        }

        var val = Number(arr[month - 1])
        var max = Number(arr.sort(function (a, b) { return b - a })[0])
        var min = Number(arr.sort(function (a, b) { return a - b })[0])
        console.log('max=', max)

        console.log('val=', val)
        if (val > max * 0.8) {
            inx++;
            var pers = (max / val - 1) * 100
            var rate = "default"
            var info = pers.toFixed(1) + ' %  of max: ' + max + '  (min=' + min + ')';

            if (Number(pers.toFixed(0)) < 5) {
                rate = 'high'
            }
            if (val == max) {
                info = 'TOP'
                rate = 'pik'
            }
            var color = "#99FF99"
            if (inx % 2 == 0) { color = "#99CCFF" }
            res.push('<tr bgcolor="' + color + '"><td>' + inx + '</td><td><a href=#' + id + '>' + tip + '</a></td><td>' + val + '</td><td class="' + rate + '">' + info + '</td></tr>')
        }

    }
    if (!rt) {
        var tab = document.createElement('table')
        tab.id = 'rating-table'
        tab.className = 'tab';
        tab.innerHTML = res.join('')
        var tt = document.getElementById('iContent')
        tt.parentNode.insertBefore(tab, tt)
    } else {
        rt.innerHTML = res.join('')
    }
}

function StartSumParser() {
    var div = document.getElementsByClassName("RusCapt")[0]
    var capt = div.innerHTML
    // console.log()
    if (capt.length == 21 && capt.indexOf('- 20') > 0) { //Сезонность - 2024 год
        addStyles()
        var btn = document.createElement('button')
        var inpt = document.createElement('input')
        var label = document.createElement('label')

        btn.id = "topBtn"
        btn.onclick = getTops;
        btn.innerHTML = 'Show Top'
        btn.className = 'topBtn'

        inpt.id = 'month-id'
        inpt.className = 'month'
        inpt.type = 'number';
        inpt.max = 12
        inpt.min = 1
        inpt.value = 5

        label.id = 'month-lbl';
        label.className = 'monthLbl';
        label.for = 'month-id';
        label.innerHTML = 'Month: '

        div.appendChild(label)
        div.appendChild(inpt)
        div.appendChild(btn)

        changeRowCapt()
    }

    var f = document.getElementById('suma1')
    if (f == undefined || f == NaN || f == null) { return }
    var sInx = 1;
    var s;
    var blocksCount = getBolocksCount();
    for (var index = 1; index <= blocksCount; index++) {
        var blok = document.getElementsByClassName('block_' + index);
        s = 0;
        for (var j = 1; j <= blok.length; j++) {
            s = s + getFloat(document.getElementById('suma' + sInx).innerText);
            sInx++;
        };

        var iTog = document.getElementById("hBlock_" + index);
        var atr = '<div style="display:block;"><div style="float:left;width:50%">' + iTog.innerHTML + '</div> <div style="float:left;width:50%; text-align:right; color:white;"><b style="padding-right: 14px;">Suma: ' + TrunkCent(s.toString()) + '</b></div></div>';
        iTog.innerHTML = atr;
    }


    var arrowTop = document.getElementById('arrowTop')

    arrowTop.onclick = function () {
        window.scrollTo(pageXOffset, 0);
    };

    window.addEventListener('scroll', function () {
        arrowTop.hidden = (pageYOffset < document.documentElement.clientHeight);
    });
}

function ShowNumPad(v) {
    return true
}


function getTemperatureColor(t) {
    var color = 'black';
    if ((2 < t) && (t < 5)) { color = 'darkgray' }
    if ((5 <= t) && (t < 10)) { color = 'darkred' }
    if ((10 <= t) && (t < 20)) { color = 'darkyellow' }
    if (t >= 20) { color = 'red' }
    return color
}

function getTempColor(t) {
    if (t < 0) {
        return 'green'
    }
    if (t > 2) {
        return 'red'
    }
    //  var color = Math.round((t * t) * 1.5)
    // return 'rgb(' + color + ',0,0)'
}

function checkPersents() {
    var ch = document.getElementsByClassName('Change')

    if (ch) {
        for (var i = 0; i < ch.length; i++) {
            var t = Number(getFloat(ch[i].innerText.slice(0, -1)))
            ch[i].setAttribute('style', 'font-weight:100;color:' + getTempColor(t))

        }
    }
}


function SumaKolClick() {
    addStyles()
    var trs = document.getElementsByClassName('Suma')
    for (var i = 0; i < trs; i++) {
        var cell = trs[i]
        if (cell) {
            cell.onclick = function () {
                this.classList.toggle('selected')
                if (hasClass(this, 'selected')) {
                    setSelected(this, true)
                    this.setAttribute('data-check', 'true')
                } else {
                    setSelected(this, false)
                    this.setAttribute('data-check', 'false') // в IE10 атрибуты надо ставить через data-*  у функциях типа addEventListener ! Баг IE
                }
                // calcTotal()
            }
        }
    }

    // calchBloks(); // сумма по поставщику
}

function SelectedSumNeoplocheno() {
    addStyles()
    var bloks = getBolocksCount();
    var trs = document.getElementsByTagName('tr').length - bloks - 1
    // var trs = document.getElementsByClassName('Suma')
    //  console.log(trs);
    for (var i = 0; i < trs; i++) {
        var cell = document.getElementById('summa' + i)
        if (cell) {
            cell.onclick = function () {
                this.classList.toggle('selected')
                if (hasClass(this, 'selected')) {
                    setSelected(this, true)
                    this.setAttribute('data-check', 'true')
                } else {
                    setSelected(this, false)
                    this.setAttribute('data-check', 'false') // в IE10 атрибуты надо ставить через data-*  у функциях типа addEventListener ! Баг IE
                }
                calcTotal()
            }
        }
    }

    // calchBloks(); // сумма по поставщику
}

function hasClass(el, className) {
    return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
}

function cosistClass(el, className) {
    return (el.className).indexOf(className) > -1;
}

function setSelected(el, on) {
    if (on) {
        el.setAttribute('style', 'background-color:green;color:white')
    } else {
        el.setAttribute('style', 'background-color:"";color:black')
    }
}

function calcTotal() {
    var total = 0
    var bloks = getBolocksCount();
    var trs = document.getElementsByTagName('tr').length - bloks - 1
    for (var i = 0; i < trs; i++) {
        var cell = document.getElementById('summa' + i)
        if (cell && cell.getAttribute('data-check') == 'true') {
            total = total + parseFloat(cell.innerText)
        }
    }
    document.getElementsByClassName('Janre')[0].innerHTML = 'Selected Sum: ' + total
}


function getBolocksCount() {
    return document.getElementsByClassName('hBlock').length
}

function getElementsByKey(value) {
    var ar = []
    var rows = document.querySelectorAll('.rowA,.rowB');
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].getAttribute('block') === value) {
            ar.push(rows[i])
        }
    }
    console.log(ar);
    return ar;
}


function calchBloksSuma() {

    var block = null;
    var s = 0;

    var rows = document.getElementsByClassName('Suma');
    if (!rows) return;

    for (var i = 0; i < rows.length; i++) {

        var current_block = Number(rows[i].getAttribute('block'));

        // первый элемент
        if (block === null) block = current_block;

        // если блок сменился — записываем сумму предыдущего
        if (current_block !== block) {

            var hBlock = document.getElementById('hBlock_' + block);
            if (hBlock) {
                var caption = hBlock.innerText;
                hBlock.innerHTML =
                    '<div class="sumaCaptHeader">' + caption + '</div>' +
                    '<div class="sumaValHeader">Сума: ' + s.toFixed(2) + ' грн.</div>';
            }

            s = 0;
            block = current_block;
        }

        s += getFloat(rows[i].innerText);
    }

    // записываем последний блок
    if (block !== null) {
        var hBlock = document.getElementById('hBlock_' + block);
        if (hBlock) {
            var caption = hBlock.innerText;
            hBlock.innerHTML =
                '<div class="sumaCaptHeader">' + caption + '</div>' +
                '<div class="sumaValHeader">Сума: ' + s.toFixed(2) + ' грн.</div>';
        }
    }
}

function calchBloksSuma3() {
    var block = 1;
    var s = 0;
    var rows = document.getElementsByClassName('Suma')
    if (rows) {
        for (var i = 0; i < rows.length; i++) {
            var current_block = Number(rows[i].getAttribute('block'))
            if (current_block == block) {
                console.log(i, block, current_block);
                s = s + getFloat(rows[i].innerText)
            } else {
                var hBlock = document.getElementById('hBlock_' + block)
                hBlock.innerHTML = '<div class="sumaCaptHeader">' + hBlock.innerText + '</div><div class="sumaValHeader">Сума: ' + s.toFixed(2) + ' грн.</div>';
                s = 0;
                block++;
            }
        }
        hBlock = document.getElementById('hBlock_' + block)
        if (hBlock) {
            hBlock.innerHTML = '<div class="sumaCaptHeader">' + hBlock.innerText + '</div><div class="sumaValHeader">Сума: ' + s.toFixed(2) + ' грн.</div>';
        }
    }
}

function calchBloks2() { //для не оплачено
    var sInx = 1;
    var blocksCount = getBolocksCount();
    for (var index = 1; index <= blocksCount; index++) {
        var blocks = getElementsByKey(index)


        var s = 0;
        for (var j = 1; j <= bloks.length; j++) {
            if (document.getElementById('summa' + sInx)) {
                s = s + getFloat(document.getElementById('summa' + sInx).innerText);
                sInx++;
            }
        };
        if (document.getElementById('summa1')) {
            var iTog = document.getElementById("hBlock_" + index);
            var atr = '<div style="display:block;"><div style="float:left;width:50%">' + iTog.innerHTML +
                '</div> <div style="float:left;width:50%; text-align:right; color:white;"><b style="padding-right: 14px;">Cyma: ' +
                TrunkCent(s.toString()) + '</b></div></div>';
            iTog.innerHTML = atr;
        }
    }
}

function parseRuDate(str) {
    if (!str) return null

    str = str.replace(/\s+/g, ' ').trim()

    var p = str.split(/[ .:-]/)

    if (p.length < 3) return null

    var day = parseInt(p[0], 10)
    var month = parseInt(p[1], 10) - 1
    var year = parseInt(p[2], 10)
    var hour = p[3] ? parseInt(p[3], 10) : 0
    var min = p[4] ? parseInt(p[4], 10) : 0

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null

    return new Date(year, month, day, hour, min, 0, 0)
}

function daysBetween(dt1, dt2) {
    if (!dt1 || !dt2) return 0
    var d1 = new Date(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())
    var d2 = new Date(dt2.getFullYear(), dt2.getMonth(), dt2.getDate())
    return Math.round((d2 - d1) / 86400000)
}

function SaleSpeed() {
    var div = document.getElementsByClassName("RusCapt")[0]
    var capt = div.innerHTML
    if (capt.indexOf(':') === 12 && capt.indexOf(': ') > 0) { //Заказ товара
        addStyles();
        addCollapseBtn();
        var bloks = getBolocksCount();
        var trs = document.getElementsByTagName('tr').length - bloks - 1
        for (var i = 1; i < trs; i++) {
            var cell = document.getElementById('nazvanie' + i)
            if (cell) {
                cell.innerHTML = cell.innerText
                cell.setAttribute('style', 'cursor:pointer;')
            }
        }
        var popup = document.createElement('div')
        popup.className = 'popup hidden'
        document.body.appendChild(popup)

        document.body.onclick = function (e) { //COOL!!!
            if (e.target.id && e.target.id.indexOf('nazvanie') === 0) {
                var index = e.target.id.replace('nazvanie', '')
                var inPrice = getFloat(document.getElementById('vhcena' + index).innerText)
                var price = getFloat(document.getElementById('cena' + index).innerText)
                var kol = getFloat(document.getElementById('prod' + index).innerText)
                var dt1 = parseRuDate(document.getElementById('datzav' + index).innerText)
                var dt2 = parseRuDate(document.getElementById('datprod' + index).innerText)
                var days = daysBetween(dt1, dt2)
                var cash = kol * (price - inPrice)
                popup.innerHTML = '<p>  Cash: ' + cash.toFixed(2) + ' grn.</p> ' +
                    '<p> Speed: ' + (kol / days).toFixed(2) + ' pcs/day </p>' +
                    '<p>  Info: ' + kol + '/' + days + ' pcs/days</p>' +
                    '<p> Cash/Day: ' + (cash / days).toFixed(2) + 'grn.</p>'
                popup.style.left = (e.pageX + 12) + 'px'
                popup.style.top = (e.pageY + 12) + 'px'

                popup.classList.remove('hidden')
                return
            }

            if (e.target.id && e.target.id.indexOf('hBlock') === 0) {
                var inx = e.target.id.replace('hBlock_', '')
                var tr = document.getElementsByClassName('block_' + inx)
                for (var j = 0; j < tr.length; j++) {
                    if (tr[j].style.display === 'none') {
                        tr[j].style.display = ''
                    } else {
                        tr[j].style.display = 'none'
                    }
                }
            }

            if (!popup.classList.contains('hidden'))
                popup.classList.add('hidden')
        }
    }
}

function getUpk(val) {
    val = String(val).trim();
    // число в начале + остальное
    var m = val.match(/^(-?\d+(?:[.,]\d+)?)(.*)$/);
    if (!m) {
        return { kol: null, str: val };
    }
    var v = {
        kol: parseFloat(m[1].replace(',', '.')),
        upk: m[2].trim()
    }
    if (v.upk) return v.kol
    else return 1
}

function ZakazSuma() {
    var div = document.getElementsByClassName("RusCapt")[0]
    var capt = div.innerHTML
    var sum = 0;

    if (capt.indexOf(': ') > 0 && capt.indexOf(':') == 6) { //Заявка
        addStyles();

        var bloks = getBolocksCount()
        var trs = document.getElementsByTagName('tr').length - bloks - 1
        for (var i = 1; i < trs; i++) {
            var cena = document.getElementById('cena' + i)

            if (cena) {
                var price = getFloat(cena.innerText)
                //var upk = getFloat(document.getElementById('upk' + i).innerText)
                var kol = getFloat(document.getElementById('kolicestvo' + i).innerText)
                sum = sum + kol * price;
            }
        }
        var janre = document.getElementsByClassName('Janre')[0]
        janre.className = 'total'
        janre.innerText = 'Total: ' + sum.toFixed(2) + ' grn'
    }
}


function blocksCollapse() {
    var bloks = getBolocksCount();
    for (var i = 0; i < bloks; i++) {
        var tr = document.getAttribute('block_' + Number(i + 1))
        for (var j = 0; j < tr.length; j++) {
            if (tr[j].style.display === 'none') {
                tr[j].style.display = ''
            } else {
                tr[j].style.display = 'none'
            }
        }
    }
}

function addCollapseBtn() {
    var cap = document.getElementsByClassName('EngCapt')[0]
    if (cap) {
        cap.className = 'EngCap'
        var div1 = document.createElement('div');
        div1.innerText = cap.innerText;
        div1.className = 'info';
        cap.innerText = '';
        cap.appendChild(div1)
        var div2 = document.createElement('div');
        div2.className = 'collapseBtn';
        div2.innerHTML = '<button onclick="blocksCollapse()">Collapse</button>'
        cap.appendChild(div2)
    }
}


function Start() {
    // addStyles() засунув у кожну функцію, для швидшої загрузки
    StartSumParser();
    checkPersents();
    SelectedSumNeoplocheno();
    SaleSpeed();
    ZakazSuma();
}

function colorTheTops(isTops) {
    if (!isTops) return
    var rows = document.querySelectorAll('.rowA,.rowB');
    for (var i = 0; i < rows.length; i++) {
        var cell = rows[i].getElementsByTagName('td')
        var min = cell[1];
        var max = cell[1];
        max.className = 'colorMax';
        for (var j = 1; j < 13; j++) {
            var t = cell[j].innerText;
            if (t == '' || t == NaN || t == undefined) { t = '0'; cell[j].innerText = '0' }
            var cu = Number(t)
            var mx = Number(max.innerText)
            var mn = Number(min.innerText)
            //   console.log(t, cu, mx, mn);
            if (cu < mn) { min.className = 'default'; min = cell[j]; min.className = 'colorMin' }
            if (cu >= mx) { max.className = 'default'; max = cell[j]; max.className = 'colorMax' }
        }
    }
    getTopByMounth(1)
}


function resetTops() {
    const rows = document.querySelectorAll('.hiSeason,.pikSeason,.topSeason');
    for (var i = 0; i < rows.length; i++) {
        rows[i].classList.remove('hiSeason', 'pikSeason', 'topSeason');
        rows[i].setAttribute('season', "0")
    }
}

function getTopByMounth(mon) {
    var rows = document.querySelectorAll('.rowA,.rowB');
    //  console.log(rows);
    for (var i = 0; i < rows.length; i++) {
        var cell = rows[i].getElementsByTagName('td')
        if (rows[i].getElementsByClassName('colorMax').length === 0) continue
        var cmax = Number(rows[i].getElementsByClassName('colorMax')[0].innerText)
        //    console.log(cmax);
        //   for (var j = 1; j < 13; j++) {
        var j = mon
        var cu = Number(cell[j].innerText)
        if (j !== mon) continue
        if (cmax * 0.8 < cu) {
            cell[j].classList.add('hiSeason')
            cell[j].parentElement.setAttribute('season', mon)
        }
        if (cmax * 0.9 < cu) {
            cell[j].classList.add('pikSeason')
            cell[j].parentElement.setAttribute('season', mon)
        }
        if (cmax * 0.95 < cu) {
            cell[j].classList.add('topSeason')
            cell[j].parentElement.setAttribute('season', mon)
        }
        //  }
    }
}



function SumaZayavka() {
    var sums = document.getElementsByClassName('Suma')
    var s = 0;
    if (!sums) return
    for (var i = 0; i < sums.length; i++) {
        if (!sums[i]) continue
        if (!isNumeric(sums[i].innerText)) continue
        s = s + Number(sums[i].innerText)
    }
    return s;
}