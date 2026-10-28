import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const mount = document.getElementById("heroAvatarCanvas");
const loading = document.getElementById("heroAvatarLoading");
if (!mount) throw new Error("Avatar mount not found.");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#070506");
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(0, 1.55, 4.8);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
mount.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffe9df, 0x241018, 2.1));
const key = new THREE.DirectionalLight(0xffeee7, 3.2); key.position.set(-3, 5, 5); scene.add(key);
const rim = new THREE.PointLight(0xff3428, 14, 9); rim.position.set(2, 2.8, -1.5); scene.add(rim);
const fill = new THREE.PointLight(0xb4c8ff, 5, 8); fill.position.set(-3, 1.4, 2); scene.add(fill);
const root = new THREE.Group(); scene.add(root);
const pointer = {x:0,y:0,tx:0,ty:0};
let mixer = null, head = null, headBase = null, ready = false;
const clock = new THREE.Clock();
function resize(){const w=Math.max(1,mount.clientWidth),h=Math.max(1,mount.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(mount); resize();
mount.addEventListener("pointermove",e=>{const r=mount.getBoundingClientRect();pointer.tx=((e.clientX-r.left)/r.width)*2-1;pointer.ty=1-((e.clientY-r.top)/r.height)*2;},{passive:true});
mount.addEventListener("pointerleave",()=>{pointer.tx=0;pointer.ty=0;},{passive:true});
const loader=new GLTFLoader();
loader.load("https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb",gltf=>{
 const model=gltf.scene;
 model.scale.setScalar(0.92);
 model.position.set(0,-1.05,0);
 model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;} if(o.isBone&&/head/i.test(o.name)&&!head){head=o;headBase=o.quaternion.clone();}});
 root.add(model);
 mixer=new THREE.AnimationMixer(model);
 const idle=gltf.animations.find(a=>/idle/i.test(a.name))||gltf.animations[0];
 if(idle)mixer.clipAction(idle).play();
 camera.lookAt(0,0.65,0);
 ready=true;
 if(loading){loading.classList.add("is-hidden");setTimeout(()=>loading.remove(),700);}
},undefined,error=>{console.error("Friendly 3D model failed to load",error);if(loading)loading.textContent="3D CHARACTER UNAVAILABLE";});
function animate(){
 requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),0.05),t=clock.elapsedTime;
 pointer.x+=(pointer.tx-pointer.x)*0.065;pointer.y+=(pointer.ty-pointer.y)*0.065;
 if(mixer)mixer.update(dt);
 if(head&&headBase){
   const target=new THREE.Quaternion().setFromEuler(new THREE.Euler(-pointer.y*0.13,pointer.x*0.22,0,"YXZ"));
   head.quaternion.copy(headBase).multiply(target);
 }
 root.rotation.y=Math.sin(t*0.3)*0.035 + pointer.x*0.045;
 root.position.y=Math.sin(t*0.9)*0.018;
 renderer.render(scene,camera);
}
animate();
