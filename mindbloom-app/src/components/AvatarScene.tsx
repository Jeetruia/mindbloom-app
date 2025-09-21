import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment } from '@react-three/drei';
import { useStore } from '../hooks/useStore';
import * as THREE from 'three';

// Simple avatar component (placeholder for Ready Player Me integration)
function TherapistAvatar({ isSpeaking, emotion }: { isSpeaking: boolean; emotion: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle breathing animation
      const breathingScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.y = breathingScale;

      // Speaking animation
      if (isSpeaking) {
        setAnimationPhase(state.clock.elapsedTime * 8);
        const mouthOpen = Math.sin(animationPhase) * 0.1;
        meshRef.current.scale.z = 1 + mouthOpen;
      } else {
        meshRef.current.scale.z = 1;
      }
    }
  });

  return (
    <group>
      {/* Head */}
      <mesh ref={meshRef} position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 1, 8]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 1.6, 0.25]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.1, 1.6, 0.25]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.3, 0.8, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
      <mesh position={[0.3, 0.8, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
    </group>
  );
}

// Greeting animation component
function GreetingAnimation() {
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showGreeting) return null;

  return (
    <Text
      position={[0, 2.5, 0]}
      fontSize={0.3}
      color="#4a90e2"
      anchorX="center"
      anchorY="middle"
    >
      Hi, I'm Mira, your wellness guide.
    </Text>
  );
}

// Main Avatar Scene Component
export function AvatarScene() {
  const { avatarState, user } = useStore();
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      // Delay avatar appearance for smooth entrance
      const timer = setTimeout(() => {
        setShowAvatar(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1, 3], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Environment preset="sunset" />
        
        {showAvatar && (
          <>
            <TherapistAvatar 
              isSpeaking={avatarState.isSpeaking}
              emotion={avatarState.emotion}
            />
            <GreetingAnimation />
          </>
        )}
        
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">
              Mira is ready to listen and support you
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
