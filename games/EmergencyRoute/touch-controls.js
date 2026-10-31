'use strict';
// Keep each finger tied to its own button or camera gesture until release.
class RescueTouchControls {
 constructor(canvas,keys,handlers){this.canvas=canvas;this.keys=keys;this.handlers=handlers;this.holds=new Map();this.looks=new Map();this.stick=document.getElementById('joystick');this.knob=document.getElementById('joystick-knob');this.stickId=null;this.movement={x:0,y:0,strength:0};
  const capture=(element,e)=>{try{element.setPointerCapture(e.pointerId);}catch{}};
  const protect=element=>{for(const type of ['contextmenu','selectstart','dragstart'])element.addEventListener(type,e=>e.preventDefault());element.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});};
  const game=document.getElementById('game');for(const type of ['contextmenu','selectstart','dragstart'])game.addEventListener(type,e=>{if(!e.target.closest?.('input,select,option,textarea,[contenteditable="true"]'))e.preventDefault();});
  const bind=(element,keyFor)=>{protect(element);element.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();const key=keyFor(e);if(!key)return;capture(element,e);if(key==='Space'&&handlers.canExit()){handlers.exit();return;}this.release(e.pointerId);this.holds.set(e.pointerId,{key,element});keys.add(key);element.classList.add('pressed');});element.addEventListener('lostpointercapture',e=>this.release(e.pointerId));};
  document.querySelectorAll('[data-key]').forEach(b=>bind(b,()=>b.dataset.key));
  bind(document.getElementById('touch-act'),()=>handlers.action()?.key);
  bind(document.getElementById('prompt'),e=>e.pointerType==='touch'?handlers.action()?.key:null);
  protect(this.stick);protect(canvas);
  this.stick.addEventListener('pointerdown',e=>{if(e.button!==0||this.stickId!==null)return;e.preventDefault();this.stickId=e.pointerId;capture(this.stick,e);this.moveStick(e);});
  this.stick.addEventListener('pointermove',e=>{if(e.pointerId!==this.stickId)return;e.preventDefault();this.moveStick(e);});
  this.stick.addEventListener('lostpointercapture',e=>this.release(e.pointerId));
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  canvas.addEventListener('pointerdown',e=>{if(e.button!==2&&e.pointerType!=='touch')return;e.preventDefault();capture(canvas,e);this.looks.set(e.pointerId,{x:e.clientX,y:e.clientY});handlers.drag(true);});
  canvas.addEventListener('pointermove',e=>{const previous=this.looks.get(e.pointerId);if(!previous)return;e.preventDefault();const pair=[...this.looks.entries()].find(([id])=>id!==e.pointerId);if(pair){const other=pair[1],before=Math.hypot(previous.x-other.x,previous.y-other.y),after=Math.hypot(e.clientX-other.x,e.clientY-other.y);handlers.zoom((before-after)*.07);}else handlers.look(e.clientX-previous.x,e.clientY-previous.y);this.looks.set(e.pointerId,{x:e.clientX,y:e.clientY});});
  const end=e=>{this.release(e.pointerId);this.looks.delete(e.pointerId);handlers.drag(this.looks.size>0);};
  window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
  canvas.addEventListener('wheel',e=>{e.preventDefault();handlers.zoom(e.deltaY*.035);},{passive:false});
  window.addEventListener('blur',()=>this.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden)this.clear();});
  window.addEventListener('resize',()=>this.clear());
 }
 moveStick(e){const rect=this.stick.getBoundingClientRect(),dx=e.clientX-rect.left-rect.width/2,dy=e.clientY-rect.top-rect.height/2,distance=Math.hypot(dx,dy),radius=Math.max(1,Math.min(rect.width,rect.height)/2-24),travel=Math.min(distance,radius),strength=Math.max(0,(Math.min(1,distance/radius)-.12)/.88),divisor=distance||1;this.movement={x:dx/divisor*strength,y:-dy/divisor*strength,strength};this.knob.style.transform='translate('+dx/divisor*travel+'px,'+dy/divisor*travel+'px)';this.stick.classList.toggle('running',strength>.65);}
 sample(){return {...this.movement,active:this.stickId!==null};}
 release(id){if(id===this.stickId){this.stickId=null;this.movement={x:0,y:0,strength:0};this.knob.style.transform='translate(0px,0px)';this.stick.classList.remove('running');}const held=this.holds.get(id);if(!held)return;this.holds.delete(id);if(![...this.holds.values()].some(h=>h.key===held.key))this.keys.delete(held.key);if(![...this.holds.values()].some(h=>h.element===held.element))held.element.classList.remove('pressed');}
 clear(){if(this.stickId!==null)this.release(this.stickId);for(const id of this.holds.keys())this.release(id);this.looks.clear();this.handlers.drag(false);}
}
window.RescueTouchControls=RescueTouchControls;
