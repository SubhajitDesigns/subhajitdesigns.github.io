/* Interactive 3D hero + Moncy-style scroll choreography — Subhajit Das */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js';

const root = document.querySelector('#home.subh-hero');
if (root) {
  const stage = root.querySelector('.subh-hero-stage');
  const canvas = root.querySelector('.subh-hero-canvas');
  const loaderLabel = root.querySelector('.subh-hero-loader');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
  camera.position.set(0, .2, 5.7);

  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: true, powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  scene.add(new THREE.HemisphereLight(0xffe9df, 0x170b0b, 2));
  const key = new THREE.DirectionalLight(0xffd6c7, 3.1);
  key.position.set(2.5, 3.5, 4);
  scene.add(key);
  const red = new THREE.PointLight(0xff3028, 28, 9, 2);
  red.position.set(-2.5, .6, -1);
  scene.add(red);
  const rim = new THREE.DirectionalLight(0xff6559, 2.6);
  rim.position.set(-3, 2, -3);
  scene.add(rim);

  const modelRoot = new THREE.Group();
  scene.add(modelRoot);
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let mixer = null, blinkAction = null, head = null, neck = null;
  let eyeBones = [], baseHead = null, baseNeck = null, loaded = false;
  let scrollTarget = 0, scrollProgress = 0;
  const clock = new THREE.Clock();
  const loader = new GLTFLoader();
  let loadFinished = false;
  const loadTimeout = setTimeout(() => {
    if (!loadFinished) {
      loadFinished = true;
      showFallback('3D MODEL IS TAKING TOO LONG TO LOAD');
    }
  }, 18000);

  function showFallback(message) {
    stage.classList.add('has-fallback');
    loaderLabel.textContent = message;
    loaderLabel.classList.remove('is-hidden');
    loaderLabel.hidden = false;
    setTimeout(() => loaderLabel.classList.add('is-hidden'), 2600);
    setTimeout(() => { loaderLabel.hidden = true; }, 3200);
  }

  loader.load('./character-only.glb', gltf => {
    if (loadFinished) return;
    loadFinished = true;
    clearTimeout(loadTimeout);

    const model = gltf.scene;
    modelRoot.add(model);
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    const targetHeight = 3.65;
    modelRoot.scale.setScalar(targetHeight / Math.max(size.y, .001));
    modelRoot.position.set(.12, -.16, 0);
    model.traverse(object => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        if (Array.isArray(object.material)) {
          object.material.forEach(material => { if (material && 'roughness' in material) material.roughness = Math.max(.2, material.roughness || .4); });
        } else if (object.material && 'roughness' in object.material) {
          object.material.roughness = Math.max(.2, object.material.roughness || .4);
        }
        if (object.isBone) return;
      }
      if (object.isBone) {
        const name = object.name.toLowerCase();
        if (name === 'spine.006' || name === 'spine006' || name === 'head') head = object;
        if (name === 'spine.005' || name === 'spine005' || name === 'neck') neck = object;
        if (/eye/i.test(object.name)) eyeBones.push(object);
      }
    });

    if (head) baseHead = head.rotation.clone();
    if (neck) baseNeck = neck.rotation.clone();
    mixer = new THREE.AnimationMixer(model);
    const blink = gltf.animations.find(animation => /blink/i.test(animation.name));
    if (blink) {
      blinkAction = mixer.clipAction(blink);
      blinkAction.setLoop(THREE.LoopOnce, 1);
      blinkAction.clampWhenFinished = true;
      blinkAction.enabled = true;
    }

    loaded = true;
    loaderLabel.classList.add('is-hidden');
    setTimeout(() => { loaderLabel.hidden = true; }, 550);
    resize();
  }, progress => {
    if (progress && progress.total > 0) {
      loaderLabel.textContent = 'INITIALIZING CHARACTER… ' + Math.round(progress.loaded / progress.total * 100) + '%';
    }
  }, error => {
    if (loadFinished) return;
    loadFinished = true;
    clearTimeout(loadTimeout);
    console.warn('3D hero model could not load. Check character-only.glb path and browser console.', error);
    showFallback('3D MODEL FAILED TO LOAD — CHECK character-only.glb');
  });

  function resize() {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('pointermove', event => {
    pointer.tx = (event.clientX / window.innerWidth - .5) * 2;
    pointer.ty = (event.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });
  root.addEventListener('pointerleave', () => { pointer.tx = 0; pointer.ty = 0; });

  function updateScrollState() {
    const heroHeight = Math.max(root.offsetHeight, window.innerHeight);
    scrollTarget = reduceMotion ? 0 : THREE.MathUtils.clamp(window.scrollY / (heroHeight * .88), 0, 1);
    root.classList.toggle('is-scrolled', scrollTarget > .12);
  }
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });
  updateScrollState();

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), .05);
    pointer.x = THREE.MathUtils.damp(pointer.x, pointer.tx, reduceMotion ? 2 : 3.4, dt);
    pointer.y = THREE.MathUtils.damp(pointer.y, pointer.ty, reduceMotion ? 2 : 3.4, dt);
    scrollProgress = THREE.MathUtils.damp(scrollProgress, scrollTarget, reduceMotion ? 2 : 3.2, dt);

    if (loaded) {
      // Scroll choreography: the character glides left, turns toward the page,
      // and the camera eases back as the hero gives way to the next section.
      const p = scrollProgress;
      modelRoot.position.x = THREE.MathUtils.lerp(.12, -1.05, p);
      modelRoot.position.y = -.16 + (p > .05 && !reduceMotion ? Math.sin(clock.elapsedTime * 7) * .012 * p : 0);
      modelRoot.rotation.y = (reduceMotion ? 0 : Math.sin(clock.elapsedTime * .35) * .025) + p * .52;
      modelRoot.rotation.z = p > .05 && !reduceMotion ? Math.sin(clock.elapsedTime * 3.5) * .012 * p : 0;

      camera.position.x = THREE.MathUtils.lerp(0, -.15, p);
      camera.position.y = THREE.MathUtils.lerp(.2, .08, p);
      camera.position.z = THREE.MathUtils.lerp(5.7, 7.35, p);
      camera.lookAt(THREE.MathUtils.lerp(0, -.24, p), .16, 0);

      // In the hero, the head follows the cursor; during the scroll it turns
      // toward the content, matching the supplied reference interaction.
      if (head && baseHead) {
        const targetY = p < .42 ? baseHead.y + pointer.x * .24 : baseHead.y + .22;
        const targetX = p < .42 ? baseHead.x - pointer.y * .13 : baseHead.x - .12;
        head.rotation.y = THREE.MathUtils.damp(head.rotation.y, targetY, 7, dt);
        head.rotation.x = THREE.MathUtils.damp(head.rotation.x, targetX, 7, dt);
      }
      if (neck && baseNeck) {
        const targetY = p < .42 ? baseNeck.y + pointer.x * .075 : baseNeck.y + .08;
        const targetX = p < .42 ? baseNeck.x - pointer.y * .045 : baseNeck.x - .04;
        neck.rotation.y = THREE.MathUtils.damp(neck.rotation.y, targetY, 6, dt);
        neck.rotation.x = THREE.MathUtils.damp(neck.rotation.x, targetX, 6, dt);
      }
      eyeBones.forEach(eye => {
        eye.rotation.y = pointer.x * .11;
        eye.rotation.x = -pointer.y * .075;
      });
      if (mixer) mixer.update(dt);
      if (blinkAction && clock.elapsedTime > nextBlink) {
        blinkAction.reset().play();
        nextBlink = clock.elapsedTime + 3 + Math.random() * 2.8;
      }
    }
    renderer.render(scene, camera);
  }

  resize();
  animate();
}
