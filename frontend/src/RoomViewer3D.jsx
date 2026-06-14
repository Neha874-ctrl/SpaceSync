import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

// Define the inner parts here
const Panorama = ({ imageUrl }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  return (
    <mesh>
      <boxGeometry args={[20, 10, 20]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

// Export the component
export default function RoomViewer3D({ imageUrl }) {
  return (
    <div style={{ width: '100%', height: '657px', borderRadius: '20px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={1} />
        <Grid position={[0, -5, 0]} infiniteGrid cellSize={1} cellColor="#e96b8d" sectionColor="#e96b8d" fadeDistance={25} />
        <Suspense fallback={null}>
          <Panorama imageUrl={imageUrl} />
        </Suspense>
        <OrbitControls enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}