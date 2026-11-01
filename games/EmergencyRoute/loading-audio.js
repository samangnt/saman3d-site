'use strict';
(function(root){
class RescueMusic{
 constructor(){this.ids=['136977425799420.ogg','138671229087544.ogg','140101756508377.ogg'];this.index=0;this.phase='Loading';this.distance=0;this.muted=false;this.userVolume=.35;this.audio=new Audio();this.audio.preload='auto';this.audio.volume=.08;this.sourceURL=this.url();this.audio.src=this.sourceURL;this.audio.onended=()=>{this.index=(this.index+1)%this.ids.length;this.sourceURL=this.url();this.audio.src=this.sourceURL;this.tryPlay();};this.tryPlay();const unlock=()=>{this.blocked=false;this.tryPlay();};window.addEventListener('pointerdown',unlock,{capture:true,passive:true});window.addEventListener('keydown',unlock,{capture:true});document.addEventListener('visibilitychange',()=>{if(document.hidden){this.audio.pause();this.audio.volume=0;}else this.tryPlay();});}
 url(){const file=this.ids[this.index];return root.SOURCE_AUDIO?.[file]||'assets/audio/'+file;}
 gain(){if(this.muted||document.hidden)return 0;if(this.phase==='Loading'||this.phase==='Menu')return .3;if(this.phase!=='Lobby')return 0;const t=Math.max(0,Math.min(1,(this.distance-35)/45));return .4*(1-t*t*(3-2*t));}
 tryPlay(){if(this.gain()<=0||this.blocked||this.pendingPlay||!this.audio.paused)return;const url=this.url();if(this.sourceURL!==url){this.sourceURL=url;this.audio.src=url;}this.pendingPlay=true;try{Promise.resolve(this.audio.play()).catch(()=>{this.blocked=true;}).finally(()=>this.pendingPlay=false);}catch{this.blocked=true;this.pendingPlay=false;}}
 update(dt,phase,distance,muted,userVolume){this.phase=phase;this.distance=distance;this.muted=muted;this.userVolume=userVolume;const target=this.userVolume*this.gain();if(target<=0){this.audio.volume=0;if(!this.audio.paused)this.audio.pause();return;}this.audio.volume+=(target-this.audio.volume)*Math.min(1,dt*4);if(this.audio.paused)this.tryPlay();}
 diagnostics(){return {phase:this.phase,volume:this.audio.volume,playing:!this.audio.paused,ready:this.audio.readyState,time:this.audio.currentTime,file:this.ids[this.index],distance:this.distance};}
}
root.RescueMusic=RescueMusic;root.EMERGENCY_MUSIC=new RescueMusic();
})(window);
