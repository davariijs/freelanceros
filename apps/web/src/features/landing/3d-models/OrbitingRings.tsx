"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function OrbitingRings() {
  const innerRingRef = React.useRef<THREE.Group>(null);
  const outerRingRef = React.useRef<THREE.Group>(null);
  const node1Ref = React.useRef<THREE.Mesh>(null);
  const node2Ref = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = time * 0.05;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = -time * 0.03;
    }

    if (node1Ref.current) {
      node1Ref.current.position.x = Math.cos(time * 0.4) * 1.8;
      node1Ref.current.position.y = Math.sin(time * 0.4) * 1.8;
      node1Ref.current.position.z = 0;
    }

    if (node2Ref.current) {
      node2Ref.current.position.x = Math.sin(time * 0.3) * 2.3;
      node2Ref.current.position.y = Math.cos(time * 0.3) * 2.3;
      node2Ref.current.position.z = 0;
    }
  });

  return (
    <group position={[0, 0.4, 0]}>
      <group ref={innerRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.8, 0.003, 8, 64]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.12} />
        </mesh>
        <mesh ref={node1Ref}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      <group ref={outerRingRef} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[2.3, 0.003, 8, 64]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.12} />
        </mesh>

        <mesh ref={node2Ref}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color="#6366f1" />
        </mesh>
      </group>
    </group>
  );
}
