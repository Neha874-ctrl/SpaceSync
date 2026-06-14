import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

const CubeRoom = ({ imageUrls }) => {
  // If images haven't loaded yet, show nothing
  if (!imageUrls || imageUrls.length < 6) return null;

  const textures = useLoader(THREE.TextureLoader, imageUrls);
  
  return (
    <mesh>
      <boxGeometry args={[20, 10, 20]} />
      {textures.map((texture, index) => (
        <meshBasicMaterial 
          key={index} 
          map={texture} 
          side={THREE.BackSide} 
          attach={`material-${index}`} 
        />
      ))}
    </mesh>
  );
};

export default function RoomViewer3D({ imageUrls }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={1} />
        <Grid position={[0, -5, 0]} infiniteGrid cellSize={1} cellColor="#e96b8d" sectionColor="#e96b8d" fadeDistance={25} />
        <Suspense fallback={null}>
          <CubeRoom imageUrls={imageUrls} />
        </Suspense>
        <OrbitControls enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}