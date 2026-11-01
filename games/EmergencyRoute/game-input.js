'use strict';
(function(root){
const GAME_KEYS=['KeyW','KeyA','KeyS','KeyD','KeyC','KeyE','KeyR','KeyT','KeyF','KeyI','KeyG','KeyQ','KeyB','KeyX','KeyP','KeyM','Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
function editable(target){return !!target?.closest?.('input,textarea,select,[contenteditable="true"]');}
function ignoreModifiedKey(event,keys,active){if(editable(event.target))return true;if(event.ctrlKey||event.metaKey||event.altKey||/^(Control|Meta|Alt)(Left|Right)$/.test(event.code)){keys.clear();if(active){event.preventDefault();event.stopPropagation();}return true;}return false;}
class RescueKeyboardCapture{
 constructor(keyboard){this.keyboard=keyboard;this.status=keyboard?.lock?'idle':'unavailable';this.requested=false;this.epoch=0;}
 sync(fullscreen){if(!fullscreen){this.epoch++;this.keyboard?.unlock?.();this.requested=false;this.status=this.keyboard?.lock?'idle':'unavailable';return;}if(this.requested||!this.keyboard?.lock)return;this.requested=true;this.status='requesting';const epoch=++this.epoch;try{Promise.resolve(this.keyboard.lock(GAME_KEYS)).then(()=>{if(this.epoch===epoch)this.status='locked';}).catch(()=>{if(this.epoch===epoch)this.status='unavailable';});}catch{this.status='unavailable';}}
}
root.RescueGameKeys={GAME_KEYS,ignoreModifiedKey,editable};root.RescueKeyboardCapture=RescueKeyboardCapture;
if(typeof module!=='undefined')module.exports={GAME_KEYS,ignoreModifiedKey,RescueKeyboardCapture};
})(typeof window==='undefined'?globalThis:window);
