import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  detectSoftwareWebGL,
  prefersReducedMotion,
  afterDraw,
  disposeObject3D,
} from './webglUtils';

interface ServiceHoloCanvasProps {
  activeIndex: number;
}

export const ServiceHoloCanvas: React.FC<ServiceHoloCanvasProps> = ({ activeIndex }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  const [webglFallback, setWebglFallback] = useState(false);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const reducedMotion = prefersReducedMotion();

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 360;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0.35, 4.6);
    camera.lookAt(0, 0, 0);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const redLight = new THREE.PointLight(0xff1010, 14, 15);
    redLight.position.set(-2.5, 1.5, 2.5);
    scene.add(redLight);

    const ambient = new THREE.AmbientLight(0x330000, 0.9);
    scene.add(ambient);

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.85,
      roughness: 0.25,
    });

    const emissiveMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff2020,
      emissiveIntensity: 1.6,
      metalness: 0.2,
      roughness: 0.2,
    });

    const wireMat = new THREE.LineBasicMaterial({
      color: 0xff2020,
      transparent: true,
      opacity: 0.9,
    });

    const models: THREE.Group[] = [];

    // 0: Website Development — Layered holographic browser chassis + wire grid
    {
      const g = new THREE.Group();
      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.4, 0.1), darkMat);
      const frameWire = new THREE.LineSegments(new THREE.EdgesGeometry(frame.geometry), wireMat);
      const header = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.18, 0.14), emissiveMat);
      header.position.set(0, 0.48, 0.04);
      const paneL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.72, 0.14), darkMat);
      paneL.position.set(-0.48, -0.1, 0.08);
      paneL.add(new THREE.LineSegments(new THREE.EdgesGeometry(paneL.geometry), wireMat));
      const paneR = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.72, 0.14), darkMat);
      paneR.position.set(0.48, -0.1, 0.14);
      paneR.add(new THREE.LineSegments(new THREE.EdgesGeometry(paneR.geometry), wireMat));
      g.add(frame, frameWire, header, paneL, paneR);
      models.push(g);
    }

    // 1: Web Application Development — Interlocking modular architecture cubes
    {
      const g = new THREE.Group();
      const core = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.95), emissiveMat);
      g.add(core);
      const offsets = [
        [0.75, 0.5, 0.3],
        [-0.75, -0.45, 0.4],
        [0.4, -0.65, -0.5],
        [-0.5, 0.65, -0.4],
      ];
      offsets.forEach(([x, y, z]) => {
        const sub = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), darkMat);
        sub.position.set(x, y, z);
        sub.add(new THREE.LineSegments(new THREE.EdgesGeometry(sub.geometry), wireMat));
        g.add(sub);
      });
      models.push(g);
    }

    // 2: Custom Digital Systems — Octahedral central mainframe + orbital rings
    {
      const g = new THREE.Group();
      const octa = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), darkMat);
      octa.add(new THREE.LineSegments(new THREE.EdgesGeometry(octa.geometry), wireMat));
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.04, 12, 64), emissiveMat);
      ring1.rotation.x = Math.PI / 3;
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.03, 12, 64), darkMat);
      ring2.rotation.y = Math.PI / 3;
      g.add(octa, ring1, ring2);
      models.push(g);
    }

    // 3: Business Automation — Synchronized mechanical twin gear rotors
    {
      const g = new THREE.Group();
      const buildRotor = (radius: number, teeth: number) => {
        const rGroup = new THREE.Group();
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.22, 24), darkMat);
        hub.rotation.x = Math.PI / 2;
        const inner = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.62, 0.045, 10, 32), emissiveMat);
        rGroup.add(hub, inner);
        const toothGeo = new THREE.BoxGeometry(0.16, 0.22, 0.22);
        for (let i = 0; i < teeth; i++) {
          const a = (i / teeth) * Math.PI * 2;
          const tooth = new THREE.Mesh(toothGeo, darkMat);
          tooth.position.set(Math.cos(a) * (radius + 0.06), Math.sin(a) * (radius + 0.06), 0);
          tooth.rotation.z = a;
          tooth.add(new THREE.LineSegments(new THREE.EdgesGeometry(toothGeo), wireMat));
          rGroup.add(tooth);
        }
        return rGroup;
      };
      const rotorA = buildRotor(0.72, 10);
      rotorA.position.set(-0.52, 0.18, 0);
      const rotorB = buildRotor(0.55, 8);
      rotorB.position.set(0.68, -0.22, 0.12);
      g.add(rotorA, rotorB);
      g.userData.rotorA = rotorA;
      g.userData.rotorB = rotorB;
      models.push(g);
    }

    // 4: UI/UX Design — Precision wireframe torus-knot & spatial surface planes
    {
      const g = new THREE.Group();
      const knotGeo = new THREE.TorusKnotGeometry(0.75, 0.22, 80, 12);
      const knot = new THREE.Mesh(knotGeo, darkMat);
      const knotWire = new THREE.LineSegments(new THREE.WireframeGeometry(knotGeo), wireMat);
      g.add(knot, knotWire);
      models.push(g);
    }

    // 5: 3D Web & Interactive Experiences — Geodesic wireframe sphere & volumetric core
    {
      const g = new THREE.Group();
      const ico = new THREE.IcosahedronGeometry(1.15, 1);
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(ico), wireMat);
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), emissiveMat);
      g.add(wire, core);

      const posAttr = ico.attributes.position;
      const nodeGeo = new THREE.SphereGeometry(0.055, 8, 8);
      const seen = new Set<string>();
      for (let i = 0; i < posAttr.count; i++) {
        const key = `${posAttr.getX(i).toFixed(2)},${posAttr.getY(i).toFixed(2)},${posAttr.getZ(i).toFixed(2)}`;
        if (!seen.has(key)) {
          seen.add(key);
          const node = new THREE.Mesh(nodeGeo, emissiveMat);
          node.position.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
          g.add(node);
        }
      }
      models.push(g);
    }

    models.forEach((m, idx) => {
      m.visible = idx === activeIndexRef.current;
      scene.add(m);
    });

    // Pointer interactivity inside the viewport
    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const handlePointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(100, entry.contentRect.width);
        const h = Math.max(100, entry.contentRect.height);
        width = w;
        height = h;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      setWebglFallback(true);
    };
    const onContextRestored = () => {
      setWebglFallback(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const targetIdx = activeIndexRef.current;

      models.forEach((m, idx) => {
        const isActive = idx === targetIdx;
        m.visible = isActive;
        if (isActive) {
          const targetRotX = pointer.y * 0.45 + Math.sin(elapsed * 0.7) * 0.1;
          const targetRotY = (reducedMotion ? 0 : elapsed * 0.55) + pointer.x * 0.65;
          m.rotation.x = THREE.MathUtils.damp(m.rotation.x, targetRotX, 5, delta);
          m.rotation.y = THREE.MathUtils.damp(m.rotation.y, targetRotY, 5, delta);

          if (idx === 3 && !reducedMotion && m.userData.rotorA && m.userData.rotorB) {
            (m.userData.rotorA as THREE.Group).rotation.z = elapsed * 0.9;
            (m.userData.rotorB as THREE.Group).rotation.z = -elapsed * 1.12;
          }
        }
      });

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(renderer, tick, (id) => {
          frameId = id;
        });
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      disposeObject3D(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webglFallback) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-44 h-44" aria-hidden="true">
          <polygon
            points="100,16 178,60 178,140 100,184 22,140 22,60"
            fill="none"
            stroke="#FF2020"
            strokeWidth="2"
          />
          <polygon
            points="100,40 154,70 154,130 100,160 46,130 46,70"
            fill="#111111"
            stroke="#8B0000"
            strokeWidth="1.5"
          />
          <circle cx="100" cy="100" r="14" fill="#FF0000" />
        </svg>
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-full min-h-[300px] cursor-crosshair" />;
};
