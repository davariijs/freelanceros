"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Text } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function WorkTablet() {
  const { locale, toggleLocale } = useApp();
  const globeRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.35;
    }
  });

  const handleToggle = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    toggleLocale();
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
  };

  const isEnglish = locale === "en";

  return (
    <group
      position={[0.32, 0.22, 0.15]}
      rotation={[0.35, -Math.PI * 1, 0]}
      onClick={handleToggle}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={1.8}
    >
      <mesh position={[0, -0.05, -0.03]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.06, 0.04]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>

      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.15, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />
      </mesh>

      <mesh position={[0, 0, 0.006]}>
        <boxGeometry args={[0.2, 0.13, 0.002]} />
        <meshStandardMaterial
          color="#04060a"
          emissive="#0a1224"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      <mesh ref={globeRef} position={[0, 0.022, 0.01]}>
        <sphereGeometry args={[0.032, 12, 10]} />
        <meshBasicMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>

      <pointLight
        position={[0, 0.022, 0.015]}
        distance={0.7}
        intensity={1}
        color="#10b981"
      />

      <Text
        position={[-0.04, -0.035, 0.008]}
        fontSize={0.04}
        color={isEnglish ? "#10b981" : "#444444"}
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        EN
      </Text>

      <Text
        position={[0, -0.035, 0.008]}
        fontSize={0.016}
        color="#222222"
        anchorX="center"
        anchorY="middle"
      >
        |
      </Text>

      <Text
        position={[0.04, -0.035, 0.008]}
        fontSize={0.04}
        color={!isEnglish ? "#10b981" : "#444444"}
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        FA
      </Text>
    </group>
  );
}
