import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
const Torus = (props) => {
  const [isActive, setIsActive] = useState(false);
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (isActive) {
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh
      ref={meshRef}
      {...props}
      onClick={(event) => setIsActive(!isActive)}
      scale={isActive ? 0.1 : 0.05}
    >
      {/*Dimension */}
      <torusKnotGeometry radius={10} args={[10, 1, 260, 6, 10, 16]} />
      {/*material*/}
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
};

export default Torus;
