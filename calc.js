const buttons = document.getElementsByClassName("btn");
const number = document.getElementsByClassName("digits");
const screen = document.getElementById("screen");
const angleMode = document.getElementById("angleMode")

function backspace(){
    let str = screen.innerHTML;
    screen.innerHTML = str.slice(0,str.length-1)
}

function clrscr(){
    screen.innerHTML = ""
}

function evaluate(str){
    let newstr = "";

    newstr = str.replace("÷","/");
    newstr = newstr.replace("^","**")

    // console.log(newstr)
    return newstr;
}


function calculate(){
    expression = evaluate(screen.innerHTML);
    screen.innerHTML = eval(expression);
}

function angleToogle(){
    if(angleMode.innerHTML == "DEG"){
        angleMode.innerHTML = "RED";
    }else{
        angleMode.innerHTML = "DEG"; 
    }
}