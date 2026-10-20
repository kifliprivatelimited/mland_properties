import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Material definitions
function useBuildingMaterials() {
  return useMemo(() => ({
    concrete: new THREE.MeshStandardMaterial({
      color: '#D4CBC0',
      roughness: 0.85,
      metalness: 0.05,
    }),
    concreteLight: new THREE.MeshStandardMaterial({
      color: '#E0D8CE',
      roughness: 0.8,
      metalness: 0.05,
    }),
    concreteDark: new THREE.MeshStandardMaterial({
      color: '#B8AFA4',
      roughness: 0.9,
      metalness: 0.05,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#88A4B8',
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.4,
      ior: 1.5,
    }),
    bronze: new THREE.MeshStandardMaterial({
      color: '#A9825D',
      roughness: 0.4,
      metalness: 0.7,
    }),
    oak: new THREE.MeshStandardMaterial({
      color: '#8B7355',
      roughness: 0.7,
      metalness: 0.1,
    }),
    foundation: new THREE.MeshStandardMaterial({
      color: '#9A9189',
      roughness: 0.95,
      metalness: 0.02,
    }),
    interior: new THREE.MeshStandardMaterial({
      color: '#C4B9AA',
      roughness: 0.8,
      metalness: 0.05,
    }),
  }), []);
}

interface BuildingPartProps {
  position: [number, number, number];
  args: [number, number, number];
  material: THREE.Material;
  name: string;
}

function BuildingPart({ position, args, material, name }: BuildingPartProps) {
  return (
    <mesh position={position} material={material} name={name} castShadow receiveShadow>
      <boxGeometry args={args} />
    </mesh>
  );
}

export interface BuildingGroupRef {
  group: THREE.Group;
  parts: Record<string, THREE.Object3D>;
}

interface BuildingModelProps {
  groupRef: React.RefObject<THREE.Group | null>;
}

