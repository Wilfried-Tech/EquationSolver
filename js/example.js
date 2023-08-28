const exempleBtn = document.querySelector('.solve-examples')

/**
 * @param {HTMLElement|String} elt
 * 
 */
function mark(elt) {
  elt = elt instanceof HTMLElement ? [elt] : document.querySelectorAll(elt)
  const elts = Array.from(elt)
  yield elts
}


exempleBtn.addEventListener('click', function() {
  
})