/**
 * Interactive 3D Hero Script for SubhajitDesigns/subhajitdesigns.github.io
 * Drop-in replacement for interactive-hero.js
 */
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';

(function init3DHero() {
  const root = document.querySelector('#home.subh-hero') || document.querySelector('#home');
  if (!root) return;

  const canvas = root.querySelector('.subh-hero-canvas') || document.querySelector('#webgl-canvas');
  if (!canvas) return;

  const loaderLabel = root.querySelector('.subh-hero-loader') || document.getElementById('loading-screen');
  const trackerDisplay = document.getElementById('portraitTracking') || document.getElementById('tracker-display');
  const rimCircle = root.querySelector('.portrait-glow') || document.getElementById('rim-circle');

  // 1. Scene & Telephoto Camera (FOV: 14.5)
  const scene = new THREE.Scene();
  const isMobile = window.innerWidth <= 768;
  const aspect = window.innerWidth / window.innerHeight;

  const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
  camera.position.set(0, isMobile ? 12.0 : 12.6, isMobile ? 29.5 : 23.2);
  camera.zoom = isMobile ? 0.88 : 1.05;
  camera.updateProjectionMatrix();

  // 2. WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  // 3. Studio Lighting & Backlight Glows
  scene.add(new THREE.AmbientLight(0x352b45, 2.2));
  const keyLight = new THREE.DirectionalLight(0xffecd6, 2.4);
  keyLight.position.set(3, 14, 8);
  scene.add(keyLight);

  const rimLightPurple = new THREE.PointLight(0xd975ff, 4.2, 35, 1.8);
  rimLightPurple.position.set(-6, 12, -4);
  scene.add(rimLightPurple);

  const rimLightCyan = new THREE.PointLight(0x00f2fe, 3.2, 30, 2.0);
  rimLightCyan.position.set(6, 10, -4);
  scene.add(rimLightCyan);

  let character = null;
  let headBone = null;
  let mixer = null;
  let monitorObject = null;
  let screenLightMesh = null;

  function hideLoader() {
    if (loaderLabel) {
      loaderLabel.classList.add('is-hidden');
      loaderLabel.style.opacity = '0';
      loaderLabel.style.pointerEvents = 'none';
      setTimeout(() => { loaderLabel.style.display = 'none'; }, 600);
    }
  }

  // 4. Load Character from your repository
  const gltfLoader = new GLTFLoader();
  const modelUrl = (typeof window.CHARACTER_GLB_BASE64 !== 'undefined' && window.CHARACTER_GLB_BASE64)
    ? window.CHARACTER_GLB_BASE64
    : './character.glb';

  gltfLoader.load(
    modelUrl,
    (gltf) => {
      character = gltf.scene;
      scene.add(character);
      character.position.set(0, isMobile ? -1.1 : -0.6, 0);

      headBone = character.getObjectByName('spine.006') || character.getObjectByName('spine006') || null;
      monitorObject = character.getObjectByName('Plane.004') || character.getObjectByName('Plane004') || null;
      screenLightMesh = character.getObjectByName('screenlight') || null;

      if (monitorObject) {
        monitorObject.visible = false;
        monitorObject.position.y = -10;
      }
      if (screenLightMesh) {
        screenLightMesh.visible = false;
        screenLightMesh.position.y = -10;
      }

      mixer = new THREE.AnimationMixer(character);
      if (gltf.animations && gltf.animations.length > 0) {
        const typingClip = gltf.animations.find(c => c.name.toLowerCase() === 'typing');
        if (typingClip) mixer.clipAction(typingClip).play();
        const blinkClip = gltf.animations.find(c => c.name.toLowerCase() === 'blink');
        if (blinkClip) mixer.clipAction(blinkClip).play();
      }

      hideLoader();
    },
    (xhr) => {
      if (xhr.total > 0 && loaderLabel) {
        loaderLabel.textContent = `INITIALIZING CHARACTER… ${Math.round((xhr.loaded / xhr.total) * 100)}%`;
      }
    },
    (err) => {
      console.warn('Fallback loading ./character-only.glb:', err);
      gltfLoader.load('./character-only.glb', (g2) => {
        character = g2.scene;
        scene.add(character);
        character.position.set(0, isMobile ? -1.1 : -0.6, 0);
        headBone = character.getObjectByName('spine.006') || null;
        hideLoader();
      });
    }
  );

  // 5. Cursor & Scroll Interaction
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (trackerDisplay) {
      trackerDisplay.textContent = scrollY < 200
        ? `Mode: Hero Face Tracking (X: ${mouse.targetX.toFixed(2)} | Y: ${mouse.targetY.toFixed(2)})`
        : `Mode: Pinned Scroll Perspective (Scroll: ${Math.round(scrollY)}px)`;
    }

    if (character) {
      const progress = Math.min(scrollY / (window.innerHeight * 0.85), 1);
      const showLaptop = progress > 0.1;
      if (monitorObject) {
        monitorObject.visible = showLaptop;
        monitorObject.position.y = showLaptop ? THREE.MathUtils.lerp(-10, 9.04, progress) : -10;
      }
      character.position.x = THREE.MathUtils.lerp(0, isMobile ? -2.2 : -4.5, progress);
      character.rotation.y = THREE.MathUtils.lerp(0, 0.72, progress);
      camera.position.z = THREE.MathUtils.lerp(isMobile ? 29.5 : 23.2, isMobile ? 31.0 : 27.0, progress);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.zoom = w <= 768 ? 0.88 : 1.05;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    mouse.x += (mouse.targetX - mouse.x) * 0.28;
    mouse.y += (mouse.targetY - mouse.y) * 0.28;

    if (headBone) {
      if (scrollY < 250) {
        headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, mouse.x * (Math.PI / 4.5), 0.45);
        headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, -mouse.y * 0.42 - 0.18, 0.38);
      } else {
        headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, 0.25, 0.05);
        headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, -0.28, 0.05);
      }
    }

    renderer.render(scene, camera);
  }

  animate();
})();
