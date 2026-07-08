"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useApp } from "@/context/AppContext";
import { BentoCard } from "@/components/atoms/BentoCard";

interface DeskPapersProps {
  osState: 0 | 1 | 2;
}

export function DeskPapers({ osState }: DeskPapersProps) {
  const { t } = useApp();

  const card1Ref = React.useRef<THREE.Group>(null);
  const card2Ref = React.useRef<THREE.Group>(null);
  const card3Ref = React.useRef<THREE.Group>(null);

  const div1Ref = React.useRef<HTMLDivElement>(null);
  const div2Ref = React.useRef<HTMLDivElement>(null);
  const div3Ref = React.useRef<HTMLDivElement>(null);

  const opacities = React.useRef<number[]>([1, 1, 1]);

  const config = React.useMemo(
    () => ({
      state0: [
        {
          pos: new THREE.Vector3(-0.45, 0.171, 0.08),
          rot: new THREE.Euler(-Math.PI / 2, 0, 0.05),
          opacity: 0.95,
          scale: 0.22,
        },
        {
          pos: new THREE.Vector3(-0.45, 0.185, 0.08),
          rot: new THREE.Euler(-Math.PI / 2, 0, -0.02),
          opacity: 0.95,
          scale: 0.22,
        },
        {
          pos: new THREE.Vector3(-0.45, 0.2, 0.08),
          rot: new THREE.Euler(-Math.PI / 2, 0, 0.01),
          opacity: 0.95,
          scale: 0.22,
        },
      ],
      state1: [
        {
          pos: new THREE.Vector3(-0.52, 0.35, 0.12),
          rot: new THREE.Euler(-0.25, 0.1, -0.05),
          opacity: 0.95,
          scale: 0.35,
        },
        {
          pos: new THREE.Vector3(-0.21, 0.32, 0.15),
          rot: new THREE.Euler(-0.25, -0.1, 0.05),
          opacity: 0.95,
          scale: 0.35,
        },
        {
          pos: new THREE.Vector3(-0.4, 0.13, 0.22),
          rot: new THREE.Euler(-0.35, 0, 0),
          opacity: 0.95,
          scale: 0.35,
        },
      ],
      state2: [
        {
          pos: new THREE.Vector3(-0.52, 0.28, 0.95),
          rot: new THREE.Euler(0, 0, 0),
          opacity: 1.0,
          scale: 0.55,
        },
        {
          pos: new THREE.Vector3(0.52, 0.28, 0.95),
          rot: new THREE.Euler(0, 0, 0),
          opacity: 1.0,
          scale: 0.55,
        },
        {
          pos: new THREE.Vector3(0, -0.28, 0.95),
          rot: new THREE.Euler(0, 0, 0),
          opacity: 1.0,
          scale: 0.55,
        },
      ],
    }),
    [],
  );

  useFrame(() => {
    const refs = [card1Ref.current, card2Ref.current, card3Ref.current];
    const divs = [div1Ref.current, div2Ref.current, div3Ref.current];

    refs.forEach((ref, index) => {
      if (!ref) return;

      const targetSet =
        osState === 0
          ? config.state0[index]
          : osState === 1
            ? config.state1[index]
            : config.state2[index];

      ref.position.lerp(targetSet.pos, 0.08);

      const targetScaleVec = new THREE.Vector3(
        targetSet.scale,
        targetSet.scale,
        targetSet.scale,
      );
      ref.scale.lerp(targetScaleVec, 0.08);

      const targetQuat = new THREE.Quaternion().setFromEuler(targetSet.rot);
      ref.quaternion.slerp(targetQuat, 0.08);

      opacities.current[index] = THREE.MathUtils.lerp(
        opacities.current[index],
        targetSet.opacity,
        0.08,
      );

      const div = divs[index];
      if (div) {
        div.style.opacity = opacities.current[index].toString();
      }
    });
  });

  const pointerClass =
    osState === 2
      ? "pointer-events-auto select-none"
      : "pointer-events-none select-none";

  return (
    <group>
      {/* 1. Miniature 3D CRM Card sitting on the desk */}
      <group ref={card1Ref}>
        <Html transform distanceFactor={0.8} className={pointerClass}>
          <div ref={div1Ref} className="transition-opacity duration-150">
            <div className="w-95 h-60 text-left p-6 rounded-3xl border border-white/40 bg-white/94 backdrop-blur-md shadow-2xl flex flex-col justify-between overflow-hidden relative cursor-default text-neutral-900">
              <div>
                <span className="text-[9px] font-black tracking-widest text-emerald-600 uppercase">
                  CRM Engine
                </span>
                <h3 className="text-lg font-bold mt-1 text-neutral-900">
                  Active CRM Engine
                </h3>
                <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
                  Centralize client relationships. Deactivating a client
                  automatically pauses all associated projects instantly.
                </p>
              </div>
              <div
                dir="ltr"
                className="bg-neutral-900/5 rounded-xl p-2.5 border border-neutral-950/10 flex justify-between items-center text-xs mt-2"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="font-semibold text-[9px] text-neutral-800">
                      Acme Corp
                    </p>
                    <p className="text-[8px] text-neutral-500 mt-0.5">ACTIVE</p>
                  </div>
                </div>
                <button className="px-2 py-1 bg-neutral-900 text-neutral-50 font-bold rounded-md text-[8px] border border-neutral-800">
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </Html>
      </group>

      <group ref={card2Ref}>
        <Html transform distanceFactor={0.8} className={pointerClass}>
          <div ref={div2Ref} className="transition-opacity duration-150">
            <div className="w-95 h-60 text-left p-6 rounded-3xl border border-white/40 bg-white/94 backdrop-blur-md shadow-2xl flex flex-col justify-between overflow-hidden relative cursor-default text-neutral-900">
              <div>
                <span className="text-[9px] font-black tracking-widest text-sky-600 uppercase">
                  Kanban Board
                </span>
                <h3 className="text-lg font-bold mt-1 text-neutral-900">
                  Kanban Task Board
                </h3>
                <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
                  Track tasks on an elegant board with responsive drag-and-drop
                  mechanics.
                </p>
              </div>
              <div
                dir="ltr"
                className="bg-neutral-900/5 rounded-xl p-2.5 border border-neutral-950/10 flex gap-2 h-20 overflow-hidden mt-2"
              >
                <div className="flex-1 border-r border-neutral-300 pr-1 text-center">
                  <p className="text-[8px] text-neutral-400 font-bold">Todo</p>
                  <div className="mt-1 p-1 bg-neutral-900/5 rounded border border-neutral-300 text-[7px] text-neutral-600 truncate">
                    Deploy API
                  </div>
                </div>
                <div className="flex-1 border-r border-neutral-300 px-1 text-center">
                  <p className="text-[8px] text-sky-600 font-bold">Progress</p>
                  <div className="mt-1 p-1 bg-sky-500/10 rounded border border-sky-200 text-[7px] text-sky-700 truncate font-semibold">
                    Auth Setup
                  </div>
                </div>
                <div className="flex-1 pl-1 text-center">
                  <p className="text-[8px] text-emerald-600 font-bold">
                    Completed
                  </p>
                  <div className="mt-1 p-1 bg-emerald-500/10 rounded border border-emerald-200 text-[7px] text-emerald-700 truncate line-through">
                    Prisma Init
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Html>
      </group>

      <group ref={card3Ref}>
        <Html transform distanceFactor={0.8} className={pointerClass}>
          <div ref={div3Ref} className="transition-opacity duration-150">
            <div className="w-95 h-60 text-left p-6 rounded-3xl border border-white/40 bg-white/94 backdrop-blur-md shadow-2xl flex flex-col justify-between overflow-hidden relative cursor-default text-neutral-900">
              <div className="flex flex-col gap-3 h-full justify-between w-full">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-indigo-600 uppercase">
                    Connected Notes
                  </span>
                  <h3 className="text-lg font-bold mt-1 text-neutral-900">
                    Connected Rich Notes
                  </h3>
                  <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
                    Draft fluid text linked directly to tasks and clients with
                    background saving.
                  </p>
                </div>
                <div
                  dir="ltr"
                  className="w-full bg-neutral-900/5 rounded-xl p-3 border border-neutral-950/10 flex flex-col justify-between h-24 font-mono"
                >
                  <div className="flex justify-between items-center text-[7px] border-b border-neutral-300 pb-1.5">
                    <span className="text-neutral-500">Briefing_Doc.md</span>
                    <div className="flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-600">Auto-saving...</span>
                    </div>
                  </div>
                  <p className="text-[8px] text-neutral-600 mt-1 leading-relaxed truncate">
                    &gt; FreelanceOS enables integrated clients workflows, auto
                    backup...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
