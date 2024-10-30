import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";

export default class CSSTest {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.renderer2 = new CSS3DRenderer();
    this.renderer2.setSize(window.innerWidth, window.innerHeight);
    this.renderer2.domElement.style.position = "absolute";
    this.renderer2.domElement.style.top = 0;
    this.renderer2.domElement.style.zIndex = 0;
    document.body.appendChild(this.renderer2.domElement);
  }

  update() {
    this.renderer2.render(this.scene, this.camera);
  }
}
