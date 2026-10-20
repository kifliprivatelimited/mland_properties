import { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BuildingModel, { BUILDING_GROUPS } from './BuildingModel/BuildingModel';
import TechnicalElevation from './TechnicalElevation/TechnicalElevation';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

function HeroScene({ buildingRef }: { buildingRef: React.RefObject<THREE.Group | null> }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 8, -4]} intensity={0.4} color="#E8DDD0" />
      <pointLight position={[0, 2, 5]} intensity={0.3} color="#FFE4C4" />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.65, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#3A3632" roughness={0.95} metalness={0.05} />
      </mesh>

      <Suspense fallback={null}>
        <BuildingModel groupRef={buildingRef} />
      </Suspense>
    </>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const buildingRef = useRef<THREE.Group>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [elevationOpacity, setElevationOpacity] = useState(0);
  const [transitionOpacity, setTransitionOpacity] = useState(0);
  const [webGLFailed, setWebGLFailed] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setWebGLFailed(true);
    } catch {
      setWebGLFailed(true);
    }
  }, []);

  // Check reduced motion
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Store original positions for each building part
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const hasStoredPositions = useRef(false);

  const storeOriginalPositions = useCallback(() => {
    if (!buildingRef.current || hasStoredPositions.current) return;
    buildingRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name) {
        originalPositions.current.set(child.name, child.position.clone());
      }
    });
    hasStoredPositions.current = true;
  }, []);

  useEffect(() => {
    if (webGLFailed || prefersReducedMotion) return;

    // Small delay to ensure the building is rendered
    const initTimeout = setTimeout(() => {
      storeOriginalPositions();
      if (!buildingRef.current || !heroRef.current) return;

      // Create GSAP ScrollTrigger timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=4000',
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            // Explode animation: 0-0.5
            // Technical elevation: 0.5-0.85
            // Exit: 0.85-1.0
            const explodeProgress = Math.min(progress / 0.5, 1);
            const elevationProgress = Math.max(0, Math.min((progress - 0.4) / 0.3, 1));

            // Animate building parts
            if (buildingRef.current) {
              buildingRef.current.traverse((child) => {
                if (!(child instanceof THREE.Mesh) || !child.name) return;
                const orig = originalPositions.current.get(child.name);
                if (!orig) return;

                // Find which group this part belongs to
                for (const group of Object.values(BUILDING_GROUPS)) {
                  if (group.names.includes(child.name)) {
                    const ease = gsap.parseEase('power2.inOut');
                    const easedProgress = ease(explodeProgress);
                    child.position.set(
                      orig.x + group.direction[0] * group.distance * easedProgress,
                      orig.y + group.direction[1] * group.distance * easedProgress,
                      orig.z + group.direction[2] * group.distance * easedProgress
                    );
                    break;
                  }
                }
              });
            }

            // Technical elevation overlay
            setElevationOpacity(elevationProgress);

            // Ivory transition overlay as we approach the end of the hero pin
            const transProgress = Math.max(0, Math.min((progress - 0.86) / 0.14, 1));
            setTransitionOpacity(transProgress);

            // Wireframe mode as elevation comes in
            if (buildingRef.current) {
              buildingRef.current.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material) {
                  const mat = child.material as THREE.MeshStandardMaterial;
                  if (mat.wireframe !== undefined) {
                    mat.wireframe = elevationProgress > 0.5;
                    mat.opacity = elevationProgress > 0.5
                      ? 0.3 + (1 - elevationProgress) * 0.7
                      : 1;
                    mat.transparent = true;
                  }
                }
              });
            }
          },
        },
      });

      // Hide scroll indicator on scroll
      tl.to(scrollIndicatorRef.current, {
        opacity: 0,
        duration: 0.1,
      }, 0);

      timelineRef.current = tl;
    }, 500);

    return () => {
      clearTimeout(initTimeout);
      if (timelineRef.current) {
        timelineRef.current.scrollTrigger?.kill();
        timelineRef.current.kill();
      }
    };
  }, [webGLFailed, prefersReducedMotion, storeOriginalPositions]);

  // Cleanup ScrollTrigger on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section id="hero-section" className="hero" ref={heroRef}>
      <div className="hero__canvas-wrap" ref={canvasWrapRef}>
        {!webGLFailed ? (
          <>
            <Canvas
              camera={{
                position: [7, 4, 8],
                fov: 45,
                near: 0.1,
                far: 100,
              }}
              shadows
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.1,
              }}
              style={{ background: '#211F1D' }}
            >
              <HeroScene buildingRef={buildingRef} />
              <Environment preset="city" environmentIntensity={0.3} />
            </Canvas>
            <TechnicalElevation opacity={elevationOpacity} />
            <div
              className="hero__transition-overlay"
              style={{ opacity: transitionOpacity }}
              aria-hidden="true"
            />
          </>
        ) : (
          <div className="hero__fallback">
            <div className="hero__fallback-content">
              <h2 className="hero__fallback-title">MLAND PROPERTIES</h2>
              <p className="hero__fallback-subtitle">DESIGN · ARCHITECTURE · CONSTRUCTION</p>
              <p className="hero__fallback-desc">
                Contemporary architecture, precision construction, and refined interiors — delivered by a single integrated team.
              </p>
            </div>
          </div>
        )}

        {/* Scroll indicator */}
        <div className="hero__scroll-indicator" ref={scrollIndicatorRef}>
          <span className="hero__scroll-text">SCROLL TO ENTER</span>
          <div className="hero__scroll-line" />
        </div>
      </div>
    </section>
  );
}
