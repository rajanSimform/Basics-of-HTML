const calcScreen = document.getElementById("calcScreen") as HTMLDivElement;
const angleMode = document.getElementById("angleMode") as HTMLButtonElement;
const symbols: string[] = ["+", "-", "*", "/"];
const factorial = (n:number):number => (n <= 0 ? 1 : n * factorial(n - 1));
const Maths = {
  DEG: "DEG",
  RED: "RED",
  SIN: "sin ",
  COS: "cos ",
  TAN: "tan ",
  LOG: "log ",
  LN: "ln ",
  ABS: "ABS ",
  FLOOR: "FLOOR ",
  CEIL: "CEIL ",
  ROUND: "ROUND ",
};

let backspace = ():void => {
  let str = calcScreen.innerHTML;
  calcScreen.innerHTML = str.slice(0, str.length - 1);
};

let clrscr = ():void => {
  calcScreen.innerHTML = "";
};

let MathDotFact = (str:string, cb:string, eleArray:string[]):string => {
  //replace all fact and give its real value(ans)
  eleArray.forEach((ele) => {
    let temp = `${cb}(${ele})`;
    str = str.replace(ele + "!", temp);
  });
  return str;
};

let fact = (str:string):string[] => {
  let oprand:string[] = [];
  //check if factorial is there in str
  if (str.search("!") !== -1) {
    let factFound:number[] = [];
    str.split("").forEach((ele, index) => {
      if (ele === "!") {
        factFound.push(index);
      }
    });

    //find the oparand to which it is applied
    factFound.forEach((ele) => {
      let start = ele - 1; //starting index
      let pCount = 0; //for parenthesis
      let expr = "";
      while (start >= 0) {
        if (str[start] === ")") {
          pCount++;
        } else if (str[start] === "(") {
          pCount--;
        }
        if (symbols.includes(str[start]) && pCount === 0) break;
        else {
          expr = str[start] + expr;
        }
        start--;
      }
      //console.log(pCount);
      oprand.push(expr); //when expression is found pushed to oprands
    });
    //console.log(oprand)
  }
  return oprand;
};

let mathFun = (str:string, cb:string, s:string, angle = ""):string => {
  //console.log(str,cb,s,angle);
  let oprand:string[] = [];
  //check if func is there in str
  if (str.search(s) !== -1) {
    let found:number[] = [];
    //found index of each occurance of func and push into found[]
    for (let i = 0; i < str.length - s.length + 1; i++) {
      if (str.substring(i, s.length + i) === s) {
        found.push(i);
      }
    }

    //find the oparand to which func is applied
    found.forEach((ele) => {
      let start = ele + s.length; //starting index
      let pCount = 0; //for parenthesis
      let expr = "";
      while (start < str.length) {
        if (str[start] === "(") {
          pCount++;
        } else if (str[start] === ")") {
          pCount--;
        }
        if (symbols.includes(str[start]) && pCount === 0) break;
        else {
          expr += str[start];
        }
        start++;
      }
      oprand.push(expr); //when expression is found pushed to oprands
    });

    if (angle === Maths.DEG) {
      let degAngle:string[] = [];
      oprand.forEach((ele) => {
        let prev = ele;
        ele = ((eval(ele) * Math.PI) / 180).toString();
        // change str parameter which are in degree to angle
        str = str.replace(prev, ele);
        degAngle.push(ele);
      });
      //call the function with deg-to-red value and return ans
      degAngle.forEach((ele) => {
        let temp = `${cb}(${ele})`;
        str = str.replace(s + ele, temp);
      });
      return str;
    } else {
      //for other functions
      oprand.forEach((ele) => {
        let temp = `${cb}(${ele})`;
        str = str.replace(s + ele, temp);
      });
      return str;
    }
  }
  return str;
};

