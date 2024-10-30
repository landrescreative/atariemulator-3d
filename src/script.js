import "./style.css";
import Experience from "./Game/Experience.js";

const experience = new Experience(document.querySelector("canvas.webgl"));
experience.start();
