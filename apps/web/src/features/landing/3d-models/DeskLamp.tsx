"use client";

import * as React from "react";
import * as THREE from "three";
import { useApp } from "@/context/AppContext";
import { ThreeEvent, useFrame } from "@react-three/fiber";

export function DeskLamp() {
  const spotLightRef = React.useRef<THREE.SpotLight>(null);
  const bulbMatRef = React.useRef<THREE.MeshBasicMaterial>(null);
  const { theme, setTheme } = useApp();
  const isDark = theme === "dark";

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cycle = time % 6.0;

    let active = isDark;
    let intensity = isDark ? 14 : 0;

    if (cycle > 4.5 && cycle < 4.9) {
      const flickerState = Math.sin(time * 60) > 0.15;

      if (isDark) {
        active = flickerState;
        intensity = flickerState ? 14 : 0;
      } else {
        active = !flickerState;
        intensity = !flickerState ? 10 : 0;
      }
    }

    if (spotLightRef.current) {
      spotLightRef.current.intensity = intensity;
    }

    if (bulbMatRef.current) {
      bulbMatRef.current.color.set(active ? "#ffeb9c" : "#777777");
    }
  });

  const handleToggle = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
  };

  return (
    <group
      position={[-0.82, 0.15, -0.1]}
      rotation={[0, Math.PI / 4.2, 0]}
      onClick={handleToggle}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.03, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.7} />
      </mesh>

      <group position={[0, 0.03, 0]} rotation={[0, 0, 0.25]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.44, 8]} />
          <meshStandardMaterial color="#decba4" roughness={0.8} />
        </mesh>

        <group position={[0, 0.44, 0]} rotation={[0, 0, -0.85]}>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
          </mesh>

          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.009, 0.009, 0.4, 8]} />
            <meshStandardMaterial color="#decba4" roughness={0.8} />
          </mesh>

          <group position={[0, 0.4, 0]} rotation={[0, 0, 0.6]}>
            <mesh
              position={[0, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
            </mesh>

            <group position={[0.01, -0.08, 0]} scale={1.3}>
              <mesh position={[0, 0.1, 0]} castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.06, 16]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
              </mesh>

              <mesh rotation={[0, 0, 0]} castShadow>
                <sphereGeometry
                  args={[0.09, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
                />
                <meshStandardMaterial
                  color="#1a1a1a"
                  roughness={0.6}
                  side={THREE.DoubleSide}
                />
              </mesh>

              <mesh position={[0, 0.02, 0]}>
                <sphereGeometry args={[0.022, 16, 16]} />
                <meshBasicMaterial
                  ref={bulbMatRef}
                  color={isDark ? "#ffeb9c" : "#777777"}
                />
              </mesh>

              <spotLight
                ref={spotLightRef}
                position={[0, -0.04, 0]}
                angle={Math.PI / 3}
                penumbra={0.7}
                intensity={isDark ? 14 : 0}
                distance={5}
                castShadow
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
                color="#ffeaa8"
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
