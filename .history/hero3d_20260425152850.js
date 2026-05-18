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

// ─── SEGMENT 3: RABBIT GEOMETRY ──────────────────────────────────────────────

// ── MATERIALS ─────────────────────────────────────────────────────────────────

// Main fur — warm gold matching your color scheme
const furMaterial = new THREE.MeshStandardMaterial({
    color: 0xc8921a,
    roughness: 0.85,
    metalness: 0.05,
});

// Lighter belly fur
const bellyMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8d5a0,
    roughness: 0.9,
    metalness: 0.0,
});

// Inner ear — soft pale pink
const innerEarMaterial = new THREE.MeshStandardMaterial({
    color: 0xc87060,
    roughness: 0.95,
    metalness: 0.0,
});

// Eyes — deep dark with subtle reflection
const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0608,
    roughness: 0.2,
    metalness: 0.6,
    emissive: 0x220011,
    emissiveIntensity: 0.4,
});

// Eye shine
const eyeShineMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.0,
    metalness: 0.0,
    emissive: 0xffffff,
    emissiveIntensity: 1.0,
});

// Nose
const noseMaterial = new THREE.MeshStandardMaterial({
    color: 0xd06070,
    roughness: 0.8,
    metalness: 0.0,
});

// ── RABBIT GROUP ──────────────────────────────────────────────────────────────
const rabbit = new THREE.Group();

// ── BODY ──────────────────────────────────────────────────────────────────────
const bodyGeo = new THREE.SphereGeometry(0.55, 16, 12);
const body = new THREE.Mesh(bodyGeo, furMaterial);
body.scale.set(1, 0.9, 1.2);
body.position.set(0, 0, 0);
body.castShadow = true;
rabbit.add(body);

// Belly patch
const bellyGeo = new THREE.SphereGeometry(0.35, 12, 10);
const belly = new THREE.Mesh(bellyGeo, bellyMaterial);
belly.scale.set(0.85, 0.75, 0.5);
belly.position.set(0, -0.05, 0.38);
rabbit.add(belly);

// ── HEAD ──────────────────────────────────────────────────────────────────────
const headGeo = new THREE.SphereGeometry(0.38, 16, 12);
const head = new THREE.Mesh(headGeo, furMaterial);
head.scale.set(1, 1.05, 1.0);
head.position.set(0, 0.62, 0.28);
head.castShadow = true;
rabbit.add(head);

// Cheek puffs
const cheekGeo = new THREE.SphereGeometry(0.18, 10, 8);

const leftCheek = new THREE.Mesh(cheekGeo, bellyMaterial);
leftCheek.scale.set(1, 0.8, 0.7);
leftCheek.position.set(-0.22, 0.54, 0.54);
rabbit.add(leftCheek);

const rightCheek = new THREE.Mesh(cheekGeo, bellyMaterial);
rightCheek.scale.set(1, 0.8, 0.7);
rightCheek.position.set(0.22, 0.54, 0.54);
rabbit.add(rightCheek);

// ── SNOUT ─────────────────────────────────────────────────────────────────────
const snoutGeo = new THREE.SphereGeometry(0.14, 10, 8);
const snout = new THREE.Mesh(snoutGeo, bellyMaterial);
snout.scale.set(1.1, 0.75, 0.85);
snout.position.set(0, 0.52, 0.68);
rabbit.add(snout);

// Nose
const noseGeo = new THREE.SphereGeometry(0.05, 8, 6);
const nose = new THREE.Mesh(noseGeo, noseMaterial);
nose.scale.set(1.2, 0.7, 0.8);
nose.position.set(0, 0.535, 0.8);
rabbit.add(nose);

// ── EYES ──────────────────────────────────────────────────────────────────────
const eyeGeo = new THREE.SphereGeometry(0.07, 10, 8);

const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
leftEye.position.set(-0.18, 0.72, 0.60);
rabbit.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
rightEye.position.set(0.18, 0.72, 0.60);
rabbit.add(rightEye);

// Eye shines (tiny white dot)
const shineGeo = new THREE.SphereGeometry(0.025, 6, 6);

const leftShine = new THREE.Mesh(shineGeo, eyeShineMaterial);
leftShine.position.set(-0.16, 0.745, 0.665);
rabbit.add(leftShine);

const rightShine = new THREE.Mesh(shineGeo, eyeShineMaterial);
rightShine.position.set(0.20, 0.745, 0.665);
rabbit.add(rightShine);

// ── EARS ──────────────────────────────────────────────────────────────────────
const earOuterGeo = new THREE.CapsuleGeometry(0.09, 0.55, 6, 10);
const earInnerGeo = new THREE.CapsuleGeometry(0.048, 0.38, 6, 8);

// Left ear
const leftEar = new THREE.Mesh(earOuterGeo, furMaterial);
leftEar.position.set(-0.16, 1.18, 0.18);
leftEar.rotation.z = 0.18;
leftEar.rotation.x = -0.12;
leftEar.castShadow = true;
rabbit.add(leftEar);

const leftEarInner = new THREE.Mesh(earInnerGeo, innerEarMaterial);
leftEarInner.position.set(-0.14, 1.18, 0.22);
leftEarInner.rotation.z = 0.18;
leftEarInner.rotation.x = -0.12;
rabbit.add(leftEarInner);

// Right ear
const rightEar = new THREE.Mesh(earOuterGeo, furMaterial);
rightEar.position.set(0.16, 1.18, 0.18);
rightEar.rotation.z = -0.18;
rightEar.rotation.x = -0.12;
rightEar.castShadow = true;
rabbit.add(rightEar);

const rightEarInner = new THREE.Mesh(earInnerGeo, innerEarMaterial);
rightEarInner.position.set(0.14, 1.18, 0.22);
rightEarInner.rotation.z = -0.18;
rightEarInner.rotation.x = -0.12;
rabbit.add(rightEarInner);

// ── TAIL ──────────────────────────────────────────────────────────────────────
const tailGeo = new THREE.SphereGeometry(0.16, 10, 8);
const tail = new THREE.Mesh(tailGeo, bellyMaterial);
tail.position.set(0, 0.05, -0.58);
rabbit.add(tail);

// ── FRONT PAWS (paddle out of water) ─────────────────────────────────────────
const pawGeo = new THREE.SphereGeometry(0.12, 10, 8);

const leftPaw = new THREE.Mesh(pawGeo, furMaterial);
leftPaw.scale.set(1.1, 0.65, 1.3);
leftPaw.position.set(-0.48, -0.22, 0.42);
rabbit.add(leftPaw);

const rightPaw = new THREE.Mesh(pawGeo, furMaterial);
rightPaw.scale.set(1.1, 0.65, 1.3);
rightPaw.position.set(0.48, -0.22, 0.42);
rabbit.add(rightPaw);

// ── POSITION RABBIT AT WATERLINE ──────────────────────────────────────────────
// Y position: body half submerged (negative = lower in scene/water)
rabbit.position.set(0, -1.0, 0);
rabbit.rotation.y = 0.15; // slight angle, looks more natural

scene.add(rabbit);

// Store paw references for animation in Segment 4
rabbit.userData = {
    leftPaw,
    rightPaw,
    leftEar,
    rightEar,
    head,
    tail
};

console.log('🐰 Rabbit loaded into scene');