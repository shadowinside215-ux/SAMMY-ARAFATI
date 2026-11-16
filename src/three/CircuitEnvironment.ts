import * as THREE from 'three';

export interface CircuitEnvironmentHandles {
  group: THREE.Group;
  pulseMaterials: THREE.ShaderMaterial[];
  hologramPanels: THREE.Mesh[];
  particles: THREE.Points;
  floorMesh: THREE.Mesh;
  pulseWaveMesh: THREE.Mesh;
}

const PULSE_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PULSE_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uOffset;
  uniform vec3 uBaseColor;
  uniform vec3 uPulseColor;
  varying vec2 vUv;

  void main() {
    float flow = fract(vUv.x * 2.0 - uTime * uSpeed + uOffset);
    float pulse = smoothstep(0.0, 0.14, flow) * (1.0 - smoothstep(0.14, 0.38, flow));
    vec3 col = mix(uBaseColor, uPulseColor, pulse * 1.4);
    float alpha = 0.25 + pulse * 0.75;
    gl_FragColor = vec4(col, alpha);
  }
`;

const HOLO_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HOLO_FRAGMENT_SHADER = `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float scanline = 0.88 + 0.12 * sin(vUv.y * 140.0 - uTime * 4.0);
    float edgeX = smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x);
    float edgeY = smoothstep(0.0, 0.04, vUv.y) * smoothstep(1.0, 0.96, vUv.y);
    float borderGlow = (1.0 - edgeX * edgeY) * 0.45;
    vec3 color = tex.rgb * scanline + vec3(1.0, 0.1, 0.1) * borderGlow;
    gl_FragColor = vec4(color, tex.a * uOpacity);
  }
`;

export function buildCircuitEnvironment(
  gridTexture: THREE.Texture,
  panelTextures: THREE.Texture[],
  glowTexture: THREE.Texture,
  isMobile: boolean
): CircuitEnvironmentHandles {
  const group = new THREE.Group();
  const pulseMaterials: THREE.ShaderMaterial[] = [];
  const hologramPanels: THREE.Mesh[] = [];

  // 1. Infinite-horizon digital grid floor
  const floorGeo = new THREE.PlaneGeometry(110, 110);
  const floorMat = new THREE.MeshBasicMaterial({
    map: gridTexture,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = -3.4;
  group.add(floorMesh);

  // Subtle inverted ceiling architectural grid
  const ceilingMesh = new THREE.Mesh(floorGeo, floorMat);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.y = 11.5;
  group.add(ceilingMesh);

  // 2. Animated 3D circuit traces with traveling red energy pulses
  const traceCount = isMobile ? 10 : 20;
  for (let i = 0; i < traceCount; i++) {
    const angle = (i / traceCount) * Math.PI * 2;
    const radiusStart = 3.2;
    const radiusMid = 8 + (i % 3) * 2.5;
    const radiusEnd = 22 + (i % 4) * 3;
    const yLevel = -3.32 + (i % 3) * 0.04;

    const p1 = new THREE.Vector3(Math.cos(angle) * radiusStart, yLevel, Math.sin(angle) * radiusStart);
    const p2 = new THREE.Vector3(Math.cos(angle) * radiusMid, yLevel, Math.sin(angle) * radiusMid);
    const bendAngle = angle + (i % 2 === 0 ? 0.24 : -0.24);
    const p3 = new THREE.Vector3(Math.cos(bendAngle) * radiusEnd, yLevel, Math.sin(bendAngle) * radiusEnd);
    const p4 = new THREE.Vector3(Math.cos(bendAngle) * (radiusEnd + 6), yLevel + 2.8, Math.sin(bendAngle) * (radiusEnd + 6));

    const curve = new THREE.CatmullRomCurve3([p1, p2, p3, p4], false, 'catmullrom', 0.15);
    const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.028, 6, false);

    const pulseMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.38 + (i % 5) * 0.11 },
        uOffset: { value: i * 0.37 },
        uBaseColor: { value: new THREE.Color(0x450000) },
        uPulseColor: { value: new THREE.Color(0xff2020) },
      },
      vertexShader: PULSE_VERTEX_SHADER,
      fragmentShader: PULSE_FRAGMENT_SHADER,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    pulseMaterials.push(pulseMat);
    const tubeMesh = new THREE.Mesh(tubeGeo, pulseMat);
    group.add(tubeMesh);
  }

  // 3. Floating 3D Holographic Interface Panels
  const panelConfigs = [
    { pos: [-5.6, 1.5, -2.5], rotY: 0.42 },
    { pos: [5.8, -0.6, -2.2], rotY: -0.44 },
    { pos: [-6.4, -1.2, -7.2], rotY: 0.34 },
    { pos: [6.2, 2.2, -7.8], rotY: -0.36 },
    { pos: [-4.8, 1.8, -13.5], rotY: 0.28 },
    { pos: [5.1, -0.8, -14.0], rotY: -0.3 },
  ];

  panelConfigs.forEach((cfg, idx) => {
    const tex = panelTextures[idx % panelTextures.length];
    const panelGeo = new THREE.PlaneGeometry(3.2, 2.0);
    const panelMat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: tex },
        uTime: { value: 0 },
        uOpacity: { value: 0.85 },
      },
      vertexShader: HOLO_VERTEX_SHADER,
      fragmentShader: HOLO_FRAGMENT_SHADER,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    panel.rotation.y = cfg.rotY;
    panel.userData.baseY = cfg.pos[1];
    panel.userData.phase = idx * 1.15;
    hologramPanels.push(panel);
    group.add(panel);
  });

  // 4. Layered 3D Red Particle Field
  const particleCount = isMobile ? 220 : 520;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 34;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 36 - 4;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.22,
    map: glowTexture,
    color: 0xff2020,
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  // 5. Contact terminal radial pulse wave ring
  const waveGeo = new THREE.RingGeometry(1.1, 1.24, 64);
  const waveMat = new THREE.MeshBasicMaterial({
    color: 0xff2020,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const pulseWaveMesh = new THREE.Mesh(waveGeo, waveMat);
  pulseWaveMesh.rotation.x = -Math.PI / 2;
  pulseWaveMesh.position.y = -3.34;
  group.add(pulseWaveMesh);

  return {
    group,
    pulseMaterials,
    hologramPanels,
    particles,
    floorMesh,
    pulseWaveMesh,
  };
}