export default function BuildingModel({ groupRef }: BuildingModelProps) {
  const innerRef = useRef<THREE.Group>(null);
  const mats = useBuildingMaterials();

  // Subtle idle rotation
  useFrame((state) => {
    if (innerRef.current) {
      innerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.04;
    }
  });

  const W = 5;    // building width
  const D = 4.5;  // building depth
  const H = 0.2;  // slab thickness
  const COL_W = 0.15;
  const FIN_W = 0.06;

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      <group ref={innerRef}>
        {/* ── Foundation ── */}
        <group name="foundation">
          <BuildingPart
            name="foundation-base"
            position={[0, -0.15, 0]}
            args={[W + 1, 0.3, D + 1]}
            material={mats.foundation}
          />
          <BuildingPart
            name="foundation-step"
            position={[0, 0.05, 0]}
            args={[W + 0.4, 0.1, D + 0.4]}
            material={mats.concreteDark}
          />
        </group>

        {/* ── Floor Slabs ── */}
        <group name="slabs">
          <BuildingPart name="slab-ground" position={[0, 0.2, 0]} args={[W, H, D]} material={mats.concrete} />
          <BuildingPart name="slab-first" position={[0, 1.7, 0]} args={[W, H, D]} material={mats.concrete} />
          <BuildingPart name="slab-second" position={[0, 3.2, 0]} args={[W, H, D]} material={mats.concrete} />
        </group>

        {/* ── Roof ── */}
        <group name="roof">
          <BuildingPart
            name="roof-slab"
            position={[0, 4.7, 0]}
            args={[W + 0.5, H, D + 0.3]}
            material={mats.concreteLight}
          />
          <BuildingPart
            name="roof-parapet-front"
            position={[0, 4.9, D / 2 + 0.1]}
            args={[W + 0.5, 0.2, 0.08]}
            material={mats.concreteLight}
          />
          <BuildingPart
            name="roof-parapet-back"
            position={[0, 4.9, -(D / 2 + 0.1)]}
            args={[W + 0.5, 0.2, 0.08]}
            material={mats.concreteLight}
          />
        </group>

        {/* ── Columns ── */}
        <group name="columns">
          {/* Front columns */}
          {[-2, -0.8, 0.8, 2].map((x, i) => (
            <BuildingPart
              key={`col-front-${i}`}
              name={`col-front-${i}`}
              position={[x, 2.45, D / 2 - 0.1]}
              args={[COL_W, 4.3, COL_W]}
              material={mats.concrete}
            />
          ))}
          {/* Back columns */}
          {[-2, -0.8, 0.8, 2].map((x, i) => (
            <BuildingPart
              key={`col-back-${i}`}
              name={`col-back-${i}`}
              position={[x, 2.45, -(D / 2 - 0.1)]}
              args={[COL_W, 4.3, COL_W]}
              material={mats.concrete}
            />
          ))}
        </group>

        {/* ── Bronze Fins ── */}
        <group name="fins">
          {Array.from({ length: 8 }, (_, i) => {
            const x = -2 + (i * 4) / 7;
            return (
              <BuildingPart
                key={`fin-${i}`}
                name={`fin-${i}`}
                position={[x, 2.45, D / 2 + 0.08]}
                args={[FIN_W, 4.3, 0.04]}
                material={mats.bronze}
              />
            );
          })}
        </group>

        {/* ── Glass Facade ── */}
        <group name="glazing">
          {/* Front glass panels - ground floor */}
          <BuildingPart
            name="glass-front-g1"
            position={[-1.4, 0.95, D / 2 + 0.02]}
            args={[1.1, 1.3, 0.03]}
            material={mats.glass}
          />
          <BuildingPart
            name="glass-front-g2"
            position={[0, 0.95, D / 2 + 0.02]}
            args={[1.3, 1.3, 0.03]}
            material={mats.glass}
          />
          <BuildingPart
            name="glass-front-g3"
            position={[1.4, 0.95, D / 2 + 0.02]}
            args={[1.1, 1.3, 0.03]}
            material={mats.glass}
          />
          {/* Front glass panels - first floor */}
          <BuildingPart
            name="glass-front-f1"
            position={[-1.4, 2.45, D / 2 + 0.02]}
            args={[1.1, 1.3, 0.03]}
            material={mats.glass}
          />
          <BuildingPart
            name="glass-front-f2"
            position={[0, 2.45, D / 2 + 0.02]}
            args={[1.3, 1.3, 0.03]}
            material={mats.glass}
          />
          <BuildingPart
            name="glass-front-f3"
            position={[1.4, 2.45, D / 2 + 0.02]}
            args={[1.1, 1.3, 0.03]}
            material={mats.glass}
          />
          {/* Front glass panels - second floor */}
          <BuildingPart
            name="glass-front-s1"
            position={[-1.4, 3.95, D / 2 + 0.02]}
            args={[1.1, 1.3, 0.03]}
            material={mats.glass}
          />
          <BuildingPart
            name="glass-front-s2"
            position={[0, 3.95, D / 2 + 0.02]}
            args={[1.3, 1.3, 0.03]}
            material={mats.glass}
          />
          <BuildingPart
            name="glass-front-s3"
            position={[1.4, 3.95, D / 2 + 0.02]}
            args={[1.1, 1.3, 0.03]}
            material={mats.glass}
          />
          {/* Side glass - left */}
          <BuildingPart
            name="glass-left-g"
            position={[-W / 2 - 0.02, 0.95, 0]}
            args={[0.03, 1.3, D - 0.6]}
            material={mats.glass}
          />
          <BuildingPart
            name="glass-left-f"
            position={[-W / 2 - 0.02, 2.45, 0]}
            args={[0.03, 1.3, D - 0.6]}
            material={mats.glass}
          />
          <BuildingPart
            name="glass-left-s"
            position={[-W / 2 - 0.02, 3.95, 0]}
            args={[0.03, 1.3, D - 0.6]}
            material={mats.glass}
          />
        </group>

        {/* ── Facade Walls ── */}
        <group name="facade">
          {/* Back wall */}
          <BuildingPart
            name="wall-back"
            position={[0, 2.45, -(D / 2)]}
            args={[W, 4.3, 0.12]}
            material={mats.concreteLight}
          />
          {/* Right wall */}
          <BuildingPart
            name="wall-right"
            position={[W / 2, 2.45, 0]}
            args={[0.12, 4.3, D]}
            material={mats.concreteLight}
          />
          {/* Left wall panels (between glass) */}
          <BuildingPart
            name="wall-left-top"
            position={[-W / 2, 4.45, 0]}
            args={[0.12, 0.4, D]}
            material={mats.concreteLight}
          />
          <BuildingPart
            name="wall-left-bot"
            position={[-W / 2, 0.25, 0]}
            args={[0.12, 0.12, D]}
            material={mats.concreteLight}
          />
        </group>

        {/* ── Interior Elements ── */}
        <group name="interior">
          <BuildingPart
            name="interior-wall-1"
            position={[0.5, 0.85, -0.5]}
            args={[0.08, 1.1, 2]}
            material={mats.interior}
          />
          <BuildingPart
            name="interior-counter"
            position={[-0.3, 0.55, 0.3]}
            args={[1.2, 0.5, 0.6]}
            material={mats.oak}
          />
          <BuildingPart
            name="interior-island"
            position={[0.8, 0.5, 0.8]}
            args={[0.8, 0.4, 0.5]}
            material={mats.oak}
          />
        </group>

        {/* ── Horizontal Beams ── */}
        <group name="beams">
          {/* Front beams at each level */}
          <BuildingPart
            name="beam-front-g"
            position={[0, 1.6, D / 2 - 0.05]}
            args={[W, 0.1, 0.1]}
            material={mats.concreteDark}
          />
          <BuildingPart
            name="beam-front-f"
            position={[0, 3.1, D / 2 - 0.05]}
            args={[W, 0.1, 0.1]}
            material={mats.concreteDark}
          />
          <BuildingPart
            name="beam-front-s"
            position={[0, 4.6, D / 2 - 0.05]}
            args={[W, 0.1, 0.1]}
            material={mats.concreteDark}
          />
        </group>
      </group>
    </group>
  );
}

