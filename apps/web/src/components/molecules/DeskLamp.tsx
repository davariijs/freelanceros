"use client";

import * as React from "react";
import * as THREE from "three";

export function DeskLamp() {
  const spotLightRef = React.useRef<THREE.SpotLight>(null);

  return (
    <group position={[0.7, 0.05, -0.3]} rotation={[0, -Math.PI / 4, 0]}>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.22, 0]} rotation={[0, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        <meshStandardMaterial color="#cccccc" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh position={[-0.05, 0.5, 0]} rotation={[0, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.35, 8]} />
        <meshStandardMaterial color="#cccccc" roughness={0.3} metalness={0.8} />
      </mesh>

      <group position={[-0.15, 0.62, 0]} rotation={[0, 0, 0.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.08, 0.12, 16, 1, true]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh position={[0, -0.04, 0]}>
          <sphereGeometry args={[0.028, 16, 16]} />
          <meshBasicMaterial color="#ffeeaa" />
        </mesh>

        <spotLight
          ref={spotLightRef}
          position={[0, -0.06, 0]}
          angle={Math.PI / 3.5}
          penumbra={0.7}
          intensity={8}
          distance={5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          color="#ffebad"
        />
      </group>
    </group>
  );
}
