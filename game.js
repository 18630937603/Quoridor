const count = 9;//棋盘的行数和列数
const rectWH = 60; //设置绘制矩形的大小，目前无法修改
const lineWid = 10; // 设置边框的粗细，目前无法修改
drawBoardLine();
/*准备工作：初始化棋子,canvas的上下文*/
const black = new Image();
const white = new Image();
black.src = "img/black.png";
white.src = "img/white.png";
const boardDOM = document.querySelector("#board");
const boardContext = boardDOM.getContext("2d");
const piecesDOM = document.querySelector("#pieces");
const piecesContext = piecesDOM.getContext("2d");
const highlightDOM = document.querySelector('#highlight');
const highlightContext = highlightDOM.getContext("2d");
highlightContext.globalAlpha = 0.7     //  设置高亮层的全局透明度
piecesContext.fillStyle = 'rgb(252,184,0)'


const mousePos = {    // 记录鼠标目前位置的对象
    m: -1,
    n: -1,
    onBlock: false,
    onVerticalLineTopHalf: false,
    onVerticalLineLowerHalf: false,
    onHorizontalLineLeftHalf: false,
    onHorizontalLineRightHalf: false,
    horizontalBaffleMNs: [],
    verticalBaffleMNs: []
}

// 鼠标位置的数据代理
const mp = new Proxy(mousePos, {
    set(target, key, value) {
        if (target[key] !== value) {
            if (value === true) {
                target["onBlock"] = false;
                target["onVerticalLineLowerHalf"] = false;
                target["onVerticalLineTopHalf"] = false;
                target["onHorizontalLineLeftHalf"] = false;
                target["onHorizontalLineRightHalf"] = false;
            }
            target[key] = value
            renderHighlights()
        }
    }
})


const gameStatus = {    // 记录当前游戏信息的对象
    blackM: 8,
    blackN: 4,
    whiteM: 0,
    whiteN: 4,
    isBlackTurn: true,
    horizontalBaffleMNs: [],
    verticalBaffleMNs: []
}

// 游戏信息的数据代理
const gs = new Proxy(gameStatus, {
    set(target, key, value) {
        target[key] = value
    }
})


white.onload = function () {
    drawPiece(piecesContext, white, 0, 4, false);
}
black.onload = function () {
    drawPiece(piecesContext, black, 8, 4, false);
}


piecesDOM.addEventListener('mousemove', function (e) {
    let x = e.clientX;
    let y = e.clientY;
    let isBlock = 0
    let n = x % 60
    let m = y % 60
    mp.m = Math.floor(y / 60);
    mp.n = Math.floor(x / 60);
    if (n <= 10) {   // 代表在竖直的一条线上
        if (m > 10 && m <= 35) {  // 代表在垂直线水平的上半部分
            mp.onVerticalLineTopHalf = true
        } else if (m > 35 && m < 60) {  // 代表在垂直线水平的下半部分
            mp.onVerticalLineLowerHalf = true
        }
    } else {
        isBlock++
    }
    if (m <= 10) {  // 在水平的一条线上
        if (n > 10 && n <= 35) {  // 代表在水平线垂直的左半部分
            mp.onHorizontalLineLeftHalf = true
        } else if (n > 35 && n < 60) {  // 代表在水平线垂直的右半部分
            mp.onHorizontalLineRightHalf = true
        }
    } else {
        isBlock++
    }
    if (isBlock === 2) {  // 代表在方块里面
        mp.onBlock = true
    }
})

piecesDOM.addEventListener('click', function () {
    if (mp.onBlock) {
        if (gs.isBlackTurn) {
            gs.blackM = mp.m
            gs.blackN = mp.n
        } else {
            gs.whiteM = mp.m
            gs.whiteN = mp.n
        }
    }else{
        if (mousePos['onVerticalLineLowerHalf'] === true) {
            gs.verticalBaffleMNs.push([mousePos.m, mousePos.n])
            mousePos.m + 1 < count ? gs.verticalBaffleMNs.push([mousePos.m + 1, mousePos.n]) : null
        } else if (mousePos['onVerticalLineTopHalf'] === true) {
            gs.verticalBaffleMNs.push([mousePos.m, mousePos.n])
            mousePos.m - 1 >= 0 ? gs.verticalBaffleMNs.push([mousePos.m - 1, mousePos.n]) : null
        } else if (mousePos['onHorizontalLineLeftHalf'] === true) {
            gs.horizontalBaffleMNs.push([mousePos.m, mousePos.n])
            mousePos.n - 1 >= 0 ? gs.horizontalBaffleMNs.push([mousePos.m, mousePos.n - 1]) : null
        } else if (mousePos['onHorizontalLineRightHalf'] === true) {
            gs.horizontalBaffleMNs.push([mousePos.m, mousePos.n])
            mousePos.n + 1 < count ? gs.horizontalBaffleMNs.push([mousePos.m, mousePos.n + 1]) : null
        }
    }
    piecesContext.clearRect(0, 0, 550, 550)
    drawPiece(piecesContext, black,gs.blackM,gs.blackN)
    drawPiece(piecesContext, white,gs.whiteM,gs.whiteN)
    drawBaffles(piecesContext, gs)
    gs.isBlackTurn = !gs.isBlackTurn
})

