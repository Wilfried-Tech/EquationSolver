const exempleBtn = document.querySelector(".solve-examples .button");

function sleep(time, func) {
  return new Promise((resolve) => setTimeout(() => resolve(func()), time));
}

/**
 * @param {HTMLElement|String} elt
 * @param {Function<HTMLElement, Number>} func
 */
async function mark(elt, func) {
  elt = elt instanceof Object ? elt : document.querySelectorAll(elt);
  const elts = Array.from(elt);
  for (let index = 0; index < elts.length; index++) {
    elts[index].id = "mark-active";
    await sleep(1000, func.bind(Function, elts[index], index));
    elts[index].id = "";
  }
}

const examples = [
  {
    nbVariable: 1,
    equations: ["2x+20=1"],
  },
  {
    nbVariable: 2,
    equations: ["x+5y=60", "2y+8x=62"],
  },
  {
    nbVariable: 2,
    equations: ["x+5y=2", "3x+2y=17/5"],
  },
  {
    nbVariable: 2,
    equations: ["x+y=1", "x-y=0"],
  },
  {
    nbVariable: 3,
    equations: ["a+b+c=30", "2a+3b+4c=100", "a-1/2b+3c=45"],
  },
];

exempleBtn.addEventListener("click", async function () {
  if (exempleBtn.hasAttribute("disabled")) return;
  await spinning(exempleBtn);

  const exemple = examples[Math.floor(Math.random() * examples.length)];

  await mark([variableInput], async function (elt, i) {
    elt.value = exemple.nbVariable;
    addInputs(equationContainer, exemple.nbVariable)
    await sleep(500, () => null);
  });

  await mark(equationContainer.querySelectorAll("input"), function (elt, i) {
    elt.value = exemple.equations[i];
  });

  await mark([resolveButton], async function (elt, i) {
    elt.click()
    await sleep(500, () => null);
  });

  clearSpinning(exempleBtn);
});
