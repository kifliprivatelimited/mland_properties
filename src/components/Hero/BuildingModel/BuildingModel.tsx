import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BuildingModelProps {
  groupRef: React.RefObject<THREE.Group | null>;
  progressRef: React.RefObject<number>;
}

export default function BuildingModel({ groupRef, progressRef }: BuildingModelProps) {
  const innerRef = useRef<THREE.Group>(null);

  // Group refs for individual animated structural sections
  const roofRef = useRef<THREE.Group>(null);
  const slabUpperRef = useRef<THREE.Group>(null);
  const slabGroundRef = useRef<THREE.Group>(null);
  const foundationRef = useRef<THREE.Group>(null);
  const columnsRef = useRef<THREE.Group>(null);
  const glazingFrontRef = useRef<THREE.Group>(null);
  const glazingSideRef = useRef<THREE.Group>(null);
  const finsRef = useRef<THREE.Group>(null);
  const wallRightRef = useRef<THREE.Group>(null);
  const wallBackRef = useRef<THREE.Group>(null);
  const interiorRef = useRef<THREE.Group>(null);
  const terraceRef = useRef<THREE.Group>(null);

  // Materials definition
  const mats = useMemo(() => {
    return {
      concrete: new THREE.MeshStandardMaterial({
        color: '#D8D1C7',
        roughness: 0.85,
        metalness: 0.05,
      }),
      concreteDark: new THREE.MeshStandardMaterial({
        color: '#BBB1A5',
        roughness: 0.9,
        metalness: 0.05,
      }),
      limestone: new THREE.MeshStandardMaterial({
        color: '#E8E1D5',
        roughness: 0.75,
        metalness: 0.02,
      }),
      travertine: new THREE.MeshStandardMaterial({
        color: '#DED5C8',
        roughness: 0.8,
        metalness: 0.04,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#9BB4C4',
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.7,
        transparent: true,
        opacity: 0.45,
        ior: 1.5,
      }),
      glassBalustrade: new THREE.MeshPhysicalMaterial({
        color: '#A8BDCA',
        roughness: 0.08,
        transmission: 0.8,
        transparent: true,
        opacity: 0.35,
        ior: 1.45,
      }),
      bronze: new THREE.MeshStandardMaterial({
        color: '#A9825D',
        roughness: 0.35,
        metalness: 0.8,
      }),
      brassDark: new THREE.MeshStandardMaterial({
        color: '#6E563F',
        roughness: 0.4,
        metalness: 0.75,
      }),
      oak: new THREE.MeshStandardMaterial({
        color: '#8C7253',
        roughness: 0.7,
        metalness: 0.05,
      }),
      foundation: new THREE.MeshStandardMaterial({
        color: '#8A827A',
        roughness: 0.95,
        metalness: 0.02,
      }),
      interiorWall: new THREE.MeshStandardMaterial({
        color: '#C6BCAD',
        roughness: 0.8,
        metalness: 0.05,
      }),
      water: new THREE.MeshPhysicalMaterial({
        color: '#6E8B99',
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.85,
        transparent: true,
        opacity: 0.65,
        ior: 1.33,
      }),
    };
  }, []);

  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      Object.values(mats).forEach((m) => m.dispose());
    };
  }, [mats]);

  // Frame update: update structural explosion separation and blueprint wireframe transitions
  useFrame(() => {
    const p = progressRef.current ?? 0;

    // Calculate Explode Factor:
    // Ramps up smoothly during 0.48 -> 0.68, holds 0.68 -> 0.78, reassembles 0.78 -> 0.90
    let explodeFactor = 0;
    if (p >= 0.48 && p <= 0.68) {
      const t = (p - 0.48) / 0.2;
      // smoothstep ease
      explodeFactor = t * t * (3 - 2 * t);
    } else if (p > 0.68 && p <= 0.78) {
      explodeFactor = 1;
    } else if (p > 0.78 && p <= 0.90) {
      const t = (p - 0.78) / 0.12;
      explodeFactor = 1 - t * t * (3 - 2 * t);
    } else {
      explodeFactor = 0;
    }

    // Calculate Blueprint Wireframe Factor:
    // Peaks during 0.66 -> 0.84
    let blueprintFactor = 0;
    if (p >= 0.64 && p <= 0.74) {
      blueprintFactor = (p - 0.64) / 0.1;
    } else if (p > 0.74 && p <= 0.80) {
      blueprintFactor = 1;
    } else if (p > 0.80 && p <= 0.88) {
      blueprintFactor = 1 - (p - 0.8) / 0.08;
    }

    // Apply smooth coordinate separation along structural axes
    if (roofRef.current) {
      roofRef.current.position.y = 2.8 * explodeFactor;
    }
    if (slabUpperRef.current) {
      slabUpperRef.current.position.y = 1.3 * explodeFactor;
    }
    if (foundationRef.current) {
      foundationRef.current.position.y = -1.6 * explodeFactor;
    }
    if (slabGroundRef.current) {
      slabGroundRef.current.position.y = -0.5 * explodeFactor;
    }
    if (terraceRef.current) {
      terraceRef.current.position.y = -0.8 * explodeFactor;
      terraceRef.current.position.z = 0.6 * explodeFactor;
    }
    if (glazingFrontRef.current) {
      glazingFrontRef.current.position.z = 2.2 * explodeFactor;
    }
    if (finsRef.current) {
      finsRef.current.position.z = 3.0 * explodeFactor;
    }
    if (glazingSideRef.current) {
      glazingSideRef.current.position.x = -1.8 * explodeFactor;
    }
    if (wallRightRef.current) {
      wallRightRef.current.position.x = 2.0 * explodeFactor;
    }
    if (wallBackRef.current) {
      wallBackRef.current.position.z = -2.0 * explodeFactor;
    }
    if (interiorRef.current) {
      interiorRef.current.position.y = -0.4 * explodeFactor;
    }
    if (columnsRef.current) {
      columnsRef.current.position.y = 0.2 * explodeFactor;
    }

    // Dynamic material wireframe and opacity modulation
    const isWireframeActive = blueprintFactor > 0.35;
    const wireOpacity = 1 - blueprintFactor * 0.65;

    // Apply to standard solid materials
    [mats.concrete, mats.concreteDark, mats.limestone, mats.travertine, mats.foundation].forEach((mat) => {
      mat.wireframe = isWireframeActive;
      mat.transparent = blueprintFactor > 0.05;
      mat.opacity = THREE.MathUtils.lerp(1.0, 0.45, blueprintFactor);
    });

    [mats.bronze, mats.brassDark, mats.oak, mats.interiorWall].forEach((mat) => {
      mat.wireframe = isWireframeActive;
      mat.transparent = blueprintFactor > 0.05;
      mat.opacity = THREE.MathUtils.lerp(1.0, 0.4, blueprintFactor);
    });

    [mats.glass, mats.glassBalustrade].forEach((mat) => {
      mat.opacity = THREE.MathUtils.lerp(0.45, 0.2, blueprintFactor);
    });
  });

  // Architectural Villa Dimensions
  const W = 5.6;     // Villa width
  const D = 4.8;     // Villa depth
  const H_SLAB = 0.22;
  const COL_W = 0.16;

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      <group ref={innerRef}>
        {/* ── Foundation & Podium ── */}
        <group ref={foundationRef} name="foundation">
          {/* Main foundation plinth */}
          <mesh position={[0, -0.2, 0]} material={mats.foundation} receiveShadow>
            <boxGeometry args={[W + 1.6, 0.35, D + 1.8]} />
          </mesh>
          {/* Recessed travertine podium reveal */}
          <mesh position={[0, 0.05, 0]} material={mats.travertine} receiveShadow>
            <boxGeometry args={[W + 0.8, 0.15, D + 1.0]} />
          </mesh>
        </group>

        {/* ── Travertine Terrace & Reflecting Water Feature ── */}
        <group ref={terraceRef} name="terrace">
          {/* Front terrace deck */}
          <mesh position={[0.4, 0.16, D / 2 + 0.7]} material={mats.travertine} receiveShadow>
            <boxGeometry args={[W + 0.4, 0.12, 1.4]} />
          </mesh>
          {/* Reflecting pool border & water */}
          <mesh position={[-1.2, 0.14, D / 2 + 0.7]} material={mats.concreteDark}>
            <boxGeometry args={[2.0, 0.1, 1.1]} />
          </mesh>
          <mesh position={[-1.2, 0.2, D / 2 + 0.7]} material={mats.water}>
            <boxGeometry args={[1.8, 0.04, 0.9]} />
          </mesh>
          {/* Low stone landscape wall */}
          <mesh position={[W / 2 + 0.25, 0.4, D / 2 + 0.6]} material={mats.limestone} castShadow>
            <boxGeometry args={[0.2, 0.6, 1.2]} />
          </mesh>
        </group>

        {/* ── Ground Floor Slab ── */}
        <group ref={slabGroundRef} name="slab-ground">
          <mesh position={[0, 0.25, 0]} material={mats.concrete} receiveShadow>
            <boxGeometry args={[W, H_SLAB, D]} />
          </mesh>
        </group>

        {/* ── Upper Floor Slab & Balcony ── */}
        <group ref={slabUpperRef} name="slab-upper">
          {/* First floor slab with front cantilever */}
          <mesh position={[0, 2.15, 0.15]} material={mats.concrete} castShadow receiveShadow>
            <boxGeometry args={[W + 0.4, H_SLAB, D + 0.3]} />
          </mesh>
          {/* Warm oak wood soffit under the cantilevered terrace */}
          <mesh position={[0, 2.02, D / 2 + 0.15]} material={mats.oak}>
            <boxGeometry args={[W + 0.35, 0.03, 0.55]} />
          </mesh>
          {/* Second floor / roof terrace slab */}
          <mesh position={[0.2, 4.05, 0]} material={mats.concrete} castShadow receiveShadow>
            <boxGeometry args={[W, H_SLAB, D]} />
          </mesh>
        </group>

        {/* ── Roof Structure & Parapet ── */}
        <group ref={roofRef} name="roof">
          {/* Floating thin concrete roof canopy with expansive overhang */}
          <mesh position={[0, 5.65, 0.1]} material={mats.limestone} castShadow receiveShadow>
            <boxGeometry args={[W + 1.2, 0.18, D + 0.9]} />
          </mesh>
          {/* Underside warm wood soffit */}
          <mesh position={[0, 5.54, 0.1]} material={mats.oak}>
            <boxGeometry args={[W + 1.15, 0.02, D + 0.85]} />
          </mesh>
          {/* Parapet detail */}
          <mesh position={[0, 5.82, D / 2 + 0.5]} material={mats.bronze}>
            <boxGeometry args={[W + 1.2, 0.16, 0.05]} />
          </mesh>
          <mesh position={[0, 5.82, -(D / 2 + 0.3)]} material={mats.bronze}>
            <boxGeometry args={[W + 1.2, 0.16, 0.05]} />
          </mesh>
        </group>

        {/* ── Structural Concrete Columns ── */}
        <group ref={columnsRef} name="columns">
          {/* Front load-bearing architectural columns */}
          {[-2.2, -0.8, 0.9, 2.2].map((x, i) => (
            <mesh key={`col-f-${i}`} position={[x, 2.9, D / 2 - 0.15]} material={mats.concrete} castShadow>
              <boxGeometry args={[COL_W, 5.2, COL_W]} />
            </mesh>
          ))}
          {/* Back columns */}
          {[-2.2, -0.8, 0.9, 2.2].map((x, i) => (
            <mesh key={`col-b-${i}`} position={[x, 2.9, -(D / 2 - 0.15)]} material={mats.concrete} castShadow>
              <boxGeometry args={[COL_W, 5.2, COL_W]} />
            </mesh>
          ))}
        </group>

        {/* ── Glass Facades & Openings ── */}
        <group ref={glazingFrontRef} name="glazing-front">
          {/* Ground floor panoramic glass panels */}
          <mesh position={[-1.5, 1.2, D / 2 + 0.02]} material={mats.glass}>
            <boxGeometry args={[1.3, 1.68, 0.04]} />
          </mesh>
          {/* Entrance pivot door opening (clear passage) */}
          <mesh position={[-0.2, 1.2, D / 2 + 0.02]} material={mats.glass}>
            <boxGeometry args={[1.1, 1.68, 0.04]} />
          </mesh>
          <mesh position={[1.4, 1.2, D / 2 + 0.02]} material={mats.glass}>
            <boxGeometry args={[1.9, 1.68, 0.04]} />
          </mesh>

          {/* Entrance brass portal frame */}
          <mesh position={[-0.8, 1.2, D / 2 + 0.05]} material={mats.bronze}>
            <boxGeometry args={[0.06, 1.75, 0.12]} />
          </mesh>
          <mesh position={[0.4, 1.2, D / 2 + 0.05]} material={mats.bronze}>
            <boxGeometry args={[0.06, 1.75, 0.12]} />
          </mesh>
          <mesh position={[-0.2, 2.06, D / 2 + 0.05]} material={mats.bronze}>
            <boxGeometry args={[1.26, 0.06, 0.12]} />
          </mesh>

          {/* First floor bedroom & gallery glass */}
          <mesh position={[-1.4, 3.1, D / 2 + 0.02]} material={mats.glass}>
            <boxGeometry args={[1.4, 1.68, 0.04]} />
          </mesh>
          <mesh position={[0.3, 3.1, D / 2 + 0.02]} material={mats.glass}>
            <boxGeometry args={[1.8, 1.68, 0.04]} />
          </mesh>
          <mesh position={[1.8, 3.1, D / 2 + 0.02]} material={mats.glass}>
            <boxGeometry args={[1.1, 1.68, 0.04]} />
          </mesh>

          {/* Second floor penthouse studio glass */}
          <mesh position={[0, 4.85, D / 2 - 0.1]} material={mats.glass}>
            <boxGeometry args={[W - 0.4, 1.4, 0.04]} />
          </mesh>

          {/* Cantilever balcony glass balustrade */}
          <mesh position={[0, 2.55, D / 2 + 0.28]} material={mats.glassBalustrade}>
            <boxGeometry args={[W + 0.3, 0.7, 0.03]} />
          </mesh>
          {/* Balcony bronze handrail */}
          <mesh position={[0, 2.92, D / 2 + 0.28]} material={mats.bronze}>
            <boxGeometry args={[W + 0.32, 0.04, 0.05]} />
          </mesh>
        </group>

        {/* ── Side Glazing ── */}
        <group ref={glazingSideRef} name="glazing-side">
          {/* Left side glass facade panels */}
          <mesh position={[-W / 2 - 0.02, 1.2, 0.2]} material={mats.glass}>
            <boxGeometry args={[0.04, 1.68, D - 1.2]} />
          </mesh>
          <mesh position={[-W / 2 - 0.02, 3.1, 0.2]} material={mats.glass}>
            <boxGeometry args={[0.04, 1.68, D - 1.2]} />
          </mesh>
          <mesh position={[-W / 2 - 0.02, 4.85, 0.0]} material={mats.glass}>
            <boxGeometry args={[0.04, 1.4, D - 1.6]} />
          </mesh>
        </group>

        {/* ── Bronze Solar Fins / Louvers ── */}
        <group ref={finsRef} name="fins">
          {Array.from({ length: 9 }, (_, i) => {
            const x = -2.1 + (i * 4.2) / 8;
            return (
              <mesh
                key={`fin-${i}`}
                position={[x, 3.1, D / 2 + 0.12]}
                material={mats.bronze}
                castShadow
              >
                <boxGeometry args={[0.05, 1.68, 0.12]} />
              </mesh>
            );
          })}
        </group>

        {/* ── Solid Pale Stone & Concrete Walls ── */}
        <group ref={wallRightRef} name="wall-right">
          {/* Solid right side travertine volumetric mass */}
          <mesh position={[W / 2, 2.95, 0]} material={mats.limestone} castShadow receiveShadow>
            <boxGeometry args={[0.18, 5.2, D]} />
          </mesh>
          {/* Bronze horizontal shadow reveal line */}
          <mesh position={[W / 2 + 0.01, 2.26, 0]} material={mats.bronze}>
            <boxGeometry args={[0.2, 0.04, D + 0.02]} />
          </mesh>
        </group>

        <group ref={wallBackRef} name="wall-back">
          {/* Back wall enclosure with pale limestone */}
          <mesh position={[0, 2.95, -(D / 2)]} material={mats.limestone} castShadow receiveShadow>
            <boxGeometry args={[W, 5.2, 0.18]} />
          </mesh>
        </group>

        {/* ── Luxury Interior Space ── */}
        <group ref={interiorRef} name="interior">
          {/* Ground floor: Monolithic oak kitchen island & counter */}
          <mesh position={[-0.3, 0.72, 0.2]} material={mats.oak} castShadow>
            <boxGeometry args={[1.5, 0.72, 0.7]} />
          </mesh>
          {/* Stone countertop top detail */}
          <mesh position={[-0.3, 1.09, 0.2]} material={mats.travertine}>
            <boxGeometry args={[1.54, 0.04, 0.74]} />
          </mesh>

          {/* Architectural divider wall */}
          <mesh position={[1.0, 1.2, -0.6]} material={mats.interiorWall}>
            <boxGeometry args={[0.08, 1.68, 2.2]} />
          </mesh>
          <mesh position={[1.0, 1.2, 0.52]} material={mats.bronze}>
            <boxGeometry args={[0.1, 1.68, 0.05]} />
          </mesh>

          {/* Floating minimalist open-riser stairs */}
          {Array.from({ length: 7 }, (_, i) => (
            <mesh
              key={`stair-${i}`}
              position={[1.6, 0.45 + i * 0.24, -1.2 + i * 0.32]}
              material={mats.oak}
              castShadow
            >
              <boxGeometry args={[0.9, 0.06, 0.28]} />
            </mesh>
          ))}

          {/* First floor: Master suite oak wardrobe volume */}
          <mesh position={[-0.8, 3.0, -0.8]} material={mats.oak} castShadow>
            <boxGeometry args={[1.8, 1.5, 0.6]} />
          </mesh>

          {/* Warm interior golden lights */}
          <pointLight position={[-0.3, 1.8, 0.2]} intensity={2.0} color="#FFE4B5" distance={6} />
          <pointLight position={[1.2, 3.6, 0.0]} intensity={1.8} color="#FFDCA8" distance={5} />
        </group>
      </group>
    </group>
  );
}