let evaluate = (str:string):string => {
  let newstr = "";

  newstr = str.replace(/÷/g, "/");
  newstr = newstr.replace(/\^/g, "**");
  newstr = newstr.replace(/π/g, "Math.PI");
  newstr = newstr.replace(/e/g, "Math.E");

  if (angleMode.innerHTML === Maths.DEG) {
    newstr = mathFun(newstr, "Math.sin", Maths.SIN, Maths.DEG);
    newstr = mathFun(newstr, "Math.cos", Maths.COS, Maths.DEG);
    newstr = mathFun(newstr, "Math.tan", Maths.TAN, Maths.DEG);
  } else {
    newstr = mathFun(newstr, "Math.sin", Maths.SIN, Maths.RED);
    newstr = mathFun(newstr, "Math.cos", Maths.COS, Maths.RED);
    newstr = mathFun(newstr, "Math.tan", Maths.TAN, Maths.RED);
  }

  newstr = mathFun(newstr, "Math.sqrt", "√");
  newstr = mathFun(newstr, "Math.log10", Maths.LOG);
  newstr = mathFun(newstr, "Math.log", Maths.LN);
  newstr = mathFun(newstr, "Math.abs", Maths.ABS);

  newstr = mathFun(newstr, "Math.ceil", Maths.CEIL);
  newstr = mathFun(newstr, "Math.floor", Maths.FLOOR);
  newstr = mathFun(newstr, "Math.round", Maths.ROUND);

  let factEle = fact(newstr);
  newstr = MathDotFact(newstr, "factorial", factEle);
  //console.log(newstr)
  return newstr;
};

let calculate = () => {  

  let expression = evaluate(calcScreen.innerHTML);
  console.log(expression);
  
  let ans:number|string= eval(expression);
  
  // func for finding repeating pattern in decimals
  let getRepetend = (num:number|string) => {
    let m = (num + "").match(/\.(\d*?)(\d+)\2{4,}/);

    //  \. matches the decimal dot.
    // (\d*?) matches the digits between the decimal dot and the repetend, and captures the result into backreference number 1.
    // (\d+?) matches the repetend, and captures it into backreference number 2.
    // \2{4,} matches repetitions of the repetend 3 or more times.

    return m && { pattern: +m[2], index: m[1].length };
  }

  let pFound = getRepetend(ans);
  
  // round off the value from index of repeating element
  if (pFound && typeof ans === "number") {
    if (pFound.index === 0) pFound.index = 2;
    ans = ans.toFixed(pFound.index);
  }
  //console.log(typeof ans, ans);

  if(typeof ans === undefined){
    calcScreen.innerHTML = "";  
  }else{
    if(typeof ans === "number" && isNaN(ans)){
      calcScreen.innerHTML = "Bad Input"
    }else{
      calcScreen.innerHTML = ans.toString();
    }
  }
};

let angleToogle = () => {
  if (angleMode.innerHTML === Maths.DEG) {
    angleMode.innerHTML = Maths.RED;
  } else {
    angleMode.innerHTML = Maths.DEG;
  }
};

let dropdowntoogle = (id:string) => {
  document.getElementById(`${id}-menu`)!.classList.toggle("show");
};

let onDropnBtnClick = (id:string) => {
  calcScreen.innerHTML += `${id} `;
  if (id === "sin" || id === "cos" || id === "tan") {
    dropdowntoogle("trig");
  } else {
    dropdowntoogle("func");
  }
};

//this if IIFI for soring memory functions and variables
let Memory = (
  function () {
    let currentMemory:number = 0;
    let mmStore = () => {
      let expression = evaluate(calcScreen.innerHTML);
      (eval(expression) !== undefined && typeof eval(expression) === "number") 
        ? currentMemory = eval(expression)
        :currentMemory = 0;
      console.log("current memory stored as : " + currentMemory);
      document.getElementById("mc")!.classList.remove("disabled");
      document.getElementById("mr")!.classList.remove("disabled");
    }

    let mmClear = () => {
      currentMemory = 0;
      console.log("current memory reset to 0: " + currentMemory);
      document.getElementById("mc")!.classList.add("disabled");
      document.getElementById("mr")!.classList.add("disabled");
    }

    let mmRecall = () => {
      calcScreen.innerHTML = currentMemory.toString();
      console.log("Current Memory : " + currentMemory);
    }

    let mmAdd = () => {
      let expression = evaluate(calcScreen.innerHTML);
      let added = eval(expression);
      currentMemory += added;
      calcScreen.innerHTML = currentMemory.toString();
      console.log(`${added} is added to current memory.`);
      console.log("Current Memory : " + currentMemory);
    }

    let mmSub = () => {
      let expression = evaluate(calcScreen.innerHTML);
      let sub = eval(expression);
      currentMemory -= sub;
      calcScreen.innerHTML = currentMemory.toString();
      console.log(`${sub} is subtracted from current memory.`);
      console.log("Current Memory : " + currentMemory);
    }
    return {
      mmStore,
      mmAdd,
      mmSub,
      mmClear,
      mmRecall,
    };
  }
)();