import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleBackground3DProps {
  scrollProgress: number;
}

export function ParticleBackground3D({ scrollProgress }: ParticleBackground3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  // Generar geometría de Banda de Möbius
  const generateMobiusStrip = (particleCount: number): Float32Array => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = (i / particleCount) * Math.PI * 2;
      const t = Math.random() * 2 - 1;

      const R = 2;
      const x = (R + t * Math.cos(u / 2)) * Math.cos(u);
      const y = (R + t * Math.cos(u / 2)) * Math.sin(u);
      const z = t * Math.sin(u / 2);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  };

  // Generar geometría de Teseracto (proyección 4D a 3D)
  const generateTesseract = (particleCount: number): Float32Array => {
    const positions = new Float32Array(particleCount * 3);
    const vertices4D = [];

    // Generar vértices del hipercubo 4D
    for (let i = 0; i < 16; i++) {
      vertices4D.push([
        (i & 1) ? 1 : -1,
        (i & 2) ? 1 : -1,
        (i & 4) ? 1 : -1,
        (i & 8) ? 1 : -1,
      ]);
    }

    // Proyectar 4D a 3D y distribuir partículas
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const edgeIndex = Math.floor(t * vertices4D.length) % vertices4D.length;
      const v = vertices4D[edgeIndex];

      // Proyección estereográfica 4D -> 3D
      const w = 0.5; // Parámetro de proyección
      const scale = 2 / (3 - v[3] * w);

      positions[i * 3] = v[0] * scale * 1.5 + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = v[1] * scale * 1.5 + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = v[2] * scale * 1.5 + (Math.random() - 0.5) * 0.2;
    }
    return positions;
  };

  // Generar geometría de Dragón (curva fractal)
  const generateDragon = (particleCount: number): Float32Array => {
    const positions = new Float32Array(particleCount * 3);

    // Curva del dragón usando sistema L
    const dragonCurve: [number, number][] = [];
    let x = 0, y = 0;
    let angle = 0;
    const step = 0.1;

    // Generar curva del dragón con iteraciones
    const iterations = 10;
    let commands = 'FX';

    for (let i = 0; i < iterations; i++) {
      commands = commands
        .replace(/X/g, 'X+YF+')
        .replace(/Y/g, '-FX-Y');
    }

    dragonCurve.push([x, y]);

    for (const cmd of commands) {
      if (cmd === 'F') {
        x += Math.cos(angle) * step;
        y += Math.sin(angle) * step;
        dragonCurve.push([x, y]);
      } else if (cmd === '+') {
        angle += Math.PI / 2;
      } else if (cmd === '-') {
        angle -= Math.PI / 2;
      }
    }

    // Distribuir partículas a lo largo de la curva
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * (dragonCurve.length - 1);
      const idx = Math.floor(t);
      const nextIdx = Math.min(idx + 1, dragonCurve.length - 1);
      const alpha = t - idx;

      const p1 = dragonCurve[idx];
      const p2 = dragonCurve[nextIdx];

      positions[i * 3] = p1[0] + (p2[0] - p1[0]) * alpha + (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 1] = p1[1] + (p2[1] - p1[1]) * alpha + (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    return positions;
  };

  // Interpolar entre dos geometrías
  const interpolateGeometries = (
    geo1: Float32Array,
    geo2: Float32Array,
    alpha: number
  ): Float32Array => {
    const result = new Float32Array(geo1.length);
    for (let i = 0; i < geo1.length; i++) {
      result[i] = geo1[i] * (1 - alpha) + geo2[i] * alpha;
    }
    return result;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Configurar escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Configurar cámara
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Configurar renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Crear partículas
    const particleCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = generateMobiusStrip(particleCount);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Generar todas las geometrías
    const mobiusGeo = generateMobiusStrip(particleCount);
    const tesseractGeo = generateTesseract(particleCount);
    const dragonGeo = generateDragon(particleCount);

    // Manejo del mouse
    const handleMouseMove = (event: MouseEvent) => {
      targetMouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Manejo del resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Loop de animación
    const animate = () => {
      requestAnimationFrame(animate);

      if (!particles || !camera || !renderer) return;

      // Suavizar movimiento del mouse
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      // Aplicar influencia del mouse
      camera.position.x = mouseRef.current.x * 0.5;
      camera.position.y = mouseRef.current.y * 0.5;
      camera.lookAt(scene.position);

      // Determinar qué geometría mostrar según el scroll
      let currentPositions: Float32Array;

      if (scrollProgress < 0.33) {
        // Transición de Möbius a Teseracto
        const alpha = scrollProgress / 0.33;
        currentPositions = interpolateGeometries(mobiusGeo, tesseractGeo, alpha);
      } else if (scrollProgress < 0.66) {
        // Transición de Teseracto a Dragón
        const alpha = (scrollProgress - 0.33) / 0.33;
        currentPositions = interpolateGeometries(tesseractGeo, dragonGeo, alpha);
      } else {
        // Mantener Dragón
        currentPositions = dragonGeo;
      }

      // Actualizar posiciones de partículas
      const positionAttribute = particles.geometry.getAttribute('position');
      for (let i = 0; i < currentPositions.length; i++) {
        positionAttribute.array[i] = currentPositions[i];
      }
      positionAttribute.needsUpdate = true;

      // Rotación suave
      particles.rotation.y += 0.001;
      particles.rotation.x = Math.sin(Date.now() * 0.0001) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Actualizar cuando cambia el scroll
  useEffect(() => {
    if (!particlesRef.current) return;

    // El scroll ya está siendo manejado en el loop de animación
  }, [scrollProgress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
