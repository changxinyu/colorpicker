let inputR = document.getElementById('r')
let inputG = document.getElementById('g')
let inputB = document.getElementById('b')
let inputhex = document.getElementById('hex')
let picker = document.getElementById('picker')
let cursor = document.getElementById('cursor')
let pointer = document.getElementById('pointer')
let pointerwhite = document.getElementsByClassName('pointerwhite')[0]
let colorchose = document.getElementById('colorchose')
let colorshow = document.getElementById('colorshow')
let h = document.getElementById('h')
let pickerH = Number(picker.getBoundingClientRect().bottom - picker.getBoundingClientRect().top)
let pickerW = Number(picker.getBoundingClientRect().right - picker.getBoundingClientRect().left)

let mousedown = false
let input = false

let PcursorX, PcursorY, PpointerY, Pcolorshow

let H, S, B, HSB, RGB

let HEX = '000000'
let Red = 0
let Green = 0
let Blue = 0

let OBJcursor = cursor.getBoundingClientRect()
let OBJpointer = pointer.getBoundingClientRect()
let OBJpicker = picker.getBoundingClientRect()
let OBJcolorchose = colorchose.getBoundingClientRect()
let OBJpointerwhite = pointerwhite.getBoundingClientRect()

let cursorH = OBJcursor.bottom - OBJcursor.top
let cursorW = OBJcursor.right - OBJcursor.left

let pointerH = OBJpointer.bottom - OBJpointer.top
let pointerwhiteH = OBJpointerwhite.bottom - OBJpointerwhite.top

let pointerY
let cursorX
let cursorY

let pickerX = OBJpicker.left
let pickerY = OBJpicker.top
let pickerB = OBJpicker.bottom
let pickerR = OBJpicker.right

let colorchoseY = OBJcolorchose.top
let colorchoseH = OBJcolorchose.bottom - OBJcolorchose.top
let colorchoseX = OBJcolorchose.left
let colorchoseW = OBJcolorchose.right - OBJcolorchose.left

let cursorXRatio = 0
let cursorYRatio = 100
let pointerYRatio = 0


const HSBToRGB = (h, s, b) => {
    s /= 100;
    b /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [255 * f(5), 255 * f(3), 255 * f(1)];
};

const RGBToHex = (r, g, b) =>
    ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

const RGBToHSB = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const v = Math.max(r, g, b),
        n = v - Math.min(r, g, b);
    const h =
        n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
    return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
};

const hexToRGB = hex => {
    let alpha = false,
        h = hex.slice(hex.startsWith('#') ? 1 : 0);
    if (h.length === 3) h = [...h].map(x => x + x).join('');
    else if (h.length === 8) alpha = true;
    h = parseInt(h, 16);
    return (
        'rgb' +
        (alpha ? 'a' : '') +
        '(' +
        (h >>> (alpha ? 24 : 16)) +
        ', ' +
        ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
        ', ' +
        ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
        (alpha ? `, ${h & 0x000000ff}` : '') +
        ')'
    );
};


picker.addEventListener('mousedown', (e) => {

    if (pickerY <= e.clientY + (cursorH * 0.2) && e.clientY + (cursorH * 0.2) <= pickerB) {
        cursor.style.top = Math.round(e.clientY - pickerY) + 'px'
        cursorY = Math.round(e.clientY - pickerY)
    }

    if (e.clientY - (cursorH * 0.2) <= pickerY) {
        cursor.style.top = 0 + 'px'
        cursorY = 0

    } else if (pickerB <= e.clientY + (cursorH * 0.2)) {
        cursor.style.top = Math.round(pickerH) + 'px'
        cursorY = Math.round(pickerH)
    }

    if (pickerX <= e.clientX + (cursorH * 0.2) && e.clientX + (cursorH * 0.2) <= pickerX + pickerW) {
        cursor.style.left = (e.clientX - pickerX) + 'px'
        cursorX = Math.round(e.clientX - pickerX)
    }

    if (e.clientX + (cursorW * 0.2) <= pickerX) {
        cursor.style.left = 0 + 'px'
        cursorX = 0

    } else if (pickerR <= e.clientX + (cursorW * 0.2)) {
        cursor.style.left = Math.round(pickerW) + 'px'
        cursorX = Math.round(pickerW)
    }

    calcursor()

})

