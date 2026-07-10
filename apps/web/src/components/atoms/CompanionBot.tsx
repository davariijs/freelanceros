"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useApp } from "@/context/AppContext";

interface CompanionBotProps {
  osState: 0 | 1 | 2 | 3;
}

export function CompanionBot({ osState }: CompanionBotProps) {
  const { theme } = useApp();
  const isDark = theme === "dark";

  const botRef = React.useRef<THREE.Group>(null);
  const leftLegRef = React.useRef<THREE.Group>(null);
  const rightLegRef = React.useRef<THREE.Group>(null);
  const leftArmRef = React.useRef<THREE.Group>(null);
  const rightArmRef = React.useRef<THREE.Group>(null);

  const stateFactorRef = React.useRef(0);

  const config = React.useMemo(
    () => ({
      state0: {
        pos: new THREE.Vector3(-1, 0.1, -1.09),
        rot: new THREE.Euler(0, -Math.PI * 1, 0),
        legRot: 0.8,
        armRot: 0.1,
      },
      state1: {
        pos: new THREE.Vector3(-1, 0.2, -1.09),
        rot: new THREE.Euler(0, -Math.PI * 1, 0),
        legRot: 0,
        armRot: 0.2,
      },
      state2: {
        pos: new THREE.Vector3(-1.1, 0.12, 1.41),
        rot: new THREE.Euler(0, -Math.PI * 1.4, 0),
        legRot: 0,
        armRot: 0.3,
      },
      state3: {
        pos: new THREE.Vector3(-0.35, -0.05, 1.25),
        rot: new THREE.Euler(0, -Math.PI * 0.95, 0),
        legRot: 0,
        armRot: 0.3,
      },
    }),
    [],
  );

  useFrame((state) => {
    if (!botRef.current) return;
    const time = state.clock.getElapsedTime();
    const targetFactor =
      osState === 0 ? 0 : osState === 1 ? 0.33 : osState === 2 ? 0.66 : 1.0;
    stateFactorRef.current = THREE.MathUtils.lerp(
      stateFactorRef.current,
      targetFactor,
      0.08,
    );

    const curFactor = stateFactorRef.current;

    let activePos = new THREE.Vector3();
    let activeRot = new THREE.Euler();

    if (curFactor < 0.33) {
      const segmentT = curFactor / 0.33;
      activePos.lerpVectors(config.state0.pos, config.state1.pos, segmentT);

      const qStart = new THREE.Quaternion().setFromEuler(config.state0.rot);
      const qEnd = new THREE.Quaternion().setFromEuler(config.state1.rot);
      const curQ = new THREE.Quaternion().slerpQuaternions(
        qStart,
        qEnd,
        segmentT,
      );
      activeRot.setFromQuaternion(curQ);
    } else if (curFactor >= 0.33 && curFactor < 0.66) {
      const segmentT = (curFactor - 0.33) / 0.33;
      activePos.lerpVectors(config.state1.pos, config.state2.pos, segmentT);

      const qStart = new THREE.Quaternion().setFromEuler(config.state1.rot);
      const qEnd = new THREE.Quaternion().setFromEuler(config.state2.rot);
      const curQ = new THREE.Quaternion().slerpQuaternions(
        qStart,
        qEnd,
        segmentT,
      );
      activeRot.setFromQuaternion(curQ);

      const heightHump = Math.sin(segmentT * Math.PI) * 0.35;
      activePos.y += heightHump;

      if (osState === 2 && stateFactorRef.current > 0.64) {
        const walkCycle = Math.sin(time * 0.8);
        const offsetX = walkCycle * 0.45;
        activePos.x += offsetX;

        const movingRight = Math.cos(time * 0.8) > 0;
        botRef.current.rotation.y = THREE.MathUtils.lerp(
          botRef.current.rotation.y,
          movingRight ? -Math.PI * 1.45 : -Math.PI * 0.35,
          0.08,
        );
      }
    } else {
      const segmentT = (curFactor - 0.66) / 0.34;
      activePos.lerpVectors(config.state2.pos, config.state3.pos, segmentT);

      const qStart = new THREE.Quaternion().setFromEuler(config.state2.rot);
      const qEnd = new THREE.Quaternion().setFromEuler(config.state3.rot);
      const curQ = new THREE.Quaternion().slerpQuaternions(
        qStart,
        qEnd,
        segmentT,
      );
      activeRot.setFromQuaternion(curQ);
      const heightHump = Math.sin(segmentT * Math.PI) * 0.4;
      activePos.y += heightHump;

      if (osState === 3 && stateFactorRef.current > 0.95) {
        const walkCycle = Math.sin(time * 1.4);
        activePos.x += walkCycle * 0.12;
      }
    }

    botRef.current.position.copy(activePos);

    if (!(osState === 2 && stateFactorRef.current > 0.64)) {
      botRef.current.rotation.copy(activeRot);
    }

    if (osState === 0) {
      const dangle = Math.sin(time * 3.5) * 0.3;
      if (leftLegRef.current)
        leftLegRef.current.rotation.x = config.state0.legRot + dangle;
      if (rightLegRef.current)
        rightLegRef.current.rotation.x = config.state0.legRot - dangle;
      if (leftArmRef.current)
        leftArmRef.current.rotation.x = config.state0.armRot;
      if (rightArmRef.current)
        rightArmRef.current.rotation.x = config.state0.armRot;
    } else if (osState === 1) {
      const bob = Math.sin(time * 2.0) * 0.008;
      botRef.current.position.y += bob;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current)
        leftArmRef.current.rotation.x = Math.sin(time * 2.0) * 0.05;
      if (rightArmRef.current)
        rightArmRef.current.rotation.x = -Math.sin(time * 2.0) * 0.05;
    } else if (osState >= 2) {
      const walk = Math.sin(time * 8.5) * 0.4;
      if (leftLegRef.current) leftLegRef.current.rotation.x = walk;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -walk;

      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -walk * 0.8;
        leftArmRef.current.rotation.z = 0;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = walk * 0.8;
        rightArmRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group ref={botRef} scale={0.6}>
      <group position={[0, 0.28, 0]}>
        <RoundedBox
          args={[0.16, 0.12, 0.12]}
          radius={0.015}
          smoothness={4}
          castShadow
        >
          <meshStandardMaterial
            color="#fafafc"
            metalness={0.82}
            roughness={0.12}
          />
        </RoundedBox>

        <RoundedBox
          args={[0.13, 0.08, 0.01]}
          radius={0.005}
          smoothness={4}
          position={[0, 0, 0.056]}
          castShadow
        >
          <meshStandardMaterial
            color="#07090e"
            roughness={0.15}
            metalness={0.9}
          />
        </RoundedBox>

        <group position={[-0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.024, 0.024, 0.012, 16]} />
            <meshStandardMaterial
              color="#222326"
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0, 0.007, 0]}>
            <torusGeometry args={[0.015, 0.002, 8, 16]} />
            <meshBasicMaterial color="#00f3ff" />
          </mesh>
        </group>

        <group position={[0.09, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.024, 0.024, 0.012, 16]} />
            <meshStandardMaterial
              color="#222326"
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0, 0.007, 0]}>
            <torusGeometry args={[0.015, 0.002, 8, 16]} />
            <meshBasicMaterial color="#00f3ff" />
          </mesh>
        </group>

        <Text
          position={[-0.032, 0.006, 0.062]}
          fontSize={0.038}
          color="#00f3ff"
          fontWeight="bold"
        >
          ^
        </Text>
        <Text
          position={[0.032, 0.006, 0.062]}
          fontSize={0.038}
          color="#00f3ff"
          fontWeight="bold"
        >
          ^
        </Text>
      </group>

      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial
          color="#888888"
          metalness={1.0}
          roughness={0.03}
        />
      </mesh>

      <group position={[0, 0.11, 0]}>
        <RoundedBox
          args={[0.13, 0.15, 0.09]}
          radius={0.015}
          smoothness={4}
          castShadow
        >
          <meshStandardMaterial
            color="#fafafc"
            metalness={0.82}
            roughness={0.12}
          />
        </RoundedBox>
      </group>

      <group ref={leftArmRef} position={[-0.08, 0.15, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshStandardMaterial
            color="#888888"
            metalness={1.0}
            roughness={0.03}
          />
        </mesh>
        <mesh position={[0, -0.06, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
          <meshStandardMaterial
            color="#fafafc"
            metalness={0.8}
            roughness={0.15}
          />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.08, 0.15, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshStandardMaterial
            color="#888888"
            metalness={1.0}
            roughness={0.03}
          />
        </mesh>
        <mesh position={[0, -0.06, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
          <meshStandardMaterial
            color="#fafafc"
            metalness={0.8}
            roughness={0.15}
          />
        </mesh>
      </group>

      <group ref={leftLegRef} position={[-0.035, 0.02, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshStandardMaterial
            color="#888888"
            metalness={1.0}
            roughness={0.03}
          />
        </mesh>
        <mesh position={[0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.11, 8]} />
          <meshStandardMaterial
            color="#fafafc"
            metalness={0.8}
            roughness={0.15}
          />
        </mesh>
        <mesh position={[0, -0.11, 0.012]} castShadow>
          <boxGeometry args={[0.024, 0.014, 0.038]} />
          <meshStandardMaterial color="#111111" roughness={0.4} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.035, 0.02, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshStandardMaterial
            color="#888888"
            metalness={1.0}
            roughness={0.03}
          />
        </mesh>
        <mesh position={[0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.11, 8]} />
          <meshStandardMaterial
            color="#fafafc"
            metalness={0.8}
            roughness={0.15}
          />
        </mesh>
        <mesh position={[0, -0.11, 0.012]} castShadow>
          <boxGeometry args={[0.024, 0.014, 0.038]} />
          <meshStandardMaterial color="#111111" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
