/*准备工作： 1获取画布，获取画笔对象 */
let canvasDOM = document.querySelector("canvas");
let ctx = canvasDOM.getContext("2d");

/*准备工作：2创建一个二维数组 用来定义绘制棋盘线*/
let count = 9;//用来定义棋盘的行数和列数

let board = new Array(count).fill(0).map(x => new Array(count).fill(0))

/*准备工作：3初始化棋子*/
let black = new Image();
let white = new Image();
black.src = "img/black.png";
white.src = "img/white.png";


//开始绘制 1绘制棋盘线
// ctx.strokeStyle = "#eeeeee";
ctx.strokeStyle = "rgba(0,0,0,0.2)";
const lineWid = 10
ctx.lineWidth = lineWid;
// ctx.globalAlpha = 0.5
const rectWH = 60; //设置绘制矩形的大小
for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
        ctx.strokeRect(j * rectWH + lineWid / 2, i * rectWH + lineWid / 2, rectWH, rectWH);
    }
}
ctx.strokeStyle = "rgba(0,0,0,1)";
ctx.strokeRect(lineWid/2,lineWid/2,550-lineWid,550-lineWid)
// ctx.strokeRect(5,5,540,540)
// ctx.strokeRect(5,5,540,540)
canvasDOM.addEventListener('click',play)

//开始绘制 2下子
function play(e) {
    //获取点击canvas的位置值默认，canvas的左上角为（0,0） 点
    let x = e.clientX;
    let y = e.clientY;
    // console.log(x+" "+y);
    let isBlock = 0
    let m = 0
    let n = 0
    if(x%rectWH <= lineWid){
        console.log('columnLine' + Math.floor(x/rectWH))
    }else{
        console.log('columnBlock' + Math.floor(x/rectWH))
        n = Math.floor(x/rectWH)
        isBlock++
    }
    if(y%rectWH <= lineWid){
        console.log('rowLine' + Math.floor(y/rectWH))
    }else{
        console.log('rowBlock' + Math.floor(y/rectWH))
        m = Math.floor(y/rectWH)
        isBlock++
    }
    console.log(m,n)
    console.log(board[m][n])
    if(isBlock===2){
        
    }
}

