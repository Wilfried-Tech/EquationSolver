"use strict"

/**
 *  
 * @param {Function} callback 
 * @param {Number} delay the waiting time before call the callback function
 * @returns {Function} lazy function
 */
function debouce(callback, delay) {
  let timer;
  return function() {
    let args = arguments,
      context = this
    clearTimeout(timer)
    timer = setTimeout(function() {
      callback.apply(context, args)
    }, delay)
  }
}


/**
 * Create the asked number of HTMLInputElement then append it to the container element
 *
 * @param {HTMLDivElement} container 
 * @param {Number} count 
 */
function addInputs(container, count) {
  for (var i = 0; i < count; i++) {
    //var x = ['x+y=1','x-y=0'][i%2]
    container.insertAdjacentHTML('beforeend', `
        <p>
            <input type="text" value='${x}' class="equation ${(i % 2 == 0) ? "even" : "odd"}" />
            <span class="equation-error"></span>
        </p>
        `);
  }
}


/**
 * clear all thing in the tags that match selector
 * 
 * @param {String} selector css selector
 */
function clearContent(selector) {
  document.querySelectorAll(selector).forEach(elt => { elt.innerHTML = "";
    console.log(elt) })
}


/**
 * @typedef EquationObject
 * @property {Number} EquationObject.const
 * 
 * Parse an equation string to his object notation
 * 
 * @param {String} equation 
 * @returns {EquationObject}
 */
function createEquationObject(equation) {

  var digit = '',
    variable = '',
    gotEqual = false,
    number = 1,
    equationObject = {};

  function createObject(variable, val, gotEqual) {
    if (gotEqual) {
      val *= -1;
    }
    if (equationObject[variable]) {
      equationObject[variable] += val;
    } else {
      equationObject[variable] = val;
    }
  }
  equation.toLowerCase().replace(/ /g, '').split('').forEach((char, index) => {

    if (/^[0-9\.\/]$/.test(char)) {
      digit += char;
    }
    if (/^[a-zA-Z]$/.test(char)) {
      variable += char;
    }
    if (/^[=\+\-]$/.test(char) || index == equation.length - 1) {
      if (variable) {
        if (digit) {
          number *= parseFloat(eval(digit));
          createObject(variable, number, gotEqual);
          digit = variable = '';
          number = 1;
        } else {
          createObject(variable, number, gotEqual);
          digit = variable = '';
          number = 1;
        }
      } else if (digit) {
        number *= parseFloat(eval(digit));
        createObject('const', number, gotEqual);
        number = 1;
        digit = variable = '';
      }
    }
    if (char == '-') {
      number *= -1;
    }
    if (char == '=') {
      gotEqual = true;
    }
  });

  if (!equationObject.hasOwnProperty('const')) {
    equationObject['const'] = 0;
  }

  equationObject.const *= -1;

  return equationObject;
}


/**
 * 
 * @param {Array<EquationObject>} equationObjectArr
 * @param {Number} nbVariable
 * @returns {[Boolean, any|String]}
 */
function checkoutEquationObject(equationObjectArr, nbVariable) {
  var equationsVarCount = [];
  var pivotEquation = null;
  var errors = {};

  // check equation variables
  equationObjectArr.forEach((equationObject, i) => {
    equationsVarCount.push(Object.getOwnPropertyNames(equationObject).length - 1);

    if (equationsVarCount[i] > nbVariable) {
      errors[i] = `the number of variable are greater than ${nbVariable}<br>there are ${equationsVarCount[i]} variable here`;
    }

    if (equationsVarCount[i] == 0) {
      errors[i] = `there are no variable there !`;
    }

  })

  if (Object.getOwnPropertyNames(errors).length != 0) return [false, errors];

  // select equation that have the greater number of variable
  pivotEquation = equationObjectArr[equationsVarCount.indexOf(nbVariable)];

  //set missing variable coefficient to 0
  if (pivotEquation != null) {
    Object.getOwnPropertyNames(pivotEquation).forEach(variable => {
      if (variable != "const") {
        equationObjectArr.forEach(equationObject => {
          if (!equationObject.hasOwnProperty(variable)) {
            equationObject[variable] = 0;
          }
        })
      }
    })
  } else {
    errors = `there are less variable than ${nbVariable} in all fields`;
  }

  if (Object.getOwnPropertyNames(errors).length != 0) return [false, errors];

  var variables = Object.getOwnPropertyNames(pivotEquation).sort().join("");
  var check = true;

  // verify if all variable are same in all equations
  equationObjectArr.forEach(equationObject => {
    if (Object.getOwnPropertyNames(equationObject).sort().join("") != variables) {
      errors = `variable names does not change between equations`;
      check = false;
    }
  })
  return [check, errors];
}


