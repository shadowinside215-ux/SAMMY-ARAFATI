import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import {
  detectSoftwareWebGL,
  prefersReducedMotion,
  isMobileViewport,
  afterDraw,
  disposeObject3D,
} from './webglUtils';
import {
  createRadialGlowTexture,
  createCircuitGridTexture,
  createBrushedMetalRoughnessMap,
  createHologramPanelTexture,
} from './proceduralTextures';
import { buildMachineCore } from './MachineCoreBuilder';
import { buildCircuitEnvironment } from './CircuitEnvironment';

// Module-scoped reusable vectors to guarantee zero GC in animation loop
const _camTargetPos = new THREE.Vector3();
const _camLookTarget = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 0, 0);

interface FuturisticCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

export const FuturisticCanvas: React.FC<FuturisticCanvasProps> = ({ scrollProgressRef }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const reducedMotion = prefersReducedMotion();
    const isMobile = isMobileViewport();

    let width = window.innerWidth;
    let height = window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && !isMobile,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setContextLost(true);
      return;
    }

    const pixelRatio = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x000000, 1);

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.036);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 120);
    camera.position.set(0, 0.8, 9.2);

    // Studio environment reflections for metallic dark carbon-steel components
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Lighting rig: strictly monochrome dark + crimson/red key & rim lights
    const hemiLight = new THREE.HemisphereLight(0x2a0505, 0x050505, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(6, 9, 7);
    scene.add(keyLight);

    const rimLightLeft = new THREE.DirectionalLight(0xff0000, 2.8);
    rimLightLeft.position.set(-8, 4, -5);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xff2020, 2.2);
    rimLightRight.position.set(8, -2, -6);
    scene.add(rimLightRight);

    // Procedural textures
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const glowTex = createRadialGlowTexture();
    const gridTex = createCircuitGridTexture(maxAniso);
    const roughnessTex = createBrushedMetalRoughnessMap();
    const holoTextures = [
      createHologramPanelTexture(0, maxAniso),
      createHologramPanelTexture(1, maxAniso),
      createHologramPanelTexture(2, maxAniso),
      createHologramPanelTexture(3, maxAniso),
    ];

    // Build Core & Environment
    const core = buildMachineCore(glowTex, roughnessTex);
    scene.add(core.group);

    const env = buildCircuitEnvironment(gridTex, holoTextures, glowTex, isMobile);
    scene.add(env.group);

    // Optional GPU Bloom Post-Processing (disabled on software WebGL & small mobile devices)
    let composer: EffectComposer | null = null;
    let bloomPass: UnrealBloomPass | null = null;
    if (!isSoftwareGl && !isMobile) {
      composer = new EffectComposer(renderer);
      composer.setPixelRatio(pixelRatio);
      composer.setSize(width, height);
      composer.addPass(new RenderPass(scene, camera));
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.48,
        0.45,
        0.68
      );
      composer.addPass(bloomPass);
      composer.addPass(new OutputPass());
    }

    // Pre-warm shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer tracking
    const mouseTarget = { x: 0, y: 0 };
    const mouseSmoothed = { x: 0, y: 0 };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const nextRatio = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(nextRatio);
      renderer.setSize(width, height);
      if (composer) {
        composer.setPixelRatio(nextRatio);
        composer.setSize(width, height);
      }
      if (bloomPass) {
        bloomPass.resolution.set(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    let frameId = 0;
    let disposed = false;
    let isContextLost = false;
    let lastTimeMs = performance.now();
    const startTimeMs = lastTimeMs;

    const tick = () => {
      if (disposed || isContextLost) return;

      const nowMs = performance.now();
      const delta = Math.min(Math.max((nowMs - lastTimeMs) / 1000, 0.001), 0.05);
      const elapsed = (nowMs - startTimeMs) / 1000;
      lastTimeMs = nowMs;

      const scroll = Math.max(0, Math.min(1, scrollProgressRef.current));

      // Smooth pointer parallax
      const motionMult = reducedMotion ? 0 : 1;
      mouseSmoothed.x = THREE.MathUtils.damp(mouseSmoothed.x, mouseTarget.x * motionMult, 4.5, delta);
      mouseSmoothed.y = THREE.MathUtils.damp(mouseSmoothed.y, mouseTarget.y * motionMult, 4.5, delta);

      // Camera choreography across sections of the machine
      const camZ = 9.2 - Math.sin(scroll * Math.PI * 0.85) * 3.2 - scroll * 1.1;
      const camX = Math.sin(scroll * Math.PI * 2.1) * 2.8 + mouseSmoothed.x * 1.15;
      const camY = 0.75 + Math.cos(scroll * Math.PI * 1.6) * 1.25 + mouseSmoothed.y * 0.7;

      _camTargetPos.set(camX, camY, Math.max(5.2, camZ));
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _camTargetPos.x, 3.8, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _camTargetPos.y, 3.8, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _camTargetPos.z, 3.8, delta);

      _camLookTarget.set(mouseSmoothed.x * 0.4, -scroll * 0.35 + mouseSmoothed.y * 0.25, 0);
      _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, _camLookTarget.x, 4.2, delta);
      _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, _camLookTarget.y, 4.2, delta);
      _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, _camLookTarget.z, 4.2, delta);
      camera.lookAt(_currentLookAt);

      if (!reducedMotion) {
        // Mechanical core rotation & scroll responsiveness
        core.innerCrystal.rotation.y = elapsed * 0.42 + scroll * 3.0;
        core.innerCrystal.rotation.x = elapsed * 0.25;
        core.wireCage.rotation.y = -elapsed * 0.28 + scroll * 2.2;
        core.wireCage.rotation.z = elapsed * 0.16;

        core.gyroRingA.rotation.z += delta * 0.55;
        core.gyroRingA.rotation.y += delta * 0.22;
        core.gyroRingB.rotation.x -= delta * 0.42;
        core.gyroRingB.rotation.z += delta * 0.18;
        core.gyroRingC.rotation.y += delta * 0.35;
        core.gyroRingC.rotation.x += delta * 0.14;

        core.statorGroup.rotation.y = -elapsed * 0.12 - scroll * 1.8;
        core.satellitesGroup.rotation.y = elapsed * 0.38;
        core.satellitesGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.18;

        // Subtle volumetric pulse
        const pulse = 1 + Math.sin(elapsed * 2.2) * 0.08;
        core.coreHalo.scale.set(5.4 * pulse, 5.4 * pulse, 1);
        core.coreLight.intensity = 20 + Math.sin(elapsed * 2.4) * 4 + scroll * 8;

        // Circuit energy pulses
        for (const mat of env.pulseMaterials) {
          mat.uniforms.uTime.value = elapsed;
        }

        // Holographic panels subtle levitation & scanline update
        for (const panel of env.hologramPanels) {
          const mat = panel.material as THREE.ShaderMaterial;
          mat.uniforms.uTime.value = elapsed;
          panel.position.y =
            (panel.userData.baseY as number) +
            Math.sin(elapsed * 1.1 + (panel.userData.phase as number)) * 0.16;
        }

        // Particle drift
        env.particles.rotation.y = elapsed * 0.03 + mouseSmoothed.x * 0.06;
        env.particles.rotation.x = mouseSmoothed.y * 0.04;

        // Contact communication pulse wave intensifies near bottom of page
        const contactBlend = THREE.MathUtils.smoothstep(scroll, 0.72, 0.98);
        const waveCycle = (elapsed * 0.55) % 1;
        const waveScale = 1 + waveCycle * 8.5;
        env.pulseWaveMesh.scale.set(waveScale, waveScale, 1);
        (env.pulseWaveMesh.material as THREE.MeshBasicMaterial).opacity =
          contactBlend * (1 - waveCycle) * 0.65;
      }

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(renderer, tick, (id) => {
          frameId = id;
        });
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      isContextLost = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      setContextLost(true);
    };

    const onContextRestored = () => {
      isContextLost = false;
      lastTimeMs = performance.now();
      setContextLost(false);
      tick();
    };

    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      disposeObject3D(scene);
      envTarget.dispose();
      composer?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollProgressRef]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#000000]">
      <div ref={mountRef} className={`w-full h-full ${contextLost ? 'opacity-0' : 'opacity-100'}`} />
      {contextLost && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, rgba(255,0,0,0.18) 0%, rgba(139,0,0,0.08) 32%, #000000 72%)',
          }}
        />
      )}
      {/* Cinematic subtle vignette ensuring maximum contrast for overlaid semantic UI */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.62) 68%, rgba(0,0,0,0.88) 100%)',
        }}
      />
    </div>
  );
};
