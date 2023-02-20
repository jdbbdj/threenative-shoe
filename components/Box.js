import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
const Box = (props) => {
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
      scale={isActive ? 1.5 : 1}
    >
      {/*Dimension */}
      <boxGeometry args={[1, 1, 1]} />
      {/*material*/}
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
};

export default Box;
