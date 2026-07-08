"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function OrbitingRings() {
  const groupRef = React.useRef<THREE.Group>(null);
  const node1Ref = React.useRef<THREE.Mesh>(null);
  const node2Ref = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    groupRef.current.rotation.y = time * 0.05;

    if (node1Ref.current) {
      node1Ref.current.position.x = Math.cos(time * 0.3) * 1.8;
      node1Ref.current.position.z = Math.sin(time * 0.3) * 1.8;
    }

    if (node2Ref.current) {
      node2Ref.current.position.x = Math.sin(time * 0.25) * 2.3;
      node2Ref.current.position.z = Math.cos(time * 0.25) * 2.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.4, 0]}>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.8, 0.004, 8, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.12} />
      </mesh>

      <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.3, 0.004, 8, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.12} />
      </mesh>

      <mesh ref={node1Ref}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      <mesh ref={node2Ref}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color="#6366f1" />
      </mesh>
    </group>
  );
}
