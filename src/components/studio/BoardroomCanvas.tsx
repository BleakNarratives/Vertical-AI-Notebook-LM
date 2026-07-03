'use client';

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AGENT_LIST, AGENTS, type AgentId } from "@/lib/deep-dive";

export type AgentMode = "orbs" | "nameplates" | "audio";

const TABLE_RADIUS = 4;
const SEAT_RADIUS = 4.9;
const IDLE_COLOR = "#3a3a3a";

function seatPosition(angle: number, radius = SEAT_RADIUS): [number, number, number] {
  return [Math.sin(angle) * radius, 0, Math.cos(angle) * radius];
}

/** Deterministic per-agent "voice" waveform used for audio-reactive visuals. */
function waveform(t: number, seed: number, active: boolean) {
  const base =
    Math.sin(t * (6 + seed)) * 0.5 +
    Math.sin(t * (11 + seed * 2)) * 0.3 +
    Math.sin(t * (17 + seed)) * 0.2;
  const norm = (base + 1) / 2; // 0..1
  return active ? 0.15 + norm * 0.85 : 0.06;
}

function Orb({ agent, active }: { agent: (typeof AGENT_LIST)[number]; active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const seed = agent.angle;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const level = waveform(t, seed, active);
    const s = active ? 1 + level * 0.25 : 1;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(s);
      meshRef.current.rotation.y = t * 0.4;
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = active ? 0.8 + level * 1.6 : 0.35;
    }
    if (wireRef.current) {
      wireRef.current.scale.setScalar(s * 1.18);
      wireRef.current.rotation.y = -t * 0.25;
      wireRef.current.rotation.x = t * 0.15;
    }
  });

  return (
    <group position={[0, 1.5, 0]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.62, 2]} />
        <meshStandardMaterial
          color={agent.color}
          emissive={agent.color}
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshBasicMaterial color={agent.color} wireframe transparent opacity={active ? 0.5 : 0.18} />
      </mesh>
    </group>
  );
}

function Nameplate({
  agent,
  active,
}: {
  agent: (typeof AGENT_LIST)[number];
  active: boolean;
}) {
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!glowRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = glowRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = active ? 0.9 + Math.sin(t * 4) * 0.4 : 0.15;
  });

  return (
    <group>
      {/* Seat back */}
      <mesh position={[0, 0.9, 0.35]} castShadow>
        <boxGeometry args={[1.5, 1.8, 0.18]} />
        <meshStandardMaterial color="#141414" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Glowing edge strip */}
      <mesh ref={glowRef} position={[0, 1.75, 0.28]}>
        <boxGeometry args={[1.5, 0.08, 0.2]} />
        <meshStandardMaterial
          color={agent.color}
          emissive={agent.color}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Nameplate on the table edge */}
      <mesh position={[0, 0.32, -0.15]} rotation={[-Math.PI / 2.4, 0, 0]}>
        <planeGeometry args={[1.7, 0.5]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      <Html
        position={[0, 0.55, 0.1]}
        center
        distanceFactor={9}
        occlude={false}
        wrapperClass="pointer-events-none"
      >
        <div
          className="whitespace-nowrap rounded border px-3 py-1 text-center font-mono transition-all"
          style={{
            borderColor: active ? agent.color : "rgba(255,255,255,0.15)",
            background: active ? `${agent.color}1a` : "rgba(5,5,5,0.85)",
            boxShadow: active ? `0 0 20px ${agent.color}66` : "none",
          }}
        >
          <div
            className="text-[13px] font-bold uppercase tracking-[0.2em]"
            style={{ color: active ? agent.color : "#e5e5e5" }}
          >
            {agent.short}
          </div>
          <div className="text-[9px] uppercase tracking-widest text-white/40">
            {agent.role}
          </div>
        </div>
      </Html>
    </group>
  );
}

