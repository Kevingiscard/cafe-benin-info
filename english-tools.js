'use strict';
function updateEnglishTools(){
 const value=id=>Number(document.getElementById(id).value);
 const valid=id=>{const e=document.getElementById(id);return e.value.trim()!==''&&e.checkValidity()&&Number.isFinite(value(id));};
 document.getElementById('en-dose').textContent=['en-water','en-ratio'].every(valid)?'Dry coffee: '+(value('en-water')/value('en-ratio')).toFixed(1)+' g':'Enter positive values within the stated limits.';
 document.getElementById('en-yield').textContent=['en-espresso','en-yield-ratio'].every(valid)?'Target beverage: '+(value('en-espresso')*value('en-yield-ratio')).toFixed(1)+' g':'Enter positive values within the stated limits.';
}
document.querySelectorAll('.cb-reading input').forEach(e=>e.addEventListener('input',updateEnglishTools));updateEnglishTools();
