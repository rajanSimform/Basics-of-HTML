const screen = document.getElementById("screen");
const angleMode = document.getElementById("angleMode");
const symbols = ["+", "-", "*", "/"];
const factorial = (n) => (n <= 0 ? 1 : n * factorial(n - 1));
const Maths = {
  DEG: "DEG",
  RED: "RED",
  SIN: "sin ",
  COS: "cos ",
  TAN: "tan ",
  LOG: "log ",
  LN: "ln ",
  ABS: "abs ",
  FLOOR: "floor ",
  CEIL: "ceil ",
  ROUND: "round ",
};

let backspace = () => {
  let str = screen.innerHTML;
  screen.innerHTML = str.slice(0, str.length - 1);
};

let clrscr = () => {
  screen.innerHTML = "";
};

let MathDotFact = (str, cb, eleArray) => {
  //replace all fact and give its real value(ans)
  eleArray.forEach((ele) => {
    let temp = `${cb}(${ele})`;
    str = str.replace(ele + "!", temp);
  });
  return str;
};

let fact = (str) => {
  let oprand = [];
  //check if factorial is there in str
  if (str.search("!") != -1) {
    let factFound = [];
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

let mathFun = (str, cb, s, angle = "") => {
  //console.log(str,cb,s,angle);
  let oprand = [];
  //check if func is there in str
  if (str.search(s.toSring) !== -1) {
    let found = [];
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
      let degAngle = [];
      oprand.forEach((ele) => {
        let prev = ele;
        ele = (eval(ele) * Math.PI) / 180;
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
};

let evaluate = (str) => {
  let newstr = "";

  newstr = str.replace("÷", "/");
  newstr = newstr.replace("^", "**");
  newstr = newstr.replace("π", "Math.PI");

  newstr = mathFun(newstr, "Math.sqrt", "√");
  newstr = mathFun(newstr, "Math.log10", Maths.LOG);
  newstr = mathFun(newstr, "Math.log", Maths.LN);
  newstr = mathFun(newstr, "Math.abs", Maths.ABS);

  newstr = mathFun(newstr, "Math.ceil", Maths.CEIL);
  newstr = mathFun(newstr, "Math.floor", Maths.FLOOR);
  newstr = mathFun(newstr, "Math.round", Maths.ROUND);

  if (angleMode.innerHTML === Maths.DEG) {
    newstr = mathFun(newstr, "Math.sin", Maths.SIN, Maths.DEG);
    newstr = mathFun(newstr, "Math.cos", Maths.COS, Maths.DEG);
    newstr = mathFun(newstr, "Math.tan", Maths.TAN, Maths.DEG);
  } else {
    newstr = mathFun(newstr, "Math.sin", Maths.SIN, Maths.RED);
    newstr = mathFun(newstr, "Math.cos", Maths.COS, Maths.RED);
    newstr = mathFun(newstr, "Math.tan", Maths.TAN, Maths.RED);
  }

  // here "e" is char so Ceil function call should not be disturbed
  newstr = newstr.replace("e", "Math.E");

  let factEle = fact(newstr);
  newstr = MathDotFact(newstr, "factorial", factEle);
  // console.log(newstr)
  return newstr;
};

let calculate = () => {
  let expression = evaluate(screen.innerHTML);
  let ans = eval(expression);
  // function getRepetend(num) {
  //   let m = (num+'').match(/\.(\d*?)(\d+?)\2+$/);
  //   return m && {pattern: +m[2], index: m[1].length};
  // }
  // let pattern = getRepetend(ans)
  // console.log(pattern);
  // if(pattern){
  //   if(pattern.index === 0) pattern.index = 1;
  //   ans = ans.toFixed(pattern.index)
  // }
  console.log(expression);
  screen.innerHTML = isNaN(ans) ? "Something went wrong" : ans;
};

let angleToogle = () => {
  if (angleMode.innerHTML === Maths.DEG) {
    angleMode.innerHTML = Maths.RED;
  } else {
    angleMode.innerHTML = Maths.DEG;
  }
};

let dropdowntoogle = (id) => {
  document.getElementById(`${id}-menu`).classList.toggle("show");
};

let onDropnBtnClick = (id) => {
  screen.innerHTML += `${id} `;
  if (id === "sin" || id === "cos" || id === "tan") {
    dropdowntoogle("trig");
  } else {
    dropdowntoogle("func");
  }
};

//this if IIFI for soring memory functions and variables
let Memory = (
  function () {
    let currentMemory = "0";
    function mmStore() {
      let expression = evaluate(screen.innerHTML);
      if (eval(expression) != undefined) currentMemory = eval(expression);
      else currentMemory = "0";
      console.log("current memory stored as :" + currentMemory);
      document.getElementById("mc").classList.remove("disabled");
      document.getElementById("mr").classList.remove("disabled");
    }

    function mmClear() {
      currentMemory = "0";
      console.log("current memory reset to 0:" + currentMemory);
      document.getElementById("mc").classList.add("disabled");
      document.getElementById("mr").classList.add("disabled");
    }

    function mmRecall() {
      screen.innerHTML = currentMemory;
      console.log("Current Memory :" + currentMemory);
    }

    function mmAdd() {
      let expression = evaluate(screen.innerHTML);
      let added = eval(expression);
      currentMemory += added;
      screen.innerHTML = currentMemory;
      console.log(`${added} is added to current memory.`);
      console.log("Current Memory :" + currentMemory);
    }

    function mmSub() {
      let expression = evaluate(screen.innerHTML);
      let sub = eval(expression);
      currentMemory -= sub;
      screen.innerHTML = currentMemory;
      console.log(`${sub} is subtracted from current memory.`);
      console.log("Current Memory :" + currentMemory);
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