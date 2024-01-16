import React, { useRef, Suspense } from "react";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, OrbitControls, shaderMaterial } from "@react-three/drei"
import glsl from "babel-plugin-glsl/macro";

const WaveShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture()
  },
  // Vertex Shader
  glsl`
    precision mediump float;
 
    varying vec2 vUv;
    varying float vWave;

    uniform float uTime;

    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);

    void main() {
      vUv = uv;

      vec3 pos = position;
      float noiseFreq = 1.0;
      float noiseAmp = 1.4;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime/5.0, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;
      vWave = pos.z;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);  
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vWave;

    void main() {
      float wave = -tan(vWave * 0.4)*2.0;
      vec3 texture = texture2D(uTexture, vUv + wave).rgb;
      gl_FragColor = vec4(texture, 1.0); 
    }
  `
);

extend({ WaveShaderMaterial });


const Wave = () => {
  const ref = useRef();
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()));

  const [image] = useLoader(THREE.TextureLoader, [
    "https://images.unsplash.com/photo-1666708332483-ef46c185c917?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
  ]);

  return (
    <mesh>
      <boxBufferGeometry args={[60, 50, 50, 50]}  />
      <waveShaderMaterial side={THREE.DoubleSide} uColor={"hotpink"} ref={ref} uTexture={image} />
    </mesh>
  );
};



export function Model(props) {
  const { nodes, materials } = useGLTF('/dpm.glb')
  return (
    <group {...props} dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Beard" geometry={nodes.Wolf3D_Beard.geometry} material={materials.Wolf3D_Beard} skeleton={nodes.Wolf3D_Beard.skeleton} morphTargetDictionary={nodes.Wolf3D_Beard.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Beard.morphTargetInfluences} />
    </group>
  )
}

export function City(props) {
  const { nodes, materials } = useGLTF('/city-gold.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.blocks.geometry} material={nodes.blocks.material} position={[0.33, 0.48, -0.08]} scale={0.35} />
      <mesh geometry={nodes.buildings.geometry} material={materials['Material.002']} position={[0.33, 0.48, -0.08]} scale={0.35} />
      <mesh geometry={nodes.coastline.geometry} material={nodes.coastline.material} position={[0.33, 0.48, -0.08]} scale={0.35} />
      <mesh geometry={nodes.domain.geometry} material={materials['Full Road Texture']} position={[0.33, 0.48, -0.08]} scale={0.35} />
      <mesh geometry={nodes.river.geometry} material={nodes.river.material} position={[0.33, 0.48, -0.08]} scale={0.35} />
      <mesh geometry={nodes.roads.geometry} material={nodes.roads.material} position={[0.33, 0.48, -0.08]} scale={0.35} />
      <mesh geometry={nodes.sea.geometry} material={nodes.sea.material} position={[0.33, 0.48, -0.08]} scale={0.35} />
    </group>
  )
}


export default function App() {
  return (
    <Canvas style={{backgroundColor: "gray" , display: "block" , height: "100vh", width: "100vw"}} >
      <ambientLight intensity={1.5} />
        <Wave />
     <City />
        <OrbitControls />
        
        {/* <Model position={[0.3, -13.5, 0]} scale={8} /> */}
      </Canvas>
  );
}