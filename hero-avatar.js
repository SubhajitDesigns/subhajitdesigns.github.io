import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const mount = document.getElementById("heroAvatarCanvas");
const loading = document.getElementById("heroAvatarLoading");
if (!mount) throw new Error("Hero avatar mount was not found.");

const ASSET_ROOT = "https://raw.githubusercontent.com/kblood/CharacterCreator/master/output/";
const MODEL_URL = ASSET_ROOT + "base_body.glb";
const HAIR_URL = ASSET_ROOT + "hair_short02.glb";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#050303");

const camera = new THREE.PerspectiveCamera(29, 1, 0.01, 100);
camera.position.set(0, 1.56, 1.22);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor("#050303", 1);
renderer.domElement.setAttribute("aria-label", "Interactive 3D character");
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffe9dc, 0x190605, 1.7));
const keyLight = new THREE.DirectionalLight(0xffe2d2, 3.2);
keyLight.position.set(-2.6, 3.6, 4.2);
keyLight.castShadow = true;
scene.add(keyLight);
const fillLight = new THREE.PointLight(0xff3c2c, 18, 7, 2);
fillLight.position.set(2.3, 1.8, 2.1);
scene.add(fillLight);
const rimLight = new THREE.PointLight(0x8c1b14, 22, 6, 2);
rimLight.position.set(-1.8, 2.3, -1.7);
scene.add(rimLight);

const characterRoot = new THREE.Group();
scene.add(characterRoot);
const loader = new GLTFLoader();
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
const headBones = [];
const eyeBones = [];
const morphMeshes = [];
let modelReady = false;
let blinkAt = 2.8 + Math.random() * 2;
let blinkElapsed = -1;
let blinkDuration = 0.15;
let lastTime = 0;
let targetLookY = 0;
let headTargetY = 0;
let baseHeadHeight = 1.55;

function smooth(t){ return t*t*(3-2*t); }
function blinkValue(t){
  if(t <= 0 || t >= 1) return 0;
  const close = 0.38;
  return t < close ? smooth(t/close) : 1-smooth((t-close)/(1-close));
}
function setMorph(mesh, name, value){
  const idx = mesh.morphTargetDictionary && mesh.morphTargetDictionary[name];
  if(idx !== undefined && mesh.morphTargetInfluences) mesh.morphTargetInfluences[idx] = value;
}
function eachMorph(name, value){
  for(const mesh of morphMeshes) setMorph(mesh, name, value);
}
function scanCharacter(root){
  root.traverse(obj => {
    if(obj.isMesh){
      obj.frustumCulled = false;
      obj.castShadow = true;
      obj.receiveShadow = true;
      if(obj.morphTargetDictionary && obj.morphTargetInfluences) morphMeshes.push(obj);
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for(const mat of mats){
        if(!mat) continue;
        mat.needsUpdate = true;
        if(mat.roughness !== undefined) mat.roughness = Math.min(0.92, Math.max(0.28, mat.roughness));
      }
    }
    if(obj.isBone){
      const n = (obj.name || "").toLowerCase();
      if(n === "head" || (n.includes("head") && !n.includes("headtop"))) headBones.push({bone:obj, rest:obj.quaternion.clone()});
      if(["eye.l","eyel","eye_l","lefteye"].includes(n)) eyeBones.push({bone:obj, rest:obj.quaternion.clone(), side:-1});
      if(["eye.r","eyer","eye_r","righteye"].includes(n)) eyeBones.push({bone:obj, rest:obj.quaternion.clone(), side:1});
    }
  });
}
function updateGaze(){
  const yaw = THREE.MathUtils.clamp(mouse.x * 0.28, -0.26, 0.26);
  const pitch = THREE.MathUtils.clamp(mouse.y * 0.12, -0.12, 0.12);
  const left = Math.max(0, yaw) / 0.5236;
  const right = Math.max(0, -yaw) / 0.5236;
  const up = Math.max(0, pitch) / 0.4363;
  const down = Math.max(0, -pitch) / 0.4363;
  eachMorph("look_left", left);
  eachMorph("look_right", right);
  eachMorph("look_up", up);
  eachMorph("look_down", down);
  for(const item of eyeBones){
    const euler = new THREE.Euler(pitch * 0.75, yaw * 0.8, 0, "YXZ");
    item.bone.quaternion.copy(item.rest).multiply(new THREE.Quaternion().setFromEuler(euler));
  }
}
function frame(now){
  requestAnimationFrame(frame);
  const time = now * 0.001;
  const dt = Math.min(0.05, lastTime ? time - lastTime : 0.016);
  lastTime = time;
  mouse.x += (mouse.targetX - mouse.x) * 0.075;
  mouse.y += (mouse.targetY - mouse.y) * 0.075;

  if(modelReady){
    const idle = Math.sin(time * 0.72) * 0.012;
    for(const item of headBones){
      const euler = new THREE.Euler(-mouse.y * 0.10 + idle, mouse.x * 0.26, Math.sin(time * 0.45) * 0.008, "YXZ");
      item.bone.quaternion.copy(item.rest).multiply(new THREE.Quaternion().setFromEuler(euler));
    }
    updateGaze();

    if(blinkElapsed >= 0){
      blinkElapsed += dt;
      const v = blinkValue(blinkElapsed / blinkDuration);
      eachMorph("blink_left", v);
      eachMorph("blink_right", v);
      if(blinkElapsed >= blinkDuration){
        blinkElapsed = -1;
        eachMorph("blink_left", 0);
        eachMorph("blink_right", 0);
        blinkAt = 2.1 + Math.random() * 3.8;
      }
    }else{
      blinkAt -= dt;
      if(blinkAt <= 0){
        blinkElapsed = 0;
        blinkDuration = 0.12 + Math.random() * 0.06;
      }
    }
    characterRoot.rotation.y = Math.sin(time * 0.25) * 0.012;
    characterRoot.position.y = Math.sin(time * 0.8) * 0.004;
  }
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);