pointer.addEventListener('mousedown', (e) => {

    mousedown = true

})
pointer.addEventListener('mousemove', (e) => {

    e.preventDefault();

    if (mousedown == true) {

        if (colorchoseY <= e.clientY - (pointerwhiteH / 2) && e.clientY + (pointerwhiteH / 2) <= colorchoseY + colorchoseH && colorchoseX <= e.clientX && e.clientX <= (colorchoseX + colorchoseW)) {
            pointer.style.top = Math.round(e.clientY - colorchoseY - (pointerwhiteH / 2)) + 'px'
            pointerY = Math.round(e.clientY - colorchoseY - (pointerwhiteH / 2))


        } else if (e.clientY - (pointerwhiteH / 2) <= colorchoseY) {
            pointer.style.top = 0 + 'px'
            pointerY = 0


        } else if (colorchoseY + colorchoseH <= e.clientY + pointerwhiteH / 2) {
            pointer.style.top = Math.round(colorchoseH - pointerH) + 'px'
            pointerY = Math.round(colorchoseH - pointerH)
        }

    }


})

pointer.addEventListener('mouseup', (e) => {
    mousedown = false
})


cursor.addEventListener('mousedown', (e) => {

    mousedown = true

})
cursor.addEventListener('mousemove', (e) => {

    e.preventDefault();

    if (mousedown == true) {

        if (pickerX <= e.clientX + (cursorW * 0.05) && e.clientX + (cursorW * 0.05) <= pickerX + pickerW) {
            cursor.style.left = Math.round(e.clientX - pickerX) + 'px'
            cursorX = Math.round(e.clientX - pickerX)
        }

        if (e.clientX - (cursorW * 0.05) <= pickerX) {
            cursor.style.left = 0 + 'px'
            cursorX = 0

        } else if (pickerR <= e.clientX + cursorW * 0.05) {
            cursor.style.left = Math.round(pickerW) + 'px'
            cursorX = Math.round(pickerW)
        }

        if (pickerY <= e.clientY + (cursorH * 0.05) && e.clientY + (cursorH * 0.05) <= pickerB) {
            cursor.style.top = Math.round(e.clientY - pickerY) + 'px'
            cursorY = Math.round(e.clientY - pickerY)
        }

        if (e.clientY - cursorH * 0.05 <= pickerY) {
            cursor.style.top = 0 + 'px'
            cursorY = 0

        } else if (pickerY + pickerH <= e.clientY + cursorH * 0.05) {
            cursor.style.top = Math.round(pickerH) + 'px'
            cursorY = Math.round(pickerH)
        }

    } else {

        return

    }


    calcursor()

    console.log('mousemove', cursorX, cursorY)



})

cursor.addEventListener('mouseup', (e) => {

    mousedown = false

})

colorchose.addEventListener('mousedown', (e) => {

    if (e.clientY - (pointerwhiteH / 2) <= colorchoseY) {

        pointer.style.top = 0 + 'px'
        pointerY = 0

    } else if (colorchoseY + colorchoseH <= e.clientY + pointerwhiteH) {

        pointer.style.top = colorchoseH - pointerH + 'px'
        pointerY = Math.round(colorchoseH - pointerH)

    } else {

        pointer.style.top = e.clientY - colorchoseY - (pointerwhiteH / 2) + 'px'
        pointerY = Math.round(e.clientY - colorchoseY - (pointerwhiteH / 2))

    }

    calpointer()

})

function calcursor(){
    cursorXRatio = (cursorX / pickerW) *100
    cursorYRatio = (cursorY / pickerH) *100
    pointerYRatio = (pointer.getBoundingClientRect().top - colorchose.getBoundingClientRect().top) / (colorchoseH - pointerH) * 100

    H = ( pointerYRatio / 100) * 360
    S = cursorXRatio
    B = 100 - cursorYRatio

    RGB = HSBToRGB(H,S,B)
    Red = Math.round(RGB[0])
    Green = Math.round(RGB[1])
    Blue = Math.round(RGB[2])

    HEX = RGBToHex(Red,Green,Blue)

    inputR.value = Red
    inputG.value = Green
    inputB.value = Blue
    inputhex.value = HEX

    h.style = 'background:hsl(' + H + ',100%, 50%)'
    colorshow.style = 'background:rgb(' + Red + ',' + Green + ',' + Blue + ')'
}


