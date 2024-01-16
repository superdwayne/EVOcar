import { useEffect, useState, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics, usePlane, useBox, useSphere } from '@react-three/cannon'
import { useGLTF } from '@react-three/drei'
import {Mesh, InstancedMesh, Color}  from "three"


const niceColors = ['#99b898', '#fecea8', '#ff847c', '#e84a5f', '#2a363b', '#C0C0C0']

function Plane({ color, ...props }) {
  const [ref] = usePlane(() => ({ ...props }), useRef<Mesh>(null))
  return (
    <mesh ref={ref} receiveShadow >
      <planeBufferGeometry args={[1000, 1000]} />
      <meshPhongMaterial color={color} />
    </mesh>
  )
}

function Box() {
  const boxSize = [1, 1, 1]
  const [ref, api] = useBox(() => ({ args: boxSize, mass: 2, type: 'Kinematic' }), useRef<Mesh>(null))
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    api.position.set(Math.sin(t * 2) * 1, Math.cos(t * 2) * 5, 3)
    api.rotation.set(Math.sin(t * 6), Math.cos(t * 6), 0)
  })
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxBufferGeometry args={boxSize} />
      <meshLambertMaterial color="white" />
    </mesh>
  )
}

function InstancedSpheres({ number = 0 }) {

  const [ref] = useSphere(
    (index) => ({
      args: [1],
      mass: 3,
      position: [Math.random() - 0.5, Math.random() - 0.5, index * 2],
    }),
    useRef<InstancedMesh>(null),
  )

  const colors = useMemo(() => {
   
    const array = new Float32Array(number * 3)
    console.log(array)
    const color = new Color()
    
    for (let i = 0; i < number; i++)
      
        <Metalball />
    return array
   
  }, [number])

  

  return (

    
    <instancedMesh  ref={ref} castShadow receiveShadow args={[undefined, , number]}>
   
      <sphereBufferGeometry args={[1, 16, 16]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />

      </sphereBufferGeometry>
     
      
      <meshPhongMaterial vertexColors />
    </instancedMesh>
  )
}

function Mouse() {
  const { viewport } = useThree()
  const [, api] = useSphere(() => ({ type: "Kinematic", args: [6] }))
  return useFrame((state) => api.position.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 7))
}

const CustomButton = ({ onPress }) => {

  return (
    <button type="button" onClick={onPress}>
      Click on me
    </button>
  );
};


function Metalball(props) {
  const { nodes, materials } = useGLTF('/circle.gltf')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[4.08, 1.01, 5.9]} rotation={[-0.27, 0.6, 1.93]} />
        <group position={[-0.73, 0, 1.17]}>
          <mesh geometry={nodes.Sphere001.geometry} material={materials.Root} scale={0.35} />
        </group>
        <group position={[-0.54, 1.82, 3.57]} />
      </group>
    </group>

)
}
export default function App() {
  const [number, SetNumber] = useState(0);
  
  const handleEvent = () => {
    SetNumber(number + 1);
   
  };
  return (
    <Canvas onClick={handleEvent}  gl={{ alpha: true }} camera={{ position: [0, 0, 10 ] }} style={{backgroundColor: "grey" , display: "block" , height: "100vh", width: "100vw"}}   >
      <hemisphereLight intensity={0.35} />
      
    <spotLight
      position={[30, 0, 30]}
      angle={0.3}
      penumbra={1}
      intensity={2}
      castShadow
      shadow-mapSize-width={256}
      shadow-mapSize-height={256}
    />
    <pointLight position={[-30, 0, -30]} intensity={0.5} />
    <Physics gravity={[0, -50, -100]}>
      <Plane color={'#fff'} position={[0, 0, 0]} rotation={[0, 0, 0]} />
      <Plane color={niceColors[1]} position={[-6, 0, 0]} rotation={[0, 0.9, 0]} />
      <Plane color={niceColors[2]} position={[6, 0, 0]} rotation={[0, -0.9, 0]} />
      
       {/* Top */}
      <Plane color={'#ff00ff'} position={[0, 6, 0]} rotation={[0.9, 0, 0]} />
      {/* //Bottom */}
      <Plane color={'#fff'} position={[0, -3, 0]} rotation={[-0.9, 0, 0]} />
      <Mouse />
      <InstancedSpheres number={5} />
    </Physics>
   
    </Canvas>
  )
}