function resize(){
  const w = Math.max(1, mount.clientWidth);
  const h = Math.max(1, mount.clientHeight);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(mount);
resize();

function pointerMove(event){
  const rect = mount.getBoundingClientRect();
  mouse.targetX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
  mouse.targetY = THREE.MathUtils.clamp(1 - ((event.clientY - rect.top) / rect.height) * 2, -1, 1);
}
mount.addEventListener("pointermove", pointerMove, { passive: true });
mount.addEventListener("pointerleave", () => { mouse.targetX = 0; mouse.targetY = 0; }, { passive: true });
mount.addEventListener("touchmove", event => {
  const touch = event.touches && event.touches[0];
  if(touch) pointerMove(touch);
}, { passive: true });

async function loadAvatar(){
  try{
    const gltf = await loader.loadAsync(MODEL_URL);
    const model = gltf.scene;
    scanCharacter(model);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const height = size.y || 1.8;
    const top = bounds.max.y;
    baseHeadHeight = top - height * 0.105;
    camera.position.set(0, baseHeadHeight, Math.max(0.88, height * 0.66));
    camera.lookAt(0, baseHeadHeight, 0);
    characterRoot.add(model);

    try{
      const hairGltf = await loader.loadAsync(HAIR_URL);
      const hair = hairGltf.scene;
      hair.traverse(obj => {
        if(obj.isMesh){
          obj.frustumCulled = false;
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          for(const mat of mats){
            if(mat && mat.color) mat.color.set("#211512");
            if(mat && mat.roughness !== undefined) mat.roughness = 0.78;
          }
        }
      });
      characterRoot.add(hair);
    }catch(hairError){
      console.warn("Optional hairstyle could not be loaded; continuing with the base character.", hairError);
    }
    modelReady = true;
    if(loading) loading.classList.add("is-hidden");
    setTimeout(() => { if(loading) loading.remove(); }, 800);
  }catch(error){
    console.error("The free 3D character could not be loaded.", error);
    if(loading) loading.innerHTML = '<span></span> CONNECTING TO THE DIGITAL HUMAN';
  }
}
loadAvatar();
