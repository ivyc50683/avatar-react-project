import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from 'three'; // To use Vector3 and Euler for rotations

// Simulate movement coordinates for hands, arms, and fingers
function getHumanLikeCoordinates() {
  return {
    x: Math.sin(Math.random() * Math.PI) * 0.2,  // Simulate side-to-side motion
    y: Math.sin(Math.random() * Math.PI) * 0.2,  // Simulate up-down motion
    z: Math.cos(Math.random() * Math.PI) * 0.1,  // Subtle forward-backward motion
  };
}

// Simulate rotations for hands and arms
function getHumanLikeRotation() {
  return {
    x: Math.random() * 10 - 5,  // Small pitch rotation for realistic bending
    y: Math.random() * 10 - 5,  // Small yaw rotation for natural turning
    z: Math.random() * 5 - 2,   // Slight roll for realistic wrist movement
  };
}

function Avatar() {
  const [coordinates, setCoordinates] = useState({
    leftHand: { x: 0, y: 0, z: 0, rotation: { x: 0, y: 0, z: 0 } },
    rightHand: { x: 0, y: 0, z: 0, rotation: { x: 0, y: 0, z: 0 } },
    leftArm: { x: 0, y: 0, z: 0, rotation: { x: 0, y: 0, z: 0 } },
    rightArm: { x: 0, y: 0, z: 0, rotation: { x: 0, y: 0, z: 0 } },
  });
  const gltf = useLoader(GLTFLoader, "/avatar.glb");

  useEffect(() => {
    const interval = setInterval(() => {
      const leftHandCoords = getHumanLikeCoordinates();
      const rightHandCoords = getHumanLikeCoordinates();
      const leftArmCoords = getHumanLikeCoordinates();
      const rightArmCoords = getHumanLikeCoordinates();

      const leftHandRotation = getHumanLikeRotation();
      const rightHandRotation = getHumanLikeRotation();
      const leftArmRotation = getHumanLikeRotation();
      const rightArmRotation = getHumanLikeRotation();

      setCoordinates({
        leftHand: { ...leftHandCoords, rotation: leftHandRotation },
        rightHand: { ...rightHandCoords, rotation: rightHandRotation },
        leftArm: { ...leftArmCoords, rotation: leftArmRotation },
        rightArm: { ...rightArmCoords, rotation: rightArmRotation },
      });
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  useEffect(() => {
    if (gltf && gltf.scene) {
      const leftHand = gltf.scene.getObjectByName("LeftHand");
      const rightHand = gltf.scene.getObjectByName("RightHand");
      const leftArm = gltf.scene.getObjectByName("LeftArm");
      const rightArm = gltf.scene.getObjectByName("RightArm");

      if (leftHand) {
        leftHand.position.set(
          coordinates.leftHand.x,
          coordinates.leftHand.y,
          coordinates.leftHand.z
        );
        leftHand.rotation.set(
          THREE.MathUtils.degToRad(coordinates.leftHand.rotation.x),
          THREE.MathUtils.degToRad(coordinates.leftHand.rotation.y),
          THREE.MathUtils.degToRad(coordinates.leftHand.rotation.z)
        );
      }

      if (rightHand) {
        rightHand.position.set(
          coordinates.rightHand.x,
          coordinates.rightHand.y,
          coordinates.rightHand.z
        );
        rightHand.rotation.set(
          THREE.MathUtils.degToRad(coordinates.rightHand.rotation.x),
          THREE.MathUtils.degToRad(coordinates.rightHand.rotation.y),
          THREE.MathUtils.degToRad(coordinates.rightHand.rotation.z)
        );
      }

      if (leftArm) {
        leftArm.position.set(
          coordinates.leftArm.x,
          coordinates.leftArm.y,
          coordinates.leftArm.z
        );
        leftArm.rotation.set(
          THREE.MathUtils.degToRad(coordinates.leftArm.rotation.x),
          THREE.MathUtils.degToRad(coordinates.leftArm.rotation.y),
          THREE.MathUtils.degToRad(coordinates.leftArm.rotation.z)
        );
      }

      if (rightArm) {
        rightArm.position.set(
          coordinates.rightArm.x,
          coordinates.rightArm.y,
          coordinates.rightArm.z
        );
        rightArm.rotation.set(
          THREE.MathUtils.degToRad(coordinates.rightArm.rotation.x),
          THREE.MathUtils.degToRad(coordinates.rightArm.rotation.y),
          THREE.MathUtils.degToRad(coordinates.rightArm.rotation.z)
        );
      }

      // Adjust avatar's position
      const avatarHeight = 6; // Adjust based on the avatar's height
      gltf.scene.position.set(0, -avatarHeight / 4, 0.2); // Move avatar up to hide the lower body
    }
  }, [coordinates, gltf]);

  return (
    <primitive object={gltf.scene} scale={1.5} />
  );
}

function App() {
  return (
    <Canvas
      camera={{
        position: [0, 1.5, 3],
        fov: 50,
        near: 0.1,
        far: 1000,
      }} 
      style={{ height: "100vh", width: "100vw" }}
    >
      {/* / Add lighting and camera controls */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />

      <Suspense fallback={null}>
        <Avatar />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}

export default App;
