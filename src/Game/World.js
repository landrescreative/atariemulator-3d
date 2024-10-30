import Experience from "./Experience.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.setGLTF();
  }

  setGLTF() {
    this.loader = new GLTFLoader();
    this.loader.load(
      "/models/cozyscene.glb",
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.metalness = 0;
            child.material.roughness = 1;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.model = gltf.scene;
        this.model.position.set(0, 0, 0);
        this.experience.scene.add(this.model);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }
}
