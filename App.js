import { Canvas } from "@react-three/fiber/native";
import { Suspense } from "react";
import { useAnimatedSensor, SensorType } from "react-native-reanimated";

import Shoe from "./components/Shoe";
import Box from "./components/Box";
import Torus from "./components/Torus";
export default function App() {
  const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {
    interval: 100,
  });
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Torus position={[0, 1.5, 0]} />
      <Box position={[0, -1.5, 0]} />
      <Suspense fallback={null}>
        <Shoe animatedSensor={animatedSensor} />
      </Suspense>
    </Canvas>
  );
}
