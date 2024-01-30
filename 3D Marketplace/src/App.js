import { Canvas } from "@react-three/fiber"
import { Loader, PointerLockControls, KeyboardControls , Text, Text3D , Html, PresentationControls, Stars } from "@react-three/drei"
import { Debug, Physics } from "@react-three/rapier"
import { Player } from "./Player"
import { Model } from "./Showroom"
import { Suspense } from "react"
import { Billboard } from "@react-three/drei"
import { Sky } from "@react-three/drei"

// Controls: WASD + left click

const EquidistantPoints = ({ numPoints }) => {  
  const points = [];

  for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const z = Math.cos(angle) * 5;
      const x = Math.sin(angle) * 5;
      const y = 1;
      const mul = 3;
      points.push([x * mul, y * mul, z * mul]);
  }

  return (
      <>
          {points.map((point, index) => (
              <PresentationControls key={index} snap={true}>
              <mesh position={point}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color="red" />
              </mesh>
          </PresentationControls>
          ))}
      </>
  );
};


export default function App() {
  const queryParams = new URLSearchParams(window.location.search)
  const address = queryParams.get("market") || "loading..."
  let hours = 12 +  new Date().getHours()
  // hours = 12
  let namecolor = "white"
  if(hours > 18 && hours <32) namecolor = "green"
  const inclination = 0; // Set your desired inclination
  const azimuth = (hours / 24) * 2 * Math.PI; // Calculate azimuth based on hours

  // Calculate sun position using spherical coordinates
  const y = Math.cos(azimuth) * Math.cos(inclination);
  const x = Math.sin(azimuth) * Math.cos(inclination);
  const z = Math.sin(inclination);

  const sunPosition = ([x, y, z]);

  return ( <>

    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
      ]}>
       
      <Suspense>
      <Canvas camera={{ fov: 45 }} shadows>

        <Sky distance={450} sunPosition={sunPosition} inclination={0} azimuth={0.25}  />
        <Stars depth={100}/>

      <Billboard follow={true} lockX={false} lockY={false}>
      <Text font="./Inter-Bold.woff" position={[0,5,0]} fontSize={0.75} color={namecolor}>🏪 AnshMart</Text>
      <Text font="./Inter-Bold.woff" position={[0,4,0]} fontSize={0.25} color="white">{address}</Text>
      </Billboard>

        <Physics>
            <Model/>
            <Player /> 
            <EquidistantPoints numPoints={5} />
        </Physics>
        
        <PointerLockControls />
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 10, 0]} intensity={0.4}/>
      </Canvas>
      </Suspense>
      <Loader/>
    </KeyboardControls>
     </>
  )
}
