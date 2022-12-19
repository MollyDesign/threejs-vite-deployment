import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import { AmbientLight } from 'three';


let renderer, camera, scene;
let axesHelper;
let ambientLight, spotLight;
let plane, cylinder;
let controls;

initRenderer();
initCamera();
initScene();
//initAxesHelper();
initControls();

initAmbientlisLight();
initSpotLight();

initMeshes();

initShadow();

render();

window.addEventListener('resize', function(){//渲染结果随着窗体的变化而变化（浏览器变窄了，渲染窗口也变窄）
    camera.aspect = window.innerWidth/this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer,setSize(window.innerWidth, this.window.innerHeight);
})



function initRenderer() {
    renderer = new THREE.WebGL1Renderer();
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initCamera(){
    camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0,120,200);
    camera.lookAt(0,0,0);
}

function initScene(){
    scene = new THREE.Scene();
}

function initAxesHelper(){
    axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);
}


function initAmbientlisLight(){//背景灯
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

}

function initSpotLight(){//聚光灯
    spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(-10, 80, 0);
    spotLight.angle = Math.PI/6;
    spotLight.penumbra = 0.4;
    scene.add(spotLight);
}

function initMeshes(){
    //创建平面
    const geometryPlane = new THREE.PlaneGeometry(2000, 2000);
    const materialPlane = new THREE.MeshPhongMaterial({color:0x808080});
    plane = new THREE.Mesh(geometryPlane, materialPlane);
    plane.rotation.x = -Math.PI/2;
    plane.position.set(0,-10,0);
    scene.add(plane);

    //创建圆柱体
    const geometryCylinder = new THREE.CylinderGeometry(5, 5, 2, 24, 1, false);
    const materialCylinder = new THREE.MeshPhongMaterial({color:0x8080ff});
    cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
    cylinder.position.set(0,10,0);
    scene.add(cylinder);

}

function initControls(){//控制器可用鼠标旋转
    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change',render);
}

function initShadow(){//创建物体投影
    cylinder.castShadow = true;//物体
    plane.receiveShadow = true;//平面接收
    spotLight.castShadow = true;//光
    renderer.shadowMap.enabled = true;//渲染器渲染出来
}

function render(){
    renderer.render(scene,camera);
}

