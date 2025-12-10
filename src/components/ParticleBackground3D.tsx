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
    sphere: Float32Array;
    tesseract: Float32Array;
    tesseract2: Float32Array;
  } | null>(null);

  // Generar geometría de Esfera (planeta)
  const generateSphere = (particleCount: number): Float32Array => {
    const positions = new Float32Array(particleCount * 3);
    const radius = 2.5;

    for (let i = 0; i < particleCount; i++) {
      // Distribución uniforme en una esfera usando el método de Fibonacci
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      // Añadir variación en el radio para efecto de volumen y atmósfera
      const r = radius * (0.7 + Math.random() * 0.3);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  };

  // Generar geometría de Teseracto (proyección 4D a 3D con volumen)
  const generateTesseract = (particleCount: number): Float32Array => {
    const positions = new Float32Array(particleCount * 3);

    // Generar partículas en el volumen del hipercubo 4D
    for (let i = 0; i < particleCount; i++) {
      // Coordenadas aleatorias en el hipercubo 4D [-1.5, 1.5]
      const v = [
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
      ];

      // Proyección estereográfica 4D -> 3D
      const w = 0.8;
      const scale = 1.8 / (3 - v[3] * w);

      positions[i * 3] = v[0] * scale;
      positions[i * 3 + 1] = v[1] * scale;
      positions[i * 3 + 2] = v[2] * scale;
    }
    return positions;
  };

  // Generar geometría de Teseracto 2 (versión expandida para contacto)
  const generateTesseract2 = (particleCount: number): Float32Array => {
    const positions = new Float32Array(particleCount * 3);

    // Generar partículas en el volumen del hipercubo 4D (más grande)
    for (let i = 0; i < particleCount; i++) {
      // Coordenadas aleatorias en el hipercubo 4D con mayor rango
      const v = [
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5,
      ];

      // Proyección estereográfica 4D -> 3D con parámetros ajustados
      const w = 0.6;
      const scale = 2.2 / (3 - v[3] * w);

      positions[i * 3] = v[0] * scale;
      positions[i * 3 + 1] = v[1] * scale;
      positions[i * 3 + 2] = v[2] * scale;
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
    const particleCount = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = generateSphere(particleCount);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x8B9D83, // Verde Japandi
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
      sphere: generateSphere(particleCount),
      tesseract: generateTesseract(particleCount),
      tesseract2: generateTesseract2(particleCount),
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
      const { sphere, tesseract, tesseract2 } = geometriesRef.current;
      const currentScrollProgress = scrollProgressRef.current;

      if (currentScrollProgress < 0.33) {
        // Transición de Esfera a Teseracto
        const alpha = currentScrollProgress / 0.33;
        currentPositions = interpolateGeometries(sphere, tesseract, alpha);
      } else if (currentScrollProgress < 0.66) {
        // Transición de Teseracto a Teseracto 2
        const alpha = (currentScrollProgress - 0.33) / 0.33;
        currentPositions = interpolateGeometries(tesseract, tesseract2, alpha);
      } else {
        // Mantener Teseracto 2 con pequeña variación
        const alpha = Math.min((currentScrollProgress - 0.66) / 0.34, 1);
        currentPositions = tesseract2;

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
