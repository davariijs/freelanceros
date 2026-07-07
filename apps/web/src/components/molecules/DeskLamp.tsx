"use client";

import * as React from "react";
import * as THREE from "three";
import { useApp } from "@/context/AppContext";
import { ThreeEvent } from "@react-three/fiber";

export function DeskLamp() {
  const spotLightRef = React.useRef<THREE.SpotLight>(null);
  const { theme, setTheme } = useApp();
  const isDark = theme === "dark";

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
      position={[-0.75, 0.08, -0.1]}
      rotation={[0, Math.PI / 4.2, 0]}
      onClick={handleToggle}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 1. Base Disc */}
      <mesh position={[0, 0.007, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.015, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>

      {/* 2. Lower Arm Group (Tilted slightly back) */}
      <group position={[0, 0.015, 0]} rotation={[0, 0, 0.25]}>
        {/* Lower Arm Cylinder */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.44, 8]} />
          <meshStandardMaterial color="#decba4" roughness={0.8} />
        </mesh>

        {/* 3. Middle Joint & Upper Arm Group (Tilted sharply inwards over the desk) */}
        <group position={[0, 0.44, 0]} rotation={[0, 0, -0.85]}>
          {/* Middle Joint Knob */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
          </mesh>

          {/* Upper Arm Cylinder */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.009, 0.009, 0.4, 8]} />
            <meshStandardMaterial color="#decba4" roughness={0.8} />
          </mesh>

          {/* 4. Top Joint & Lamp Head Group */}
          <group position={[0, 0.4, 0]} rotation={[0, 0, 0.6]}>
            {/* Top Joint Knob */}
            <mesh
              position={[0, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
            </mesh>

            {/* Lamp Head Assembly (Oriented Downwards) */}
            <group position={[0.01, -0.08, 0]} scale={1.3}>
              {/* Black Socket Top */}
              <mesh position={[0, 0.1, 0]} castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.06, 16]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
              </mesh>

              {/* Dome Shade (Facing directly downwards, perfectly connected) */}
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

              {/* Bulb */}
              <mesh position={[0, 0.02, 0]}>
                <sphereGeometry args={[0.022, 16, 16]} />
                <meshBasicMaterial color={isDark ? "#ffeb9c" : "#777777"} />
              </mesh>

              {/* SpotLight Source */}
              <spotLight
                ref={spotLightRef}
                position={[0, -0.04, 0]}
                angle={Math.PI / 3}
                penumbra={0.7}
                intensity={isDark ? 14 : 0}
                distance={5}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                color="#ffeaa8"
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
