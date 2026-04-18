"use client";

import { useInterfaceStore } from "@/hooks/useStore";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import * as THREE from "three";

function FluxObject() {
  const outerMesh = useRef<Mesh>(null);
  const ringMesh = useRef<Mesh>(null);
  const cursor = useInterfaceStore((state) => state.cursor);
  const motionEnabled = useInterfaceStore((state) => state.motionEnabled);
  const neonBoost = useInterfaceStore((state) => state.neonBoost);
  const glowLevel = useInterfaceStore((state) => state.glowLevel);

  useFrame((_, delta) => {
    const speed = motionEnabled ? 1 : 0.28;

    if (outerMesh.current) {
      // Blend autonomous spin with cursor-driven offsets for subtle depth response.
      outerMesh.current.rotation.y += delta * 0.36 * speed;
      outerMesh.current.rotation.x = THREE.MathUtils.lerp(
        outerMesh.current.rotation.x,
        cursor.y * 0.45,
        0.08
      );
      outerMesh.current.position.x = THREE.MathUtils.lerp(
        outerMesh.current.position.x,
        cursor.x * 0.24,
        0.06
      );
      outerMesh.current.position.y = THREE.MathUtils.lerp(
        outerMesh.current.position.y,
        cursor.y * 0.18,
        0.06
      );
    }

    if (ringMesh.current) {
      ringMesh.current.rotation.z -= delta * 0.42 * speed;
      ringMesh.current.rotation.y = THREE.MathUtils.lerp(
        ringMesh.current.rotation.y,
        cursor.x * 0.4,
        0.08
      );
    }
  });

  return (
    <group>
      <mesh ref={outerMesh} castShadow>
        <icosahedronGeometry args={[1, 64]} />
        <MeshDistortMaterial
          speed={motionEnabled ? 1.4 : 0.2}
          distort={motionEnabled ? 0.24 : 0.05}
          roughness={0.22}
          metalness={0.66}
          color="#6af6d2"
          emissive="#53ffd9"
          emissiveIntensity={(neonBoost ? 0.72 : 0.36) * glowLevel}
        />
      </mesh>

      <mesh ref={ringMesh} scale={1.24} rotation={[0.55, 0, 0]}>
        <torusGeometry args={[1.18, 0.035, 32, 250]} />
        <meshStandardMaterial
          color="#a97cff"
          emissive="#8e58ff"
          emissiveIntensity={(neonBoost ? 1.25 : 0.75) * glowLevel}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

export default function OrbitalCore() {
  const motionEnabled = useInterfaceStore((state) => state.motionEnabled);

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 3.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.45} />
      <pointLight position={[2.8, 1.8, 2]} intensity={2.1} color="#59ffd8" />
      <pointLight position={[-2.8, -1.6, -2.2]} intensity={1.2} color="#9f7dff" />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#7ad4ff" />

      <Float
        speed={motionEnabled ? 1.5 : 0.3}
        rotationIntensity={motionEnabled ? 0.35 : 0.12}
        floatIntensity={motionEnabled ? 0.45 : 0.12}
      >
        <FluxObject />
      </Float>

      <Sparkles count={34} scale={4.4} size={2} speed={motionEnabled ? 0.52 : 0.12} />
    </Canvas>
  );
}