/**
 * create matrix from equations objects
 * 
 * @param {EquationObject[]} equationObjectArr
 * @returns {Array<Number[][]>}
 */
function createMatrixFromObject(equationObjectArr) {

  var MatrixX = [],
    MatrixA = [],
    MatrixC = [];

  //store variable names
  Object.getOwnPropertyNames(equationObjectArr[0]).forEach(variable => {
    if (variable != 'const') MatrixX.push([variable]);
  });

  equationObjectArr.forEach(equationObject => {

    MatrixC.push([equationObject['const']]);

    var tempRow = [];

    for (var [prop] of MatrixX) {
      tempRow.push(equationObject[prop]);
    }

    MatrixA.push(tempRow);
  });

  return [MatrixA, MatrixX, MatrixC];
}


/**
 * 
 * @param {Number} number 
 * @returns 
 */
function toFraction(number) {
  //console.log(number);
  var positif = true;
  if (number < 0) {
    positif = false;
    number *= -1;
  }
  let reciproque = (number % 1 == 0) ? 1 : 1 / (number % 1);
  let denominateur = reciproque;
  const limite = 10;
  for (let i = 0; i < limite && Number.isInteger(Math.round(reciproque * 10 ** (limite - i)) / 10 ** (limite - i)) != true; i++) {
    reciproque = 1 / (reciproque % 1);
    denominateur *= reciproque;
  }

  return renderFraction(
    ((positif) ? Math.round(number * denominateur) : Math.round(number * denominateur) * -1) +
    ((Math.round(denominateur) == 1) ? "" : "/" + Math.round(denominateur))
  );
}


/**
 * 
 * @param {Number} a 
 * @param {Number} b 
 * @returns {Number}
 */
function GCD(a, b) {
  return b ? (a > b ? GCD(b, a % b) : GCD(a, b % a)) : a;
}


/**
 * 
 * @param {Number[]} arr 
 * @returns {Number}
 */
function Array_GCD(arr) {
  var ten = 1;
  arr.forEach(elt => {
    var temp = `${elt}`.match(/\.(.*)/);
    if (temp) ten = Math.pow(10, temp[1].length);
  })
  arr = arr.map(x => { return x * ten });
  var result = arr[0];
  for (var i = 1; i < arr.length; i++) {
    result = GCD(result, arr[i])
  }
  arr = arr.map(x => { return x / (result * ten) })
  return arr;
}


/**
 * 
 * @param {Number[][]} MatrixA 
 * @param {Number[][]} matrixB
 * @returns {{infinite: Boolean, isVoid: Boolean}}
 */
function checkoutEquation(MatrixA, matrixB) {
  var infinite = false,
    isVoid = true;

  for (var row = 0; row < MatrixA.length; row++) {
    MatrixA[row].push(matrixB[row][0])
    MatrixA[row] = Array_GCD(MatrixA[row]);
  }
  for (var row = 0; row < MatrixA.length - 1; row++) {
    infinite = false;
    isVoid = false;
    for (var col = 0; col < MatrixA[0].length; col++) {
      if (MatrixA[row][col] == MatrixA[row + 1][col] || (!MatrixA[row][col] && !MatrixA[row + 1][col])) {
        infinite = true;
      } else {
        isVoid = true;
      }
    }
  }
  return { infinite: infinite, isVoid: isVoid }
}


/**
 * @param {String} string
 * @returns {String}
 */
function renderFraction(string) {
  if (!string.includes('/')) return string;
  const [num, den] = string.split('/')
  return `<span>${num.trim()}</span><hr height='1'><span>${den}</span>`
}