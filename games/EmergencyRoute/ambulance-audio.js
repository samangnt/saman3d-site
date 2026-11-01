'use strict';
class AmbulanceAudio {
 constructor(scene,urlFor){this.scene=scene;this.listener=new THREE.AudioListener();scene.scene.add(this.listener);this.nodes={};this.failed={};this.engineRunning=false;this.pendingStart=false;this.starting=false;this.muted=false;this.startCount=0;this.analyser=this.listener.context.createAnalyser();this.analyser.fftSize=2048;this.samples=new Float32Array(this.analyser.fftSize);
  const loader=new THREE.AudioLoader();
  for(const [name,file,loop,position]of [['engine','316019951.ogg',true,[0,4,-12]],['start','1235894410.ogg',false,[0,4,-12]],['siren','9073703112.ogg',true,[0,11,-2]]]){const sound=new THREE.PositionalAudio(this.listener);sound.setLoop(loop);sound.setRefDistance(12);sound.setMaxDistance(160);sound.setRolloffFactor(1.5);sound.setDistanceModel('inverse');sound.setVolume(0);sound.position.set(...position);scene.vehicleBody.add(sound);this.nodes[name]=sound;if(name==='engine')sound.gain.connect(this.analyser);loader.load(urlFor(file),buffer=>sound.setBuffer(buffer),undefined,()=>{this.failed[name]=true;});}
 }
 unlock(){const context=this.listener.context;if(context.state!=='running'&&context.state!=='closed')context.resume().catch(()=>{});}
 play(name){const node=this.nodes[name];if(this.listener.context.state==='running'&&node.buffer&&!node.isPlaying){node.play();return true;}return false;}
 stop(name){const node=this.nodes[name];if(node.isPlaying)node.stop();node.setVolume(0);}
 ignite(){if(this.engineRunning)return;this.engineRunning=true;this.pendingStart=true;this.starting=false;this.unlock();}
 park(){this.engineRunning=false;this.pendingStart=false;this.starting=false;this.stop('engine');this.stop('start');}
 reset(){this.park();this.stop('siren');}
 update(rules){const active=rules.phase==='Active',driver=active&&!rules.onFoot&&!rules.deliveryParked&&rules.transport!=='helicopter',ear=rules.onFoot?rules.player:rules.transport==='helicopter'?rules.heli:rules.car;this.listener.position.set(ear.x,ear.y+5,ear.z);this.listener.quaternion.copy(this.scene.camera.quaternion);this.listener.updateMatrixWorld(true);
  if(!driver&&this.engineRunning)this.park();
  if(!active||rules.paused||this.muted){for(const name of Object.keys(this.nodes))this.stop(name);this.pendingStart=false;this.starting=false;return;}
  if(driver&&!this.engineRunning)this.ignite();
  if(this.pendingStart){if(this.failed.start)this.pendingStart=false;else if(this.nodes.start.buffer){this.nodes.start.setVolume(.3);if(this.play('start')){this.startCount++;this.starting=true;this.pendingStart=false;}}}
  if(this.starting&&!this.nodes.start.isPlaying)this.starting=false;
  const speed=Math.abs(rules.car.speed),moving=driver&&this.engineRunning&&speed>.5;
  if(moving){this.nodes.engine.setPlaybackRate(.72+speed/55);this.nodes.engine.setVolume(.22+.1*Math.min(1,speed/78));this.play('engine');}else this.stop('engine');
  const sirenDistance=Math.hypot(ear.x-rules.car.x,ear.y-rules.car.y,ear.z-rules.car.z);if(rules.siren&&sirenDistance<160){this.nodes.siren.setVolume(.3);this.play('siren');}else this.stop('siren');
 }
 diagnostics(){const engine=this.nodes.engine,source=new THREE.Vector3(),ear=new THREE.Vector3();engine.getWorldPosition(source);this.listener.getWorldPosition(ear);this.analyser.getFloatTimeDomainData(this.samples);const rms=Math.sqrt(this.samples.reduce((sum,v)=>sum+v*v,0)/this.samples.length);return {context:this.listener.context.state,engineRMS:rms,engineVolume:engine.getVolume(),engineRunning:this.engineRunning,enginePlaying:engine.isPlaying,startPlaying:this.nodes.start.isPlaying,sirenPlaying:this.nodes.siren.isPlaying,startCount:this.startCount,failed:{...this.failed},loaded:Object.fromEntries(Object.entries(this.nodes).map(([name,node])=>[name,!!node.buffer])),source:source.toArray(),listener:ear.toArray(),distanceMeters:source.distanceTo(ear)*.28,attached:engine.parent===this.scene.vehicleBody};}
}
window.AmbulanceAudio=AmbulanceAudio;
