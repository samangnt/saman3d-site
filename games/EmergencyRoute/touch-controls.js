'use strict';
// Keep each finger tied to its own button or camera gesture until release.
class RescueTouchControls {
 constructor(canvas,keys,handlers){this.canvas=canvas;this.keys=keys;this.handlers=handlers;this.holds=new Map();this.looks=new Map();
  const capture=(element,e)=>{try{element.setPointerCapture(e.pointerId);}catch{}};
  const bind=(element,keyFor)=>{element.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();const key=keyFor(e);if(!key)return;capture(element,e);if(key==='Space'&&handlers.canExit()){handlers.exit();return;}this.release(e.pointerId);this.holds.set(e.pointerId,{key,element});keys.add(key);element.classList.add('pressed');});element.addEventListener('lostpointercapture',e=>this.release(e.pointerId));};
  document.querySelectorAll('[data-key]').forEach(b=>bind(b,()=>b.dataset.key));
  bind(document.getElementById('touch-act'),()=>handlers.action()?.key);
  bind(document.getElementById('prompt'),e=>e.pointerType==='touch'?handlers.action()?.key:null);
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  canvas.addEventListener('pointerdown',e=>{if(e.button!==2&&e.pointerType!=='touch')return;e.preventDefault();capture(canvas,e);this.looks.set(e.pointerId,{x:e.clientX,y:e.clientY});handlers.drag(true);});
  canvas.addEventListener('pointermove',e=>{const previous=this.looks.get(e.pointerId);if(!previous)return;e.preventDefault();const pair=[...this.looks.entries()].find(([id])=>id!==e.pointerId);if(pair){const other=pair[1],before=Math.hypot(previous.x-other.x,previous.y-other.y),after=Math.hypot(e.clientX-other.x,e.clientY-other.y);handlers.zoom((before-after)*.07);}else handlers.look(e.clientX-previous.x,e.clientY-previous.y);this.looks.set(e.pointerId,{x:e.clientX,y:e.clientY});});
  const end=e=>{this.release(e.pointerId);this.looks.delete(e.pointerId);handlers.drag(this.looks.size>0);};
  window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
  canvas.addEventListener('wheel',e=>{e.preventDefault();handlers.zoom(e.deltaY*.035);},{passive:false});
  document.getElementById('zoom-in').onclick=()=>handlers.zoom(-4);document.getElementById('zoom-out').onclick=()=>handlers.zoom(4);
  window.addEventListener('blur',()=>this.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden)this.clear();});
 }
 release(id){const held=this.holds.get(id);if(!held)return;this.holds.delete(id);if(![...this.holds.values()].some(h=>h.key===held.key))this.keys.delete(held.key);if(![...this.holds.values()].some(h=>h.element===held.element))held.element.classList.remove('pressed');}
 clear(){for(const id of this.holds.keys())this.release(id);this.looks.clear();this.handlers.drag(false);}
}
window.RescueTouchControls=RescueTouchControls;
