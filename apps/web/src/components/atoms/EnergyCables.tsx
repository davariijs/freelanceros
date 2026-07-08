"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useApp } from "@/context/AppContext";

interface EnergyCablesProps {
  osState: 0 | 1 | 2;
}

export function EnergyCables({ osState }: EnergyCablesProps) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const pulse1Ref = React.useRef<THREE.Mesh>(null);
  const pulse2Ref = React.useRef<THREE.Mesh>(null);

  const leftCurve = React.useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.43, 0.78, -0.15),
      new THREE.Vector3(-0.6, 0.2, -0.3),
      new THREE.Vector3(-0.35, -1.8, -0.4),
    );
  }, []);

  const rightCurve = React.useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0.43, 0.78, -0.15),
      new THREE.Vector3(0.6, 0.2, -0.3),
      new THREE.Vector3(0.35, -1.8, -0.4),
    );
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speedFactor = osState === 2 ? 0.8 : 0.22;
    const t1 = (time * speedFactor) % 1.0;
    const t2 = ((time + 0.7) * speedFactor) % 1.0;

    if (pulse1Ref.current) {
      const pos = leftCurve.getPointAt(t1);
      pulse1Ref.current.position.copy(pos);
    }
    if (pulse2Ref.current) {
      const pos = rightCurve.getPointAt(t2);
      pulse2Ref.current.position.copy(pos);
    }
  });

  const emissiveInt = osState === 2 ? 5.0 : isDark ? 1.8 : 0.4;

  return (
    <group>
      <mesh>
        <tubeGeometry args={[leftCurve, 32, 0.02, 12, false]} />
        <meshStandardMaterial
          color={isDark ? "#047857" : "#0f766e"}
          emissive={isDark ? "#10b981" : "#14b8a6"}
          emissiveIntensity={emissiveInt}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh>
        <tubeGeometry args={[rightCurve, 32, 0.02, 12, false]} />
        <meshStandardMaterial
          color={isDark ? "#4338ca" : "#3b82f6"}
          emissive={isDark ? "#6366f1" : "#60a5fa"}
          emissiveIntensity={emissiveInt}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh ref={pulse1Ref}>
        <sphereGeometry args={[osState === 2 ? 0.05 : 0.035, 16, 16]} />
        <meshBasicMaterial color={isDark ? "#34d399" : "#0d9488"} />
      </mesh>

      <mesh ref={pulse2Ref}>
        <sphereGeometry args={[osState === 2 ? 0.05 : 0.035, 16, 16]} />
        <meshBasicMaterial color={isDark ? "#a5b4fc" : "#3b82f6"} />
      </mesh>
    </group>
  );
}
