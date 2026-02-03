import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import dragonPointsRaw from '../data/dragon_points.json';

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
    dragon: Float32Array;
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

  // Generar geometría de Dragón (Logo)
  const generateDragon = (particleCount: number): Float32Array => {
    const positions = new Float32Array(particleCount * 3);
    const dragonPoints = dragonPointsRaw as number[];
    const dragonPointCount = dragonPoints.length / 3;

    for (let i = 0; i < particleCount; i++) {
        // Usar módulo para repetir los puntos del dragón y cubrir todas las partículas
        const index = i % dragonPointCount;
        
        // Coordenadas base del logo
        // Escalar el logo (x1.8) según petición del usuario
        const scale = 1.8;
        const x = dragonPoints[index * 3] * scale;
        const y = dragonPoints[index * 3 + 1] * scale;
        const z = dragonPoints[index * 3 + 2] * scale; // Z es 0

        // Añadir pequeño "spread" en X e Y para rellenar huecos
        // Usamos los duplicados para crear densidad en lugar de superponerlos
        const spread = 0.04; 
        const jitterX = (Math.random() - 0.5) * spread;
        const jitterY = (Math.random() - 0.5) * spread;

        positions[i * 3] = x + jitterX;
        positions[i * 3 + 1] = y + jitterY;
        positions[i * 3 + 2] = z; // Mantener Z plano para el look 2D
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
    const particleCount = 40000;
    const geometry = new THREE.BufferGeometry();
    const positions = generateSphere(particleCount);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x8B9D83, // Verde Japandi
      size: 0.025,
      transparent: true,
      opacity: 0.7,
      blending: THREE.NormalBlending, // Changed from Additive to prevent whiteout
      depthWrite: false, // Ensure transparent sorting works better (though points aren't sorted, this avoids some issues)
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    // Disable frustum culling to prevent disappearance when shape changes drastically
    particles.frustumCulled = false;
    scene.add(particles);
    particlesRef.current = particles;

    // Generar y almacenar todas las geometrías
    geometriesRef.current = {
      sphere: generateSphere(particleCount),
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

      let currentPositions: Float32Array;
      const { sphere, tesseract, dragon } = geometriesRef.current;
      const currentScrollProgress = scrollProgressRef.current;

      if (currentScrollProgress < 0.33) {
        // Transición de Esfera a Teseracto
        const alpha = currentScrollProgress / 0.33;
        currentPositions = interpolateGeometries(sphere, tesseract, alpha);
        
        // Rotación continua
        particles.rotation.y += 0.001 + Math.abs(mouseVelocityRef.current.x) * 0.01;
        particles.rotation.x += Math.sin(Date.now() * 0.0002) * 0.001 + Math.abs(mouseVelocityRef.current.y) * 0.01;

      } else if (currentScrollProgress < 0.66) {
        // Transición de Teseracto a Dragón
        const alpha = (currentScrollProgress - 0.33) / 0.33;
        currentPositions = interpolateGeometries(tesseract, dragon, alpha);
        
        // Desacelerar rotación mientras nos acercamos al dragón
        const rotationFactor = 1 - alpha;
        particles.rotation.y += (0.001 + Math.abs(mouseVelocityRef.current.x) * 0.01) * rotationFactor;
        particles.rotation.x += (Math.sin(Date.now() * 0.0002) * 0.001 + Math.abs(mouseVelocityRef.current.y) * 0.01) * rotationFactor;
        
        // Interpolar hacia rotación 0 (frente)
        particles.rotation.x *= (1 - alpha * 0.1); 
        particles.rotation.y *= (1 - alpha * 0.1);

      } else {
        // Mantener Dragón TOTALMENTE ESTÁTICO
        const alpha = Math.min((currentScrollProgress - 0.66) / 0.34, 1);
        currentPositions = dragon;

      	// Interpolación de color
        const baseColor = new THREE.Color(0x8B9D83); // Verde original
        const dragonColor = new THREE.Color(0x598d71); // Nuevo color del dragón

        let currentColor = baseColor;

        if (currentScrollProgress > 0.33 && currentScrollProgress < 0.66) {
           // Transición de color durante Tesseract -> Dragon
           const alpha = (currentScrollProgress - 0.33) / 0.33;
           currentColor = baseColor.clone().lerp(dragonColor, alpha);
        } else if (currentScrollProgress >= 0.66) {
           // Color final del dragón
           currentColor = dragonColor;
        }
        
        particles.material.color = currentColor;

        // Mantener opacidad constante (sin brillo extra)
        particles.material.opacity = 0.7;
        
        // Forzar posición y rotación estática exacta
        particles.rotation.set(0, 0, 0);
      }

      // Actualizar posiciones de partículas
      const positionAttribute = particles.geometry.getAttribute('position');
      for (let i = 0; i < currentPositions.length; i++) {
        positionAttribute.array[i] = currentPositions[i];
      }
      positionAttribute.needsUpdate = true;

      // Manejo de rotación (RESTITUIDO)
      // Solo rotamos si NO estamos en la fase final del dragón
      if (currentScrollProgress < 0.66) {
          // Rotación normal
          let rotationSpeedY = 0.001 + Math.abs(mouseVelocityRef.current.x) * 0.01;
          let rotationSpeedX = Math.sin(Date.now() * 0.0002) * 0.001 + Math.abs(mouseVelocityRef.current.y) * 0.01;
          
          // Desaceleración en transición hacia dragón
          if (currentScrollProgress > 0.33) {
             const alpha = (currentScrollProgress - 0.33) / 0.33;
             // Cuando nos acercamos al dragón, reducimos la velocidad de rotación
             const rotationFactor = Math.max(0, 1 - alpha);
             rotationSpeedX *= rotationFactor;
             rotationSpeedY *= rotationFactor;
             
             // Desvanecer rotación acumulada hacia 0 para que llegue "derecho"
             particles.rotation.x *= (1 - alpha * 0.1);
             particles.rotation.y *= (1 - alpha * 0.1);
          }
          
          particles.rotation.y += rotationSpeedY;
          particles.rotation.x += rotationSpeedX;
      }

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
