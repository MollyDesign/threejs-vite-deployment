import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let renderer, camera, scene, light, meshes;
let axesHelper;
let controls;

initRenderer();
initCamera();
initScene();

initLight();
initAxesHelper();
initControls();

render();


window.addEventListener('resize', function(){//渲染结果随着窗体的变化而变化（浏览器变窄了，渲染窗口也变窄）
    camera.aspect = window.innerWidth/this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, this.window.innerHeight);
})


/* ------------------场景三要素初始化------------------- */
function initRenderer() {
    renderer = new THREE.WebGL1Renderer();
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initCamera(){
    camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(10,10,10);
    camera.lookAt(0,0,0);
}

function initScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x888888);
}
/* ------------------场景三要素初始化------------------- */

function initLight(){
    light = new THREE.HemisphereLight(0xffffff, 0x888888);
    light.position.set(0, 1, 0);
    scene.add(light);
}

function initAxesHelper(){
    axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);
}

function initControls(){
    controls = new OrbitControls(camera, renderer.domElement);
}


function render(){
    requestAnimationFrame( render );
    renderer.render(scene,camera);
}
