import * as THREE from "three";
import World from "./World.js";
import Controls from "./Controls.js";
import Stats from "stats.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";

let instance = null;

export default class Experience {
  constructor(_canvas) {
    if (instance) return instance;
    instance = this;

    this.camera = this.setCamera();
    this.canvas = _canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.world = new World();
    this.fpsCamera = new Controls(this.camera, this.scene);
    this.init();
  }

  init() {
    this.setRenderer();
    this.setLights();
    this.update();
    this.setStats();
    this.setCSS3DRenderer();
    this.addIframe();
    this.initDragAndDrop();
    this.setPostProcessing();
  }

  setLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00159c, 1);
    directionalLight.position.set(0, 5, 5);
    // this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00159c, 1);
    pointLight.castShadow = true;

    pointLight.shadow.bias = -0.001;
    pointLight.position.set(2.4, 1.65, -3.5);
    gsap.to(pointLight.position, {
      duration: 0.4,
      x: 2.4,
      y: 1.65,
      z: -3.6,
      yoyo: true,
      repeat: -1,
    });

    this.scene.add(pointLight);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.update();
  }

  setStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    this.stats.showPanel(0);

    return this.stats;
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(2, 1.5, -3);

    return this.camera;
  }

  setHelpers() {
    this.scene.add(new THREE.AxesHelper(20));
    this.scene.add(new THREE.GridHelper(100, 100));
  }

  setCSS3DRenderer() {
    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize(this.width, this.height);
    this.cssRenderer.domElement.style.position = "absolute";
    this.cssRenderer.domElement.style.top = 0;
    this.cssRenderer.domElement.style.pointerEvents = "none";

    this.cssRenderer.backgroundColor = "white";

    document.body.appendChild(this.cssRenderer.domElement);
  }

  addIframe() {
    // Crear el contenedor del juego
    const htmlContainer = document.createElement("div");
    htmlContainer.style.width = "800px";
    htmlContainer.style.height = "600px";
    htmlContainer.style.maxWidth = "100%";

    const gameDiv = document.createElement("div");
    gameDiv.id = "game";
    htmlContainer.appendChild(gameDiv);

    const cssObject = new CSS3DObject(htmlContainer);
    cssObject.scale.set(0.0013, 0.0013, 0.0013); // Escalar el contenido HTML
    cssObject.position.set(2.4, 1.65, -4.5); // Ajusta la posición del contenido HTML en la escena
    this.scene.add(cssObject);

    // Agregar los scripts necesarios para el emulador
    const ejsScript1 = document.createElement("script");
    ejsScript1.innerHTML = `
      EJS_player = "#game";
      EJS_core = "atari2600";  // Reemplaza "CORE_NAME" con el nombre del núcleo correcto
      EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
      EJS_gameUrl = "https://allancoding-website-files.on.drv.tw/ROM_FILE_NAME_&_PATH.zip";  // Reemplaza con la URL del archivo ROM
    `;

    const ejsScript2 = document.createElement("script");
    ejsScript2.src = "https://cdn.emulatorjs.org/stable/data/loader.js";

    document.body.appendChild(ejsScript1);
    document.body.appendChild(ejsScript2);
  }

  initDragAndDrop() {
    const dropArea = document.body;

    dropArea.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    });

    dropArea.addEventListener("drop", (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          const blob = new Blob([arrayBuffer], { type: "application/zip" });
          const url = URL.createObjectURL(blob);
          this.loadGame(url);
        };
        reader.readAsArrayBuffer(file);
      }
    });
  }

  // Método para cargar el juego con el nuevo URL
  loadGame(url) {
    const gameDiv = document.getElementById("game");
    if (gameDiv) {
      gameDiv.innerHTML = ""; // Limpiar cualquier contenido previo
    }

    const ejsScript1 = document.createElement("script");
    ejsScript1.innerHTML = `
        EJS_player = "#game";
        EJS_core = "atari2600";  // Reemplaza "CORE_NAME" con el nombre del núcleo correcto
        EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
        EJS_gameUrl = "${url}";
    `;

    const ejsScript2 = document.createElement("script");
    ejsScript2.src = "https://cdn.emulatorjs.org/stable/data/loader.js";

    document.body.appendChild(ejsScript1);
    document.body.appendChild(ejsScript2);

    // Simular un clic en el botón de reproducción
    setTimeout(() => {
      const playButton = document.getElementsByClassName("ejs_start_button")[0];
      if (playButton) {
        playButton.click();
      }
    }, 1000);
  }

  setPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    this.filmPass = new FilmPass(0.7, 0.025, 648, false);
    // this.composer.addPass(this.filmPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      2,
      0.4,
      0.65
    );
    this.composer.addPass(this.bloomPass);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderer.setSize(this.width, this.height);

    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
    if (this.cssRenderer) {
      this.cssRenderer.render(this.scene, this.camera);
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setClearColor(0x000000, 1);
  }

  update() {
    window.requestAnimationFrame(this.update.bind(this));
    this.fpsCamera.update();
    this.renderer.render(this.scene, this.camera);
    if (this.cssRenderer) {
      this.cssRenderer.render(this.scene, this.camera);
    }
    this.stats && this.stats.update();

    this.composer && this.composer.render();
    this.resize();
  }
}