function calpointer(){

    cursorY = cursor.getBoundingClientRect().top + cursorH/2 - picker.getBoundingClientRect().top 
    cursorX = cursor.getBoundingClientRect().left + cursorW/2 - picker.getBoundingClientRect().left 

    pointerYRatio = Math.round((pointerY / (colorchoseH - pointerH))*100)
    cursorXRatio = (cursorX / pickerW) *100
    cursorYRatio = (cursorY / pickerH) *100

    H = ( pointerYRatio / 100) * 360
    S = cursorXRatio
    B = 100 - cursorYRatio

    RGB = HSBToRGB(H,S,B)
    Red = Math.round(RGB[0])
    Green = Math.round(RGB[1])
    Blue = Math.round(RGB[2])

    HEX = RGBToHex(Red,Green,Blue)

    inputR.value = Red
    inputG.value = Green
    inputB.value = Blue
    inputhex.value = HEX

    h.style = 'background:hsl(' + H + ',100%, 50%)'
    colorshow.style = 'background:rgb(' + Red + ',' + Green + ',' + Blue + ')'

}

inputR.addEventListener('input', RGBchange)
inputG.addEventListener('input', RGBchange)
inputB.addEventListener('input', RGBchange)
inputhex.addEventListener('input', HEXchange)

function RGBchange() {

    Red = parseInt(inputR.value)
    Green = parseInt(inputG.value)
    Blue = parseInt(inputB.value)

    if (Red > 255) {
        Red = 255
        inputR.value = 255
    } else if (Red <= 0) {
        Red = 0
        inputR.value = 0
    } else if (isNaN(Red)) {
        Red = 0
        inputR.value = 0
    } else {
        Red = parseInt(String(inputR.value), 10)
    }

    if (Green > 255) {
        Green = 255
        inputG.value = 255
    } else if (Green <= 0) {
        Green = 0
        inputG.value = 0
    } else if (isNaN(Green)) {
        Green = 0
        inputG.value = 0
    } else {
        Green = parseInt(String(inputG.value), 10)
    }

    if (Blue > 255) {
        Blue = 255
        inputB.value = 255
    } else if (Blue <= 0) {
        Blue = 0
        inputB.value = 0
    } else if (isNaN(Blue)) {
        Blue = 0
        inputB.value = 0
    } else {
        Blue = parseInt(String(inputB.value), 10)
    }



    HSB = RGBToHSB(Red, Green, Blue)

    H = Math.round(HSB[0])
    S = Math.round(HSB[1])
    B = Math.round(HSB[2])

    HEX = RGBToHex(Red, Green, Blue)

    pointerYRatio = H / 360
    cursorXRatio = S / 100
    cursorYRatio = (100 - B) / 100

    cursor.style.left = cursorXRatio * pickerW + 'px'
    cursor.style.top = cursorYRatio * pickerH + 'px'
    pointer.style.top = (pointerYRatio * (colorchoseH - pointerH)) + 'px'

    h.style = 'background:hsl(' + H + ',100%, 50%)'
    colorshow.style = 'background:rgb(' + Red + ',' + Green + ',' + Blue + ')'
    inputhex.value = HEX

}

function HEXchange() {

    HEX = inputhex.value

    RGB = hexToRGB(HEX).slice(4, -1).split(',')
    let rRed = Number(RGB[0])
    let gGreen = Number(RGB[1])
    let bBlue = Number(RGB[2])

    HSB = RGBToHSB(rRed, gGreen, bBlue)

    H = Math.round(HSB[0])
    S = Math.round(HSB[1])
    B = Math.round(HSB[2])

    pointerYRatio = H / 360
    cursorXRatio = S / 100
    cursorYRatio = (100 - B) / 100

    cursor.style.left = cursorXRatio * pickerW + 'px'
    cursor.style.top = cursorYRatio * pickerH + 'px'
    pointer.style.top = (pointerYRatio * (colorchoseH - pointerH)) + 'px'

    h.style = 'background:hsl(' + H + ',100%, 50%)'
    colorshow.style = 'background:rgb(' + rRed + ',' + gGreen + ',' + bBlue + ')'

    inputR.value = rRed
    inputG.value = gGreen
    inputB.value = bBlue

}


window.onload = function () {

    inputR.value = 0
    inputG.value = 0
    inputB.value = 0
    inputhex.value = '000000'

}

window.onresize = function () {

    location.reload()

}