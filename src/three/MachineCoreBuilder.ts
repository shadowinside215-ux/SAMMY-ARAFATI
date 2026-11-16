import * as THREE from 'three';

export interface MachineCoreHandles {
  group: THREE.Group;
  innerCrystal: THREE.Mesh;
  wireCage: THREE.LineSegments;
  gyroRingA: THREE.Group;
  gyroRingB: THREE.Group;
  gyroRingC: THREE.Group;
  statorGroup: THREE.Group;
  satellitesGroup: THREE.Group;
  coreHalo: THREE.Sprite;
  coreLight: THREE.PointLight;
  contactRing: THREE.Mesh;
}

export function buildMachineCore(
  glowTexture: THREE.Texture,
  roughnessMap: THREE.Texture
): MachineCoreHandles {
  const group = new THREE.Group();

  // 1. Dark brushed obsidian carbon-steel PBR material
  const darkSteelMat = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.92,
    roughness: 0.24,
    roughnessMap,
    clearcoat: 0.75,
    clearcoatRoughness: 0.2,
    anisotropy: 0.75,
  });

  // 2. Deep matte charcoal structural chassis material (roughness delta >= 0.35)
  const matteChassisMat = new THREE.MeshStandardMaterial({
    color: 0x050505,
    metalness: 0.35,
    roughness: 0.72,
  });

  // 3. Glowing red emissive core material
  const emissiveRedMat = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff1010,
    emissiveIntensity: 2.2,
    metalness: 0.15,
    roughness: 0.2,
  });

  const wireRedMat = new THREE.LineBasicMaterial({
    color: 0xff2020,
    transparent: true,
    opacity: 0.9,
  });

  // Part 1: Inner faceted reactor crystal
  const innerGeo = new THREE.IcosahedronGeometry(0.95, 1);
  const innerCrystal = new THREE.Mesh(innerGeo, emissiveRedMat);
  group.add(innerCrystal);

  // Part 2: Geodesic wireframe containment lattice
  const cageGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.32, 1));
  const wireCage = new THREE.LineSegments(cageGeo, wireRedMat);
  group.add(wireCage);

  // Part 3: Instanced radial cooling blades (16 precision obsidian fins)
  const finShape = new THREE.Shape();
  finShape.moveTo(0, -0.55);
  finShape.lineTo(0.42, -0.35);
  finShape.lineTo(0.48, 0.35);
  finShape.lineTo(0, 0.55);
  finShape.closePath();

  const finGeo = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
  });
  finGeo.center();

  const finCount = 16;
  const coolingFins = new THREE.InstancedMesh(finGeo, darkSteelMat, finCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < finCount; i++) {
    const angle = (i / finCount) * Math.PI * 2;
    dummy.position.set(Math.cos(angle) * 1.48, 0, Math.sin(angle) * 1.48);
    dummy.rotation.set(0, -angle, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    coolingFins.setMatrixAt(i, dummy.matrix);
  }
  coolingFins.instanceMatrix.needsUpdate = true;
  coolingFins.computeBoundingSphere();
  group.add(coolingFins);

  // Part 4-6: Three nested counter-rotating gyroscopic containment rings
  const buildGyroRing = (radius: number, tube: number, brackets: number, tiltX: number, tiltZ: number) => {
    const ringGroup = new THREE.Group();
    const torus = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 16, 84), darkSteelMat);
    ringGroup.add(torus);

    // Glowing red inner laser ring
    const laserTorus = new THREE.Mesh(
      new THREE.TorusGeometry(radius - tube * 1.05, tube * 0.24, 12, 84),
      emissiveRedMat
    );
    ringGroup.add(laserTorus);

    // Mechanical clamps around ring
    const clampGeo = new THREE.BoxGeometry(tube * 2.8, tube * 2.4, tube * 3.2);
    const clamps = new THREE.InstancedMesh(clampGeo, matteChassisMat, brackets);
    for (let i = 0; i < brackets; i++) {
      const a = (i / brackets) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      dummy.rotation.set(0, 0, a);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      clamps.setMatrixAt(i, dummy.matrix);
    }
    clamps.instanceMatrix.needsUpdate = true;
    clamps.computeBoundingSphere();
    ringGroup.add(clamps);

    ringGroup.rotation.set(tiltX, 0, tiltZ);
    return ringGroup;
  };

  const gyroRingA = buildGyroRing(2.05, 0.065, 8, Math.PI * 0.18, 0.2);
  const gyroRingB = buildGyroRing(2.45, 0.055, 10, -Math.PI * 0.28, -0.35);
  const gyroRingC = buildGyroRing(2.9, 0.048, 12, Math.PI * 0.42, 0.12);
  group.add(gyroRingA, gyroRingB, gyroRingC);

  // Part 7-12: Outer segmented armored stator plates (6 curved architectural shields)
  const statorGroup = new THREE.Group();
  const arcAngle = Math.PI / 5.2;
  const plateGeo = new THREE.CylinderGeometry(3.25, 3.25, 0.72, 16, 1, true, -arcAngle / 2, arcAngle);
  const plateEdgeGeo = new THREE.EdgesGeometry(plateGeo);

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const holder = new THREE.Group();
    const plate = new THREE.Mesh(plateGeo, matteChassisMat);
    plate.material.side = THREE.DoubleSide;
    const edge = new THREE.LineSegments(plateEdgeGeo, wireRedMat);
    holder.add(plate, edge);
    holder.rotation.y = a;
    statorGroup.add(holder);
  }
  group.add(statorGroup);

  // Part 13: Orbiting telemetry octahedra satellites
  const satellitesGroup = new THREE.Group();
  const satGeo = new THREE.OctahedronGeometry(0.18, 0);
  const satWireGeo = new THREE.EdgesGeometry(satGeo);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const satHolder = new THREE.Group();
    const satCore = new THREE.Mesh(satGeo, darkSteelMat);
    const satWire = new THREE.LineSegments(satWireGeo, wireRedMat);
    satHolder.add(satCore, satWire);
    satHolder.position.set(Math.cos(a) * 3.7, Math.sin(a * 2) * 0.75, Math.sin(a) * 3.7);
    satellitesGroup.add(satHolder);
  }
  group.add(satellitesGroup);

  // Part 14: Volumetric red core halo & PointLight
  const spriteMat = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xff2020,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const coreHalo = new THREE.Sprite(spriteMat);
  coreHalo.scale.set(5.4, 5.4, 1);
  group.add(coreHalo);

  const coreLight = new THREE.PointLight(0xff1515, 22, 26, 1.6);
  coreLight.position.set(0, 0, 0);
  group.add(coreLight);

  // Ground calibration laser ring beneath core
  const contactRingGeo = new THREE.RingGeometry(2.6, 2.72, 64);
  const contactRingMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.55,
  });
  const contactRing = new THREE.Mesh(contactRingGeo, contactRingMat);
  contactRing.rotation.x = -Math.PI / 2;
  contactRing.position.y = -3.38;
  group.add(contactRing);

  return {
    group,
    innerCrystal,
    wireCage,
    gyroRingA,
    gyroRingB,
    gyroRingC,
    statorGroup,
    satellitesGroup,
    coreHalo,
    coreLight,
    contactRing,
  };
}