function Equalizer({
  agent,
  active,
}: {
  agent: (typeof AGENT_LIST)[number];
  active: boolean;
}) {
  const bars = 7;
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const seed = agent.angle;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < bars; i++) {
      const mesh = refs.current[i];
      if (!mesh) continue;
      const level = waveform(t + i * 0.35, seed + i, active);
      const h = 0.12 + level * 1.7;
      mesh.scale.y = h;
      mesh.position.y = 0.6 + h / 2;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = active ? 0.6 + level * 1.5 : 0.25;
    }
  });

  return (
    <group>
      {Array.from({ length: bars }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[(i - (bars - 1) / 2) * 0.26, 0.6, 0]}
        >
          <boxGeometry args={[0.16, 1, 0.16]} />
          <meshStandardMaterial
            color={agent.color}
            emissive={agent.color}
            emissiveIntensity={0.3}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function AgentNode({
  agent,
  active,
  mode,
}: {
  agent: (typeof AGENT_LIST)[number];
  active: boolean;
  mode: AgentMode;
}) {
  const pos = seatPosition(agent.angle);
  // Face the group toward the table center.
  const rotY = Math.atan2(pos[0], pos[2]);

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* Floor pad */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 40]} />
        <meshBasicMaterial
          color={agent.color}
          transparent
          opacity={active ? 0.22 : 0.05}
        />
      </mesh>
      {mode === "orbs" && <Orb agent={agent} active={active} />}
      {mode === "nameplates" && <Nameplate agent={agent} active={active} />}
      {mode === "audio" && <Equalizer agent={agent} active={active} />}
    </group>
  );
}

function Table({ activeColor }: { activeColor: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.25;
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + (Math.sin(t * 2) * 0.5 + 0.5) * 0.05;
      beamRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group>
      {/* Table top */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[TABLE_RADIUS, TABLE_RADIUS, 0.4, 64]} />
        <meshStandardMaterial color="#0b0b0b" roughness={0.35} metalness={0.6} />
      </mesh>
      {/* Neon edge ring */}
      <mesh ref={ringRef} position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[TABLE_RADIUS - 0.05, 0.04, 16, 100]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={1.4}
        />
      </mesh>
      {/* Inner etched ring */}
      <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[TABLE_RADIUS - 1.2, 0.015, 12, 100]} />
        <meshBasicMaterial color={activeColor} transparent opacity={0.35} />
      </mesh>
      {/* Center core */}
      <mesh ref={coreRef} position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.7, 24]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>
      {/* Projector beam */}
      <mesh ref={beamRef} position={[0, 3.2, 0]}>
        <coneGeometry args={[2.6, 5, 32, 1, true]} />
        <meshBasicMaterial
          color={activeColor}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Scene({
  activeSpeaker,
  mode,
  isPlaying,
}: {
  activeSpeaker: AgentId | null;
  mode: AgentMode;
  isPlaying: boolean;
}) {
  const activeColor = activeSpeaker ? AGENTS[activeSpeaker].color : IDLE_COLOR;
  const light = useMemo(() => new THREE.Color(activeColor), [activeColor]);

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 12, 34]} />

      <ambientLight intensity={0.35} />
      <pointLight
        position={[0, 6, 0]}
        color={light}
        intensity={isPlaying ? 90 : 45}
        distance={30}
        decay={1.4}
      />
      <spotLight
        position={[10, 12, 6]}
        angle={0.5}
        penumbra={0.8}
        intensity={80}
        color="#ffffff"
      />
      <spotLight
        position={[-10, 8, -6]}
        angle={0.6}
        penumbra={1}
        intensity={40}
        color={light}
      />

      <Table activeColor={activeColor} />

      {AGENT_LIST.map((agent) => (
        <AgentNode
          key={agent.id}
          agent={agent}
          active={activeSpeaker === agent.id}
          mode={mode}
        />
      ))}

      {/* Ground grid */}
      <gridHelper
        args={[80, 80, "#1a1a1a", "#111111"]}
        position={[0, -0.25, 0]}
      />
      <mesh position={[0, -0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#050505" roughness={1} />
      </mesh>

      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={20}
        minPolarAngle={0.5}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={!isPlaying}
        autoRotateSpeed={0.4}
        target={[0, 1, 0]}
      />
    </>
  );
}

export default function BoardroomCanvas({
  activeSpeaker,
  mode,
  isPlaying,
}: {
  activeSpeaker: AgentId | null;
  mode: AgentMode;
  isPlaying: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 6.5, 12], fov: 45 }}
      gl={{ antialias: true }}
    >
      <Scene activeSpeaker={activeSpeaker} mode={mode} isPlaying={isPlaying} />
    </Canvas>
  );
}
