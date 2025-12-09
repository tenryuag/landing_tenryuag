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
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);
  const geometriesRef = useRef<{
    mobius: Float32Array;
    tesseract: Float32Array;
    dragon: Float32Array;
  } | null>(null);

  // Generar geometría de Banda de Möbius
  const generateMobiusStrip = (particleCount: number): Float32Array => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = (i / particleCount) * Math.PI * 4;
      const t = (Math.random() - 0.5) * 0.8;

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
    const vertices4D: number[][] = [];

    // Generar vértices del hipercubo 4D
    for (let i = 0; i < 16; i++) {
      vertices4D.push([
        (i & 1) ? 1.5 : -1.5,
        (i & 2) ? 1.5 : -1.5,
        (i & 4) ? 1.5 : -1.5,
        (i & 8) ? 1.5 : -1.5,
      ]);
    }

    // Generar aristas del hipercubo
    const edges: [number, number][] = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diff = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices4D[i][k] !== vertices4D[j][k]) diff++;
        }
        if (diff === 1) edges.push([i, j]);
      }
    }

    // Distribuir partículas a lo largo de las aristas
    for (let i = 0; i < particleCount; i++) {
      const edgeIndex = Math.floor((i / particleCount) * edges.length) % edges.length;
      const [v1Idx, v2Idx] = edges[edgeIndex];
      const t = (i % (particleCount / edges.length)) / (particleCount / edges.length);

      const v1 = vertices4D[v1Idx];
      const v2 = vertices4D[v2Idx];

      // Proyección estereográfica 4D -> 3D
      const w = 0.8;
      const v = [
        v1[0] + (v2[0] - v1[0]) * t,
        v1[1] + (v2[1] - v1[1]) * t,
        v1[2] + (v2[2] - v1[2]) * t,
        v1[3] + (v2[3] - v1[3]) * t,
      ];

      const scale = 1.8 / (3 - v[3] * w);

      positions[i * 3] = v[0] * scale;
      positions[i * 3 + 1] = v[1] * scale;
      positions[i * 3 + 2] = v[2] * scale;
    }
    return positions;
  };

  // Generar geometría de Dragón (curva fractal)
  const generateDragon = (particleCount: number): Float32Array => {
    const positions = new Float32Array(particleCount * 3);
    const dragonCurve: [number, number][] = [];

    let x = 0, y = 0;
    let angle = 0;
    const step = 0.08;

    // Generar curva del dragón con iteraciones
    const iterations = 12;
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

    // Normalizar y centrar la curva
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [px, py] of dragonCurve) {
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const scaleVal = 4 / Math.max(maxX - minX, maxY - minY);

    // Distribuir partículas a lo largo de la curva
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * (dragonCurve.length - 1);
      const idx = Math.floor(t);
      const nextIdx = Math.min(idx + 1, dragonCurve.length - 1);
      const alpha = t - idx;

      const p1 = dragonCurve[idx];
      const p2 = dragonCurve[nextIdx];

      positions[i * 3] = ((p1[0] + (p2[0] - p1[0]) * alpha) - centerX) * scaleVal;
      positions[i * 3 + 1] = ((p1[1] + (p2[1] - p1[1]) * alpha) - centerY) * scaleVal;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
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
    // Suavizar la transición con easing
    const easedAlpha = alpha < 0.5
      ? 2 * alpha * alpha
      : 1 - Math.pow(-2 * alpha + 2, 2) / 2;

    for (let i = 0; i < geo1.length; i++) {
      result[i] = geo1[i] * (1 - easedAlpha) + geo2[i] * easedAlpha;
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
    camera.position.z = 6;
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
      size: 0.025,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Generar y almacenar todas las geometrías
    geometriesRef.current = {
      mobius: generateMobiusStrip(particleCount),
      tesseract: generateTesseract(particleCount),
      dragon: generateDragon(particleCount),
    };

    let lastMouseX = 0;
    let lastMouseY = 0;

    // Manejo del mouse
    const handleMouseMove = (event: MouseEvent) => {
      const newX = (event.clientX / window.innerWidth) * 2 - 1;
      const newY = -(event.clientY / window.innerHeight) * 2 + 1;

      targetMouseRef.current = { x: newX, y: newY };

      // Calcular velocidad del mouse
      mouseVelocityRef.current = {
        x: (newX - lastMouseX) * 10,
        y: (newY - lastMouseY) * 10,
      };

      lastMouseX = newX;
      lastMouseY = newY;
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

    let animationId: number;

    // Loop de animación
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!particles || !camera || !renderer || !geometriesRef.current) return;

      // Suavizar movimiento del mouse
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      // Decrementar velocidad del mouse
      mouseVelocityRef.current.x *= 0.95;
      mouseVelocityRef.current.y *= 0.95;

      // Mover cámara con el mouse
      camera.position.x = mouseRef.current.x * 1.5;
      camera.position.y = mouseRef.current.y * 1.5;
      camera.lookAt(scene.position);

      // Calcular escala basada en la velocidad del mouse
      const velocity = Math.sqrt(
        mouseVelocityRef.current.x ** 2 + mouseVelocityRef.current.y ** 2
      );
      const targetScale = 1 + Math.min(velocity * 0.3, 0.5);

      // Suavizar la escala
      const currentScale = particles.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      particles.scale.set(newScale, newScale, newScale);

      // Determinar qué geometría mostrar según el scroll
      let currentPositions: Float32Array;
      const { mobius, tesseract, dragon } = geometriesRef.current;
      const currentScrollProgress = scrollProgressRef.current;

      if (currentScrollProgress < 0.33) {
        // Transición de Möbius a Teseracto
        const alpha = currentScrollProgress / 0.33;
        currentPositions = interpolateGeometries(mobius, tesseract, alpha);
      } else if (currentScrollProgress < 0.66) {
        // Transición de Teseracto a Dragón
        const alpha = (currentScrollProgress - 0.33) / 0.33;
        currentPositions = interpolateGeometries(tesseract, dragon, alpha);
      } else {
        // Mantener Dragón con pequeña variación
        const alpha = Math.min((currentScrollProgress - 0.66) / 0.34, 1);
        currentPositions = dragon;

        // Añadir un pequeño efecto de "completitud"
        particles.material.opacity = 0.7 + alpha * 0.3;
      }

      // Actualizar posiciones de partículas
      const positionAttribute = particles.geometry.getAttribute('position');
      for (let i = 0; i < currentPositions.length; i++) {
        positionAttribute.array[i] = currentPositions[i];
      }
      positionAttribute.needsUpdate = true;

      // Rotación suave basada en el mouse
      particles.rotation.y += 0.001 + Math.abs(mouseVelocityRef.current.x) * 0.01;
      particles.rotation.x += Math.sin(Date.now() * 0.0002) * 0.001 + Math.abs(mouseVelocityRef.current.y) * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
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

  // Actualizar el ref cuando cambia scrollProgress
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