// Export the part grouping definitions for the explode animation
export const BUILDING_GROUPS = {
  roof: {
    names: ['roof-slab', 'roof-parapet-front', 'roof-parapet-back'],
    direction: [0, 1, 0] as [number, number, number],
    distance: 3,
  },
  foundation: {
    names: ['foundation-base', 'foundation-step'],
    direction: [0, -1, 0] as [number, number, number],
    distance: 2.5,
  },
  slabSecond: {
    names: ['slab-second'],
    direction: [0, 1, 0] as [number, number, number],
    distance: 1.8,
  },
  slabFirst: {
    names: ['slab-first'],
    direction: [0, 1, 0] as [number, number, number],
    distance: 0.8,
  },
  slabGround: {
    names: ['slab-ground'],
    direction: [0, -1, 0] as [number, number, number],
    distance: 0.5,
  },
  glazing: {
    names: [
      'glass-front-g1', 'glass-front-g2', 'glass-front-g3',
      'glass-front-f1', 'glass-front-f2', 'glass-front-f3',
      'glass-front-s1', 'glass-front-s2', 'glass-front-s3',
    ],
    direction: [0, 0, 1] as [number, number, number],
    distance: 2,
  },
  glazingSide: {
    names: ['glass-left-g', 'glass-left-f', 'glass-left-s'],
    direction: [-1, 0, 0] as [number, number, number],
    distance: 2,
  },
  fins: {
    names: Array.from({ length: 8 }, (_, i) => `fin-${i}`),
    direction: [0, 0, 1] as [number, number, number],
    distance: 3,
  },
  facade: {
    names: ['wall-back'],
    direction: [0, 0, -1] as [number, number, number],
    distance: 2,
  },
  facadeRight: {
    names: ['wall-right'],
    direction: [1, 0, 0] as [number, number, number],
    distance: 2,
  },
  facadeLeft: {
    names: ['wall-left-top', 'wall-left-bot'],
    direction: [-1, 0, 0] as [number, number, number],
    distance: 1.5,
  },
  columns: {
    names: [
      'col-front-0', 'col-front-1', 'col-front-2', 'col-front-3',
      'col-back-0', 'col-back-1', 'col-back-2', 'col-back-3',
    ],
    direction: [0, 0.3, 0] as [number, number, number],
    distance: 0.5,
  },
  beams: {
    names: ['beam-front-g', 'beam-front-f', 'beam-front-s'],
    direction: [0, 0, 1] as [number, number, number],
    distance: 1.5,
  },
  interior: {
    names: ['interior-wall-1', 'interior-counter', 'interior-island'],
    direction: [0, -0.5, 0] as [number, number, number],
    distance: 1,
  },
};
