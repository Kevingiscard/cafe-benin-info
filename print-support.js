'use strict';
// Native closed details can remain unprintable despite display rules in some engines.
// Expand only for printing, then restore the reader's current choices.
(()=>{
 let states=[];
 window.addEventListener('beforeprint',()=>{states=[...document.querySelectorAll('details')].map(el=>[el,el.open]);states.forEach(([el])=>{el.open=true;});});
 window.addEventListener('afterprint',()=>{states.forEach(([el,open])=>{el.open=open;});states=[];});
})();