function drawBoardLine() {
    const boardDOM = document.querySelector("#board");
    const boardContext = boardDOM.getContext("2d");
    //开始绘制 1绘制棋盘线
    boardContext.strokeStyle = "rgba(0,0,0,0.2)";
    boardContext.lineWidth = lineWid;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            boardContext.strokeRect(j * rectWH + lineWid / 2, i * rectWH + lineWid / 2, rectWH, rectWH);
        }
    }
    boardContext.strokeStyle = "rgba(0,0,0,1)";
    boardContext.strokeRect(lineWid / 2, lineWid / 2, 550 - lineWid, 550 - lineWid)
}


// 绘制棋子
function drawPiece(ctx, img, m, n) {
    // piecesContext.globalAlpha(0.5)
    ctx.drawImage(img, 17 + 60 * n, 18 + 60 * m)
    // piecesContext.globalAlpha(1)
}


// 绘制障碍
function drawBaffles(ctx, obj) {
    if(gs.isBlackTurn){
        highlightContext.fillStyle = 'rgba(0,0,0,0.8)'
    }else{
        highlightContext.fillStyle = 'rgba(229,227,227,1)'
    }
    for (let i of obj.horizontalBaffleMNs) {
        const centerX = 35 + 60 * i[1]
        const centerY = 65 + 60 * (i[0] - 1)
        ctx.fillRect(centerX - 25, centerY - 5, 50, 10)
    }
    for (let i of obj.verticalBaffleMNs) {
        const centerX = 65 + 60 * (i[1] - 1)
        const centerY = 35 + 60 * i[0]
        ctx.fillRect(centerX - 5, centerY - 25, 10, 50)
    }
}

function renderHighlights() {   // 根据鼠标当前位置渲染图形
    highlightContext.clearRect(0, 0, 550, 550)
    mousePos.horizontalBaffleMNs = [];
    mousePos.verticalBaffleMNs = []
    if (mousePos['onBlock'] === true) {   // 预显示棋子要下的位置
        if (gs.isBlackTurn) {
            drawPiece(highlightContext, black, mousePos.m, mousePos.n)
        } else {
            drawPiece(highlightContext, white, mousePos.m, mousePos.n)
        }
    } else {
        if (mousePos['onVerticalLineLowerHalf'] === true) {
            mousePos.verticalBaffleMNs.push([mousePos.m, mousePos.n])
            mousePos.m + 1 < count ? mousePos.verticalBaffleMNs.push([mousePos.m + 1, mousePos.n]) : null
        } else if (mousePos['onVerticalLineTopHalf'] === true) {
            mousePos.verticalBaffleMNs.push([mousePos.m, mousePos.n])
            mousePos.m - 1 >= 0 ? mousePos.verticalBaffleMNs.push([mousePos.m - 1, mousePos.n]) : null
        } else if (mousePos['onHorizontalLineLeftHalf'] === true) {
            mousePos.horizontalBaffleMNs.push([mousePos.m, mousePos.n])
            mousePos.n - 1 >= 0 ? mousePos.horizontalBaffleMNs.push([mousePos.m, mousePos.n - 1]) : null
        } else if (mousePos['onHorizontalLineRightHalf'] === true) {
            mousePos.horizontalBaffleMNs.push([mousePos.m, mousePos.n])
            mousePos.n + 1 < count ? mousePos.horizontalBaffleMNs.push([mousePos.m, mousePos.n + 1]) : null
        }
        drawBaffles(highlightContext, mousePos)
    }
}
