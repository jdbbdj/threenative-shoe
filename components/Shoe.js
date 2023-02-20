import React, { useState, useRef, useLayoutEffect } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader, useFrame } from "@react-three/fiber/native";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "expo-three";
const Shoe = (props) => {
  const { position, animatedSensor } = { ...props };
  const [base, normal, rough] = useLoader(TextureLoader, [
    require("../assets/Airmax/textures/BaseColor.jpg"),
    require("../assets/Airmax/textures/Normal.jpg"),
    require("../assets/Airmax/textures/Roughness.png"),
  ]);
  const material = useLoader(MTLLoader, require("../assets/Airmax/shoe.mtl"));

  const obj = useLoader(
    OBJLoader,
    require("../assets/Airmax/shoe.obj"),
    (loader) => {
      material.preload();
      loader.setMaterials(material);
    }
  );

  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = base;
        child.material.normalMap = normal;
        child.material.roughnessMap = rough;
      }
    });
  }, [obj]);
  const [isActive, setIsActive] = useState(false);
  const meshRef = useRef();
  useFrame((state, delta) => {
    let { x, y, z } = animatedSensor.sensor.value;
    x = ~~(x * 100) / 5000;
    y = ~~(y * 100) / 5000;
    meshRef.current.rotation.x += x;
    meshRef.current.rotation.y += y;
  });
  return (
    <mesh
      ref={meshRef}
      onClick={(event) => setIsActive(!isActive)}
      scale={isActive ? 1.5 : 1}
    >
      <primitive object={obj} scale={10} />
    </mesh>
  );
};

export default Shoe;
