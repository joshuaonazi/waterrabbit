// ─── SEGMENT 2: SCENE SETUP ──────────────────────────────────────────────────

const heroSection = document.getElementById('hero');

// ── RENDERER ──────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true        // transparent background so your CSS sky/stars show through
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Style and inject the canvas into the hero section
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.zIndex = '5';          // above sky/stars, below hero-content
renderer.domElement.style.pointerEvents = 'none'; // clicks pass through to buttons
renderer.domElement.id = 'hero-canvas';

heroSection.appendChild(renderer.domElement);

// ── SCENE ─────────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x04060f, 0.035); // deep dark fog matching --deep color

// ── CAMERA ────────────────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(
    60,                                              // field of view
    window.innerWidth / window.innerHeight,          // aspect ratio
    0.1,                                             // near clip
    100                                              // far clip
);
camera.position.set(0, 1.5, 8);  // slightly elevated, looking toward rabbit
camera.lookAt(0, 0, 0);

// ── LIGHTING ──────────────────────────────────────────────────────────────────

// Ambient light — soft deep blue (matches your night sky)
const ambientLight = new THREE.AmbientLight(0x1a2a5e, 1.8);
scene.add(ambientLight);

// Moon light — gold directional from above (matches your CSS moon)
const moonLight = new THREE.DirectionalLight(0xf0c060, 2.2);
moonLight.position.set(0, 8, 4);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 1024;
moonLight.shadow.mapSize.height = 1024;
scene.add(moonLight);

// Rim light — cool blue from behind for depth
const rimLight = new THREE.DirectionalLight(0x2244aa, 0.8);
rimLight.position.set(0, 2, -6);
scene.add(rimLight);

// Subtle gold fill from the right
const fillLight = new THREE.PointLight(0xc8921a, 1.2, 20);
fillLight.position.set(4, 3, 3);
scene.add(fillLight);

// ── RENDER LOOP ───────────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    renderer.render(scene, camera);
}

animate();

// ── RESIZE HANDLER ────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});