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


// ─── SEGMENT 3: LOAD GLB RABBIT ──────────────────────────────────────────────

const loader = new THREE.GLTFLoader();

// Rabbit group — everything attaches here
const rabbit = new THREE.Group();
rabbit.position.set(0, -3.5, 0); // start underwater for entrance animation
scene.add(rabbit);

// Loading state
let rabbitLoaded = false;
let rabbitModel  = null;

loader.load(
    'assets/rabbit.glb',

    // ── ON SUCCESS ────────────────────────────────────────────────────────────
    (gltf) => {
        rabbitModel = gltf.scene;

        // ── Scale — adjust if too big or small after first look
        rabbitModel.scale.setScalar(1.0);

        // ── Center the model on its own origin
        const box    = new THREE.Box3().setFromObject(rabbitModel);
        const center = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());

        // Shift model so its base sits at y=0
        rabbitModel.position.set(
            -center.x,
            -box.min.y,
            -center.z
        );

        // ── Apply gold/moonlit material to all meshes
        rabbitModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow    = true;
                child.receiveShadow = true;

                // Enhance existing material with moonlight tones
                if (child.material) {
                    child.material.envMapIntensity = 1.2;

                    // Tint toward your gold palette if material is plain/white
                    const col = child.material.color;
                    if (col) {
                        // Warm it up slightly toward gold without killing original texture
                        col.lerp(new THREE.Color(0xc8921a), 0.15);
                    }

                    child.material.needsUpdate = true;
                }
            }
        });

        rabbit.add(rabbitModel);

        // ── Face forward
        rabbit.rotation.y = 0.15;

        // Store size for animation scaling
        rabbit.userData.size   = size;
        rabbit.userData.height = size.y;

        rabbitLoaded = true;

        console.log('🐰 GLB Rabbit loaded successfully');
        console.log('📐 Model size:', size);

        // ── Trigger entrance animation now that model is ready
        startEntranceAnimation();
    },

    // ── ON PROGRESS ───────────────────────────────────────────────────────────
    (xhr) => {
        const pct = Math.round((xhr.loaded / xhr.total) * 100);
        console.log(`🐰 Loading rabbit... ${pct}%`);
    },

    // ── ON ERROR ──────────────────────────────────────────────────────────────
    (error) => {
        console.error('❌ Failed to load rabbit.glb:', error);
        console.log('📁 Make sure rabbit.glb is in your assets/ folder');
    }
);

// ── ENTRANCE ANIMATION (called once model loads) ───────────────────────────────
function startEntranceAnimation() {

    // Camera pulls back
    gsap.to(camera.position, {
        z: 8,
        y: 1.5,
        duration: 2.2,
        ease: 'power3.out',
    });

    // Rabbit rises from water
    gsap.to(rabbit.position, {
        y: -1.0,
        duration: 2.0,
        ease: 'power2.out',
        delay: 0.3,
    });

    // Rabbit scales in
    gsap.from(rabbit.scale, {
        x: 0.01, y: 0.01, z: 0.01,
        duration: 1.8,
        ease: 'back.out(1.4)',
        delay: 0.3,
    });

    // Hero text fades in
    gsap.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        delay: 1.4,
    });
}

console.log('🐰 GLB loader initialized — fetching rabbit...');

// ─── SEGMENT 4: SWIMMING ANIMATION + WATER RIPPLES ───────────────────────────

// ── WATER PLANE ───────────────────────────────────────────────────────────────
const waterGeo = new THREE.PlaneGeometry(18, 10, 80, 40);
const waterMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a5f,
    roughness: 0.15,
    metalness: 0.7,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
});

const water = new THREE.Mesh(waterGeo, waterMat);
water.rotation.x = -Math.PI / 2;
water.position.y = -0.38;
water.receiveShadow = true;
scene.add(water);

// Animate water surface vertices
const waterPositions = waterGeo.attributes.position;
const waterVertexCount = waterPositions.count;
const waterOriginalY = [];
for (let i = 0; i < waterVertexCount; i++) {
    waterOriginalY.push(waterPositions.getY(i));
}

// ── RIPPLE RINGS ──────────────────────────────────────────────────────────────
const ripples = [];
const rippleCount = 4;

for (let i = 0; i < rippleCount; i++) {
    const rippleGeo = new THREE.RingGeometry(0.1, 0.18, 32);
    const rippleMat = new THREE.MeshBasicMaterial({
        color: 0x4a90d9,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
    });

    const ripple = new THREE.Mesh(rippleGeo, rippleMat);
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.set(0, -0.34, 0.3);

    // stagger start times so ripples dont all expand at once
    ripple.userData.delay = i * 0.85;
    ripple.userData.speed = 0.9 + i * 0.08;
    ripple.userData.maxScale = 3.8 + i * 0.4;

    scene.add(ripple);
    ripples.push(ripple);
}

// ── WATER SPLASH PARTICLES ────────────────────────────────────────────────────
const splashCount = 22;
const splashGeo = new THREE.BufferGeometry();
const splashPositions = new Float32Array(splashCount * 3);
const splashVelocities = [];

for (let i = 0; i < splashCount; i++) {
    splashPositions[i * 3]     = (Math.random() - 0.5) * 0.9;  // x spread
    splashPositions[i * 3 + 1] = -0.35;                          // start at waterline
    splashPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;  // z spread

    splashVelocities.push({
        x: (Math.random() - 0.5) * 0.012,
        y: Math.random() * 0.018 + 0.005,
        z: (Math.random() - 0.5) * 0.012,
        life: Math.random(),
        speed: Math.random() * 0.5 + 0.5,
    });
}

splashGeo.setAttribute('position', new THREE.BufferAttribute(splashPositions, 3));

const splashMat = new THREE.PointsMaterial({
    color: 0x88c4e8,
    size: 0.045,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
});

const splashParticles = new THREE.Points(splashGeo, splashMat);
scene.add(splashParticles);

// ── MOONLIGHT REFLECTION ON WATER ─────────────────────────────────────────────
const reflectionGeo = new THREE.PlaneGeometry(0.4, 2.2);
const reflectionMat = new THREE.MeshBasicMaterial({
    color: 0xf0c060,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
});
const moonReflection = new THREE.Mesh(reflectionGeo, reflectionMat);
moonReflection.rotation.x = -Math.PI / 2;
moonReflection.position.set(0, -0.33, 1.5);
scene.add(moonReflection);

// ── SWIMMING ANIMATION FUNCTION ───────────────────────────────────────────────
function animateRabbit(elapsed) {

    const { leftPaw, rightPaw, leftEar, rightEar, head, tail } = rabbit.userData;

    // ── Body bob — gentle up/down in water
    rabbit.position.y = -1.0 + Math.sin(elapsed * 1.4) * 0.09;

    // ── Body rock — slight side tilt while swimming
    rabbit.rotation.z = Math.sin(elapsed * 1.4) * 0.06;

    // ── Forward lean — slight pitch forward like swimming
    rabbit.rotation.x = -0.12 + Math.sin(elapsed * 0.7) * 0.04;

    // ── Paw paddling — alternating left/right strokes
    leftPaw.position.y  = -0.22 + Math.sin(elapsed * 2.8) * 0.14;
    leftPaw.position.z  =  0.42 + Math.cos(elapsed * 2.8) * 0.12;

    rightPaw.position.y = -0.22 + Math.sin(elapsed * 2.8 + Math.PI) * 0.14;
    rightPaw.position.z =  0.42 + Math.cos(elapsed * 2.8 + Math.PI) * 0.12;

    // ── Ear flutter — gentle sway in the air
    leftEar.rotation.z  =  0.18 + Math.sin(elapsed * 1.2) * 0.08;
    rightEar.rotation.z = -0.18 + Math.sin(elapsed * 1.2 + 0.5) * 0.08;

    // ── Head subtle look around
    head.rotation.y = Math.sin(elapsed * 0.5) * 0.18;
    head.rotation.x = Math.sin(elapsed * 0.8) * 0.04;

    // ── Tail wag
    tail.rotation.y = Math.sin(elapsed * 3.0) * 0.3;
}

// ── WATER SURFACE ANIMATION ───────────────────────────────────────────────────
function animateWater(elapsed) {
    for (let i = 0; i < waterVertexCount; i++) {
        const x = waterPositions.getX(i);
        const z = waterOriginalY[i];
        const wave =
            Math.sin(x * 1.5 + elapsed * 1.2) * 0.045 +
            Math.sin(x * 0.8 + elapsed * 0.7) * 0.03  +
            Math.sin(z * 2.0 + elapsed * 1.5) * 0.025;
        waterPositions.setY(i, wave);
    }
    waterGeo.attributes.position.needsUpdate = true;
    waterGeo.computeVertexNormals();
}

// ── RIPPLE ANIMATION ──────────────────────────────────────────────────────────
function animateRipples(elapsed) {
    ripples.forEach((ripple, i) => {
        const t = ((elapsed * ripple.userData.speed) + ripple.userData.delay) % 3.2;
        const scale = (t / 3.2) * ripple.userData.maxScale + 0.1;
        const opacity = Math.max(0, 0.55 * (1 - t / 3.2));

        ripple.scale.setScalar(scale);
        ripple.material.opacity = opacity;

        // offset each ripple slightly from paw positions
        ripple.position.x = Math.sin(elapsed * 1.4 + i) * 0.22;
    });
}

// ── SPLASH PARTICLE ANIMATION ─────────────────────────────────────────────────
function animateSplash(elapsed) {
    const positions = splashGeo.attributes.position.array;

    for (let i = 0; i < splashCount; i++) {
        splashVelocities[i].life += 0.012 * splashVelocities[i].speed;

        if (splashVelocities[i].life > 1) {
            // reset particle to waterline near rabbit paws
            positions[i * 3]     = (Math.random() - 0.5) * 0.9;
            positions[i * 3 + 1] = -0.35;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
            splashVelocities[i].life = 0;
            splashVelocities[i].y = Math.random() * 0.018 + 0.005;
        } else {
            positions[i * 3]     += splashVelocities[i].x;
            positions[i * 3 + 1] += splashVelocities[i].y;
            positions[i * 3 + 2] += splashVelocities[i].z;
            splashVelocities[i].y -= 0.00035; // gravity pull back down
        }
    }
    splashGeo.attributes.position.needsUpdate = true;
}

// ── MOON REFLECTION SHIMMER ───────────────────────────────────────────────────
function animateMoonReflection(elapsed) {
    moonReflection.material.opacity = 0.10 + Math.sin(elapsed * 1.8) * 0.05;
    moonReflection.scale.x = 1 + Math.sin(elapsed * 2.2) * 0.15;
    moonReflection.position.z = 1.5 + Math.sin(elapsed * 0.9) * 0.2;
}

// ── PLUG INTO RENDER LOOP ─────────────────────────────────────────────────────
// Replace the existing animate() function at the top of hero3d.js with this:
// (Find the old animate() and update it — or just declare a new one below)

// Remove old animate and replace:
cancelAnimationFrame(window._heroAnimFrame);

function animateScene() {
    window._heroAnimFrame = requestAnimationFrame(animateScene);
    const elapsed = clock.getElapsedTime();

    animateRabbit(elapsed);
    animateWater(elapsed);
    animateRipples(elapsed);
    animateSplash(elapsed);
    animateMoonReflection(elapsed);

    renderer.render(scene, camera);
}

animateScene();

console.log('🌊 Swimming animation + ripples active');

// ─── SEGMENT 5: MOUSE PARALLAX + GSAP ────────────────────────────────────────

// ── TRACKING VARIABLES ────────────────────────────────────────────────────────
const mouse = { x: 0, y: 0 };         // raw mouse position (-1 to 1)
const target = { x: 0, y: 0 };        // smoothed target
const cameraHome = { x: 0, y: 1.5, z: 8 }; // camera resting position

// ── MOUSE MOVE LISTENER ───────────────────────────────────────────────────────
window.addEventListener('mousemove', (e) => {
    // Normalize to -1 → +1 range
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ── MOUSE LEAVE — drift back to center ───────────────────────────────────────
window.addEventListener('mouseleave', () => {
    gsap.to(mouse, {
        x: 0,
        y: 0,
        duration: 2.0,
        ease: 'power2.out'
    });
});

// ── PARALLAX LAYERS ───────────────────────────────────────────────────────────
// Different elements react at different speeds for depth illusion

const parallaxConfig = {
    camera:     { x: 1.2,  y: 0.5  },   // camera drifts gently
    rabbit:     { x: 0.3,  y: 0.12 },   // rabbit moves least (anchored in water)
    fillLight:  { x: 3.0,  y: 2.0  },   // light shifts for dynamic shading
    ripple:     { x: 0.5,  y: 0.0  },   // ripples follow rabbit slightly
};

// ── GSAP HERO ENTRANCE ANIMATION ─────────────────────────────────────────────
// Runs once on page load — rabbit rises from water, camera pulls back

// Start state
rabbit.position.y = -3.5;         // start deep underwater
rabbit.scale.setScalar(0);        // start invisible/tiny
camera.position.z = 5;            // camera starts close

// Entrance timeline
const entranceTL = gsap.timeline({ delay: 0.4 });

// Camera pulls back to home position
entranceTL.to(camera.position, {
    z: cameraHome.z,
    y: cameraHome.y,
    duration: 2.2,
    ease: 'power3.out',
}, 0);

// Rabbit rises up from water
entranceTL.to(rabbit.position, {
    y: -1.0,
    duration: 2.0,
    ease: 'power2.out',
}, 0.3);

// Rabbit scales in
entranceTL.to(rabbit.scale, {
    x: 1, y: 1, z: 1,
    duration: 1.8,
    ease: 'back.out(1.4)',
}, 0.3);

// Hero text fades in after rabbit appears
entranceTL.to('.hero-content', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power2.out',
}, 1.4);

// ── RABBIT HOVER REACTION ─────────────────────────────────────────────────────
// Rabbit subtly faces the cursor

function updateParallax(elapsed) {

    // Smooth mouse tracking (lerp)
    target.x += (mouse.x - target.x) * 0.045;
    target.y += (mouse.y - target.y) * 0.045;

    // ── Camera parallax
    camera.position.x = cameraHome.x + target.x * parallaxConfig.camera.x;
    camera.position.y = cameraHome.y - target.y * parallaxConfig.camera.y;
    camera.lookAt(0, -0.5, 0); // always look slightly down at rabbit

    // ── Rabbit faces cursor
    rabbit.rotation.y = 0.15 + target.x * parallaxConfig.rabbit.x;

    // ── Fill light shifts with mouse for dynamic shading
    fillLight.position.x =  4 + target.x * parallaxConfig.fillLight.x;
    fillLight.position.y =  3 - target.y * parallaxConfig.fillLight.y;

    // ── Moon reflection shifts slightly
    moonReflection.position.x = target.x * 0.4;
}

// ── GSAP SCROLL PARALLAX ──────────────────────────────────────────────────────
// Scene fades + camera pulls back as user scrolls down

window.addEventListener('scroll', () => {
    const scrollY   = window.scrollY;
    const heroH     = heroSection.offsetHeight;
    const progress  = Math.min(scrollY / heroH, 1); // 0 → 1 as hero exits

    // Fade out the canvas as user scrolls away
    gsap.to(renderer.domElement, {
        opacity: 1 - progress * 1.2,
        duration: 0.3,
        ease: 'none',
    });

    // Camera drifts back on scroll
    gsap.to(camera.position, {
        z: cameraHome.z + progress * 4,
        duration: 0.4,
        ease: 'none',
    });

    // Rabbit sinks back into water on scroll
    gsap.to(rabbit.position, {
        y: -1.0 - progress * 2.5,
        duration: 0.4,
        ease: 'none',
    });
});

// ── GSAP BUTTON HOVER — rabbit reacts ─────────────────────────────────────────
const heroBtns = document.querySelectorAll('.btn-primary, .btn-ghost');

heroBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(rabbit.scale, {
            x: 1.08, y: 1.08, z: 1.08,
            duration: 0.4,
            ease: 'back.out(2)',
        });
        gsap.to(rabbit.rotation, {
            y: 0.4,
            duration: 0.5,
            ease: 'power2.out',
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(rabbit.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5,
            ease: 'power2.out',
        });
        gsap.to(rabbit.rotation, {
            y: 0.15,
            duration: 0.6,
            ease: 'power2.out',
        });
    });
});

// ── PLUG PARALLAX INTO RENDER LOOP ────────────────────────────────────────────
// Cancel previous loop and restart with parallax included

cancelAnimationFrame(window._heroAnimFrame);

function animateFull(elapsed) {
    window._heroAnimFrame = requestAnimationFrame(() => animateFull(clock.getElapsedTime()));

    animateRabbit(clock.getElapsedTime());
    animateWater(clock.getElapsedTime());
    animateRipples(clock.getElapsedTime());
    animateSplash(clock.getElapsedTime());
    animateMoonReflection(clock.getElapsedTime());
    updateParallax(clock.getElapsedTime());

    renderer.render(scene, camera);
}

animateFull(clock.getElapsedTime());

console.log('🖱️ Mouse parallax + GSAP active');