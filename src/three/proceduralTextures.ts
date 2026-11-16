import * as THREE from 'three';

export function createRadialGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0.0, 'rgba(255, 45, 45, 1.0)');
  grad.addColorStop(0.22, 'rgba(255, 0, 0, 0.72)');
  grad.addColorStop(0.55, 'rgba(139, 0, 0, 0.25)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createCircuitGridTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  // Subtle dark crimson sub-grid
  ctx.strokeStyle = 'rgba(139, 0, 0, 0.28)';
  ctx.lineWidth = 1;
  const subStep = size / 8;
  for (let i = 0; i <= 8; i++) {
    const p = i * subStep;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }

  // Primary circuit lines
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.62)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, size - 2, size - 2);

  // Crosshair nodes at intersections
  ctx.fillStyle = '#FF2020';
  for (let x = 0; x <= 8; x += 4) {
    for (let y = 0; y <= 8; y += 4) {
      const cx = x * subStep;
      const cy = y * subStep;
      ctx.fillRect(cx - 2, cy - 2, 4, 4);
    }
  }

  // PCB diagonal trace accent inside tile
  ctx.strokeStyle = 'rgba(255, 32, 32, 0.42)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(subStep, subStep * 2);
  ctx.lineTo(subStep * 3, subStep * 2);
  ctx.lineTo(subStep * 4, subStep * 3);
  ctx.lineTo(subStep * 6, subStep * 3);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function createBrushedMetalRoughnessMap(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#383838';
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y++) {
    const shade = 44 + Math.floor(Math.random() * 34);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(0, y, size, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createHologramPanelTexture(
  variant: 0 | 1 | 2 | 3,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const width = 512;
  const height = 320;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(5, 5, 5, 0.92)';
  ctx.fillRect(0, 0, width, height);

  // Outer perimeter frame
  ctx.strokeStyle = 'rgba(255, 32, 32, 0.85)';
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, width - 16, height - 16);

  // Inner technical grid
  ctx.strokeStyle = 'rgba(139, 0, 0, 0.25)';
  ctx.lineWidth = 1;
  for (let x = 32; x < width - 16; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 16);
    ctx.lineTo(x, height - 16);
    ctx.stroke();
  }
  for (let y = 32; y < height - 16; y += 32) {
    ctx.beginPath();
    ctx.moveTo(16, y);
    ctx.lineTo(width - 16, y);
    ctx.stroke();
  }

  // Header bar
  ctx.fillStyle = 'rgba(139, 0, 0, 0.35)';
  ctx.fillRect(16, 16, width - 32, 34);
  ctx.fillStyle = '#FF2020';
  ctx.font = 'bold 15px monospace';

  const titles = [
    'CORE_TOPOLOGY // ARCHITECTURE',
    'SIGNAL_BUS // NEURAL_ROUTING',
    'SYSTEM_MATRIX // FULL_STACK',
    'TELEMETRY_WAVE // EXECUTION',
  ];
  ctx.fillText(titles[variant], 28, 38);

  if (variant === 0) {
    // Concentric schematic radar & node axes
    const cx = width / 2;
    const cy = height / 2 + 16;
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    [36, 68, 100].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.strokeStyle = 'rgba(255, 32, 32, 0.6)';
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy);
    ctx.lineTo(cx + 120, cy);
    ctx.moveTo(cx, cy - 110);
    ctx.lineTo(cx, cy + 110);
    ctx.stroke();
    ctx.fillStyle = '#FF2020';
    ctx.fillRect(cx - 5, cy - 5, 10, 10);
  } else if (variant === 1) {
    // Circuit bus diagram
    ctx.strokeStyle = '#FF2020';
    ctx.lineWidth = 2.5;
    for (let row = 0; row < 4; row++) {
      const y = 85 + row * 50;
      ctx.beginPath();
      ctx.moveTo(36, y);
      ctx.lineTo(140 + row * 25, y);
      ctx.lineTo(180 + row * 25, y + 18);
      ctx.lineTo(width - 42, y + 18);
      ctx.stroke();
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(width - 48, y + 13, 10, 10);
    }
  } else if (variant === 2) {
    // Code & matrix blocks
    ctx.font = '14px monospace';
    const lines = [
      'const core = new DigitalArchitecture({',
      '  engine: "SPATIAL_3D_CORE",',
      '  runtime: "MODULAR_SYSTEMS",',
      '  persistence: "REALTIME_SYNC",',
      '  renderMode: "HIGH_PRECISION",',
      '  spectrum: ["#000000", "#FF0000"]',
      '});',
    ];
    lines.forEach((line, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#FFFFFF' : '#FF2020';
      ctx.fillText(line, 30, 88 + idx * 28);
    });
  } else {
    // Waveform telemetry
    ctx.strokeStyle = '#FF2020';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 32; x < width - 32; x += 6) {
      const t = (x - 32) / 30;
      const y = height / 2 + 16 + Math.sin(t * 1.8) * 48 * Math.cos(t * 0.45);
      if (x === 32) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Frequency bars
    ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
    for (let i = 0; i < 16; i++) {
      const h = 18 + ((i * 29) % 64);
      ctx.fillRect(36 + i * 28, height - 30 - h, 14, h);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}
