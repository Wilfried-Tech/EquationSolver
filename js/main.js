"use strict"

const variableInput = document.querySelector("#variable");
const equationContainer = document.querySelector('.equations-content');
const equationsErrorContainer = document.querySelector('.equations-error');
const resolveButton = document.querySelector('.solve .button');
const solutionContainer = document.querySelector('.solution-content');

var nbVariable = Number(variableInput.value);

addInputs(equationContainer, nbVariable);


variableInput.addEventListener("input", debouce(function () {
    nbVariable = Number(variableInput.value);
    equationContainer.innerHTML = "";
    addInputs(equationContainer, nbVariable);
}, 250))


resolveButton.addEventListener("click", function () {
    if (resolveButton.hasAttribute("disabled")) return;

    resolveButton.lastElementChild.style.display = "block";
    resolveButton.setAttribute("disabled", true);
    clearContent(".equation+input")
    equationsErrorContainer.innerHTML = ""
    solutionContainer.innerHTML = ""

    var equationsInfoArr;
    var equationObjectArr = [];
    var invalidCharacters = false;
    var properEquation = true;
    var empty = false;
    var noError = false;

    equationsInfoArr = Array.prototype.map.call(equationContainer.querySelectorAll("input"), function (input) {
        //input.disabled = true;
        return {
            input: input,
            value: input.value
        }
    });

    equationsInfoArr.forEach((equationInfo, i) => {
        var equation = equationInfo.value.replace(/ /g, "");
        var errorSpan = equationInfo.input.nextElementSibling;

        errorSpan.innerHTML = ""

        if (equation == "") {
            empty = true;
            errorSpan.textContent = `Be sure to correctly fill in the field !`;

        } else if (/[^a-z0-9+./=-]+/.test(equation)) {
            invalidCharacters = true;
            errorSpan.innerHTML = `characters other than "a-z 0-9 . /" are not allowed<br/>
            NB: replace commas with a dot`;

        } else if (/^([a-z0-9+./-])+(=)([a-z0-9+./-])+$/.test(equation)) {
            equationObjectArr.push(createEquationObject(equation));

        } else {
            properEquation = false;
            errorSpan.innerHTML = `equation of this system are not correctly writted`;
        }
    })

    if (!empty && !invalidCharacters && properEquation) {
        var result = checkoutEquationObject(equationObjectArr, nbVariable);
        if (result[0]) {
            noError = true;
        } else {
            var errors = result[1];
            if (typeof errors == "string") {
                equationsErrorContainer.innerHTML = errors;
            } else {
                for (const key in errors) {
                    if (Object.hasOwnProperty.call(errors, key)) {
                        equationsInfoArr[Number(key)].input.nextElementSibling.innerHTML = errors[key];
                    }
                }
            }
        }
    }

    if (noError) {
        var [MatrixA, MatrixX, MatrixC] = createMatrixFromObject(equationObjectArr);
        var _det = det(MatrixA);

        if (_det == 0) {
            var info = checkoutEquation(MatrixA, MatrixC);
            if (info.infinite) {
                solutionContainer.insertAdjacentHTML('beforeend', `
                <p> S = {&varnothing;} </p>
                `);
            }
            if (info.isVoid) {
                solutionContainer.insertAdjacentHTML('beforeend', `
                <p>
                    <span class="solution-variable">S</span>
                     = {&varnothing;} 
                </p>
                `);
            }
        } else {
            var result = multiply(invert(MatrixA), MatrixC);
            result.forEach((res, i) => {
                solutionContainer.insertAdjacentHTML('beforeend', `
                <p>
                    <span class="solution-variable">${MatrixX[i][0]}</span>
                    =
                    <span class="solution-value">${toFraction(res)}</span>
                </p>`);
            })
        }
    }

    resolveButton.lastElementChild.style.display = "none";
    resolveButton.removeAttribute("disabled");
})