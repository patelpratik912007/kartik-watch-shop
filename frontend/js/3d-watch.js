/**
 * Kartik Watch Shop — Three.js 3D Watch Hero Renderer
 * Creates an animated 3D wristwatch using Three.js geometry
 */

(function () {
  function init3DWatch() {
    const container = document.getElementById('hero-3d-watch');
    if (!container) return;

    const W = container.clientWidth || 420;
    const H = container.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xDFBA73, 3, 12);
    goldLight.position.set(3, 4, 3);
    scene.add(goldLight);

    const greenLight = new THREE.PointLight(0x006039, 2, 10);
    greenLight.position.set(-3, -2, 2);
    scene.add(greenLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(0, 5, -3);
    scene.add(rimLight);

    // Materials
    const caseMat = new THREE.MeshStandardMaterial({
      color: 0xC5A059,
      metalness: 0.95,
      roughness: 0.12,
      envMapIntensity: 1.2,
    });

    const dialMat = new THREE.MeshStandardMaterial({
      color: 0x061712,
      metalness: 0.1,
      roughness: 0.5,
    });

    const bezMat = new THREE.MeshStandardMaterial({
      color: 0x006039,
      metalness: 0.7,
      roughness: 0.2,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xaaccff,
      metalness: 0,
      roughness: 0,
      transmission: 0.95,
      transparent: true,
      opacity: 0.18,
    });

    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x3B2810,
      metalness: 0.05,
      roughness: 0.88,
    });

    const handMat = new THREE.MeshStandardMaterial({
      color: 0xF3E0B5,
      metalness: 0.9,
      roughness: 0.1,
    });

    const secondHandMat = new THREE.MeshStandardMaterial({
      color: 0xff3c28,
      metalness: 0.8,
      roughness: 0.15,
    });

    // Watch group
    const watchGroup = new THREE.Group();
    scene.add(watchGroup);

    // === CASE (thick cylinder) ===
    const caseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.38, 64);
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    caseMesh.rotation.x = Math.PI / 2;
    watchGroup.add(caseMesh);

    // === BEZEL (slightly larger ring on top) ===
    const bezGeo = new THREE.TorusGeometry(1.22, 0.09, 16, 64);
    const bezMesh = new THREE.Mesh(bezGeo, bezMat);
    bezMesh.position.z = 0.2;
    watchGroup.add(bezMesh);

    // === DIAL (flat circle inside) ===
    const dialGeo = new THREE.CylinderGeometry(1.08, 1.08, 0.04, 64);
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.rotation.x = Math.PI / 2;
    dialMesh.position.z = 0.18;
    watchGroup.add(dialMesh);

    // === GLASS (crystal on face) ===
    const glassGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.03, 64);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.rotation.x = Math.PI / 2;
    glassMesh.position.z = 0.23;
    watchGroup.add(glassMesh);

    // === CROWN (side winding crown) ===
    const crownGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.28, 16);
    const crownMesh = new THREE.Mesh(crownGeo, caseMat);
    crownMesh.rotation.z = Math.PI / 2;
    crownMesh.position.set(1.34, 0.1, 0);
    watchGroup.add(crownMesh);

    // === HOUR MARKERS (12 small boxes) ===
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const markerGeo = i % 3 === 0
        ? new THREE.BoxGeometry(0.08, 0.22, 0.02)
        : new THREE.BoxGeometry(0.05, 0.14, 0.02);
      const marker = new THREE.Mesh(markerGeo, handMat);
      const r = 0.82;
      marker.position.set(Math.sin(angle) * r, Math.cos(angle) * r, 0.25);
      marker.rotation.z = -angle;
      watchGroup.add(marker);
    }

    // === HOUR HAND ===
    const hourHandGeo = new THREE.BoxGeometry(0.09, 0.55, 0.03);
    const hourHand = new THREE.Mesh(hourHandGeo, handMat);
    hourHand.position.set(0, 0.22, 0.28);
    watchGroup.add(hourHand);

    // === MINUTE HAND ===
    const minHandGeo = new THREE.BoxGeometry(0.06, 0.78, 0.03);
    const minHand = new THREE.Mesh(minHandGeo, handMat);
    minHand.position.set(0, 0.32, 0.30);
    watchGroup.add(minHand);

    // === SECOND HAND ===
    const secHandGeo = new THREE.BoxGeometry(0.03, 0.9, 0.02);
    const secHand = new THREE.Mesh(secHandGeo, secondHandMat);
    secHand.position.set(0, 0.35, 0.32);
    watchGroup.add(secHand);

    // === CENTER PIN ===
    const pinGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const pin = new THREE.Mesh(pinGeo, new THREE.MeshStandardMaterial({ color: 0xC5A059, metalness: 1, roughness: 0.05 }));
    pin.position.z = 0.34;
    watchGroup.add(pin);

    // === STRAPS (top and bottom) ===
    const strapGeo = new THREE.BoxGeometry(0.9, 1.05, 0.12);
    const strapTop = new THREE.Mesh(strapGeo, strapMat);
    strapTop.position.set(0, 1.55, -0.02);
    watchGroup.add(strapTop);

    const strapBottom = new THREE.Mesh(strapGeo, strapMat);
    strapBottom.position.set(0, -1.55, -0.02);
    watchGroup.add(strapBottom);

    // Strap buckle (bottom)
    const buckleGeo = new THREE.TorusGeometry(0.18, 0.04, 8, 20);
    const buckle = new THREE.Mesh(buckleGeo, caseMat);
    buckle.position.set(0, -2.38, -0.02);
    buckle.rotation.x = Math.PI / 2;
    watchGroup.add(buckle);

    // Slight tilt for dramatic view
    watchGroup.rotation.x = 0.22;
    watchGroup.rotation.y = -0.18;

    // === ANIMATE CLOCK HANDS ===
    function setHandAngles() {
      const now = new Date();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      const secAngle = -(s / 60) * Math.PI * 2;
      const minAngle = -(m / 60) * Math.PI * 2;
      const hrAngle  = -(h / 12) * Math.PI * 2;

      // pivot at base: offset position and rotate around z
      secHand.rotation.z = secAngle;
      minHand.rotation.z = minAngle;
      hourHand.rotation.z = hrAngle;
    }

    // === SCROLL PARALLAX ===
    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; });

    // === MOUSE PARALLAX ===
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let frameId;
    function animate() {
      frameId = requestAnimationFrame(animate);

      // Slow auto-rotate
      watchGroup.rotation.y += 0.004;

      // Subtle mouse parallax
      watchGroup.rotation.x = 0.22 + mouseY * 0.08;
      watchGroup.rotation.z = mouseX * 0.04;

      // Scroll float
      watchGroup.position.y = -scrollY * 0.003;

      setHandAngles();
      renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
      const nW = container.clientWidth;
      const nH = container.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    });

    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(frameId);
      else animate();
    });
  }

  // Load Three.js from CDN then init
  if (typeof THREE !== 'undefined') {
    init3DWatch();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = init3DWatch;
    document.head.appendChild(script);
  }
})();
