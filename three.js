import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(0, 1, 10);

const loader = new GLTFLoader();
loader.load('3dpea.glb', function (gltf) {
  scene.add(gltf.scene);
});

loader.load('poly.glb', function (gltf) {
	const polyModel = gltf.scene;
	scene.add(polyModel);
	polyModel.scale.set(100, 100, 100);

	// Move the poly model to the right
	polyModel.position.x = 305;
  });

const light1 = new THREE.PointLight(0xffffff, 20, 100);
light1.position.set(50, 30, 50);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 10, 100);
light2.position.set(-50, 30, 50);
scene.add(light2);

const light3 = new THREE.PointLight(0xffffff, 2, 100);
light3.position.set(0, 30, -5);
scene.add(light3);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const controls = new OrbitControls(camera, canvas);

// Load a font for the text
const fontLoader = new FontLoader();
fontLoader.load('helvetiker_regular.typeface.json', function (font) {
  // Create 3D text geometry
  const textGeometry = new TextGeometry('Hello, Three.js!', {
    font: font,
    size: 1,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  // Create material for the text
  const textMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

  // Create mesh with the text geometry and material
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Position the text in the scene
  textMesh.position.set(-5, 0, 0);

  // Add the text mesh to the scene
  scene.add(textMesh);

  // Create a div for the text box
  const textBox = document.createElement('div');
  textBox.id = 'text-box';
  textBox.innerText = 'Hello, Vite App!';
  document.body.appendChild(textBox);

  // Function to update the position of the text box in 3D space
  function updateTextBoxPosition() {
    const position = new THREE.Vector3();
    position.setFromMatrixPosition(camera.matrixWorld);
    position.project(camera);

    const widthHalf = canvas.clientWidth / 2;
    const heightHalf = canvas.clientHeight / 2;

    position.x = position.x * widthHalf + widthHalf + window.innerWidth / 20;
    position.y = -(position.y * heightHalf) + heightHalf - window.innerHeight / 20;

    textBox.style.transform = `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`;
  }

  // Event listener for window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateTextBoxPosition();
  });

  // Update text box position initially
  updateTextBoxPosition();
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
