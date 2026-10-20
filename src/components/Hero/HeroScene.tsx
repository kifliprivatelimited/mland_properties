import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import BuildingModel from './BuildingModel/BuildingModel';

interface HeroSceneProps {
  buildingRef: React.RefObject<THREE.Group | null>;
  progressRef: React.RefObject<number>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
}

interface Keyframe {
  p: number;
  pos: [number, number, number];
  target: [number, number, number];
}

const CAMERA_KEYFRAMES: Keyframe[] = [
  // 1. Initial villa framing (0.00 - 0.14)
  { p: 0.0, pos: [6.8, 3.2, 8.5], target: [0, 1.4, 0] },
  { p: 0.14, pos: [6.5, 3.0, 8.2], target: [0, 1.4, 0] },

  // 2. Building Approach (0.14 - 0.32)
  { p: 0.32, pos: [1.6, 1.45, 3.4], target: [0.2, 1.3, 0] },

  // 3. Interior Glide through opening into living space (0.32 - 0.48)
  { p: 0.48, pos: [0.6, 1.35, 1.4], target: [-0.6, 1.25, -1.0] },

  // 4. Elevated Axonometric View / Exploded (0.48 - 0.68)
  { p: 0.68, pos: [8.2, 6.8, 8.6], target: [0, 1.4, 0] },

  // 5. Blueprint phase (0.68 - 0.82)
  { p: 0.82, pos: [7.8, 6.4, 8.2], target: [0, 1.4, 0] },

  // 6. Brand Reveal & Reassembly (0.82 - 0.94)
  { p: 0.94, pos: [0.0, 2.2, 8.8], target: [0, 1.6, 0] },

  // 7. Handoff to Homepage (0.94 - 1.00)
  { p: 1.00, pos: [0.0, 2.2, 8.8], target: [0, 1.6, 0] },
];

function CameraController({
  progressRef,
  pointerRef,
}: {
  progressRef: React.RefObject<number>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
}) {
  const { camera, size } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 1.4, 0));
  const desiredPos = useRef(new THREE.Vector3(6.8, 3.2, 8.5));
  const desiredTarget = useRef(new THREE.Vector3(0, 1.4, 0));

  useFrame(() => {
    // Responsive portrait framing adjustment
    const aspect = size.width / Math.max(1, size.height);
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = aspect < 1 ? Math.min(58, 40 / Math.max(0.65, aspect)) : 42;
      if (Math.abs(camera.fov - targetFov) > 0.2) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }
    }

    const rawP = progressRef.current ?? 0;
    const p = Math.max(0, Math.min(1, rawP));

    // Find bounding keyframes
    let kfStart = CAMERA_KEYFRAMES[0];
    let kfEnd = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];

    for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
      if (p >= CAMERA_KEYFRAMES[i].p && p <= CAMERA_KEYFRAMES[i + 1].p) {
        kfStart = CAMERA_KEYFRAMES[i];
        kfEnd = CAMERA_KEYFRAMES[i + 1];
        break;
      }
    }

    const span = kfEnd.p - kfStart.p;
    const t = span > 0 ? (p - kfStart.p) / span : 0;
    // Smoothstep cubic easing
    const easeT = t * t * (3 - 2 * t);

    // Interpolate position
    desiredPos.current.set(
      THREE.MathUtils.lerp(kfStart.pos[0], kfEnd.pos[0], easeT),
      THREE.MathUtils.lerp(kfStart.pos[1], kfEnd.pos[1], easeT),
      THREE.MathUtils.lerp(kfStart.pos[2], kfEnd.pos[2], easeT)
    );

    // Interpolate target
    desiredTarget.current.set(
      THREE.MathUtils.lerp(kfStart.target[0], kfEnd.target[0], easeT),
      THREE.MathUtils.lerp(kfStart.target[1], kfEnd.target[1], easeT),
      THREE.MathUtils.lerp(kfStart.target[2], kfEnd.target[2], easeT)
    );

    // Subtle pointer parallax (restrained so building never drifts out of frame)
    const pointer = pointerRef.current || { x: 0, y: 0 };
    const parallaxFactor = p > 0.40 && p < 0.55 ? 0.04 : 0.10;
    desiredPos.current.x += pointer.x * parallaxFactor;
    desiredPos.current.y += pointer.y * (parallaxFactor * 0.6);

    // Smooth camera lerp
    camera.position.lerp(desiredPos.current, 0.08);
    currentTarget.current.lerp(desiredTarget.current, 0.08);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

export default function HeroScene({ buildingRef, progressRef, pointerRef }: HeroSceneProps) {
  return (
    <>
      <CameraController progressRef={progressRef} pointerRef={pointerRef} />

      {/* Warm golden-hour directional lighting */}
      <directionalLight
        position={[10, 14, 7]}
        intensity={1.35}
        color="#FFF2DF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={40}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0001}
      />

      {/* Gentle cool skylight fill */}
      <directionalLight position={[-6, 10, -5]} intensity={0.45} color="#D8E2EC" />

      {/* Warm architectural ground bounce */}
      <hemisphereLight args={['#F5EEE4', '#2C2723', 0.5]} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.85, 0]} receiveShadow>
        <planeGeometry args={[45, 45]} />
        <meshStandardMaterial color="#2B2825" roughness={0.95} metalness={0.03} />
      </mesh>

      <BuildingModel groupRef={buildingRef} progressRef={progressRef} />

      <Environment preset="city" environmentIntensity={0.25} />
    </>
  );
}
