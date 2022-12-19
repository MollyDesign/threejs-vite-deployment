import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import { OimoPhysics } from 'three/examples/jsm/physics/OimoPhysics';


let renderer, camera, scene;
let axesHelper;
let hesLight, dirLight;
let floor, boxes, shperes;
let controls;
let physics;

let position = new THREE.Matrix3;

initRenderer();
initCamera();
initScene();

initMeshes();
initLight();
initAxesHelper();
initControls();

enableShadow();// ！！！要放到添加灯光和物体下面！！！
await enablePhysics();

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

    renderer.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(renderer.domElement);
}

function initCamera(){
    camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(2,4,4);//设置视角
    camera.lookAt(0,0,0);
}

function initScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x888888);
}
/* ------------------场景三要素初始化------------------- */


function initAxesHelper(){
    axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);
}

function initLight(){
    /* 环境光 */
    hesLight = new THREE.HemisphereLight(); //白光  路灯  点光源
    //hesLight = new THREE.AmbientLight();
    hesLight.intensity = 0.3;
    scene.add(hesLight);

    /* 平行光 */
    dirLight = new THREE.DirectionalLight(); // 太阳光  在无穷远处发出来的
    dirLight.position.set(5, 5, -5);
    scene.add(dirLight);
}

function initMeshes(){
    //floor
    floor = new THREE.Mesh(
        new THREE.BoxGeometry(10, 1, 10),
        new THREE.ShadowMaterial({color: 0x111111}) //影子的颜色
    );
    floor.position.set(0, -1, 0);
    scene.add(floor);

    //boxes
    boxes = new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshLambertMaterial(),  //如木头，镜面反差色
        100
    );

    boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);//看不太出来效果，性能更好

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    for (let i=0; i<boxes.count;i++){
        matrix.setPosition(
            Math.random() - 0.5, //x: -0.5 ~ 0.5
            Math.random() * 2,   //y: 0 ~ 2
            Math.random() - 0.); //z: -0.5 ~ 0.5
        boxes.setMatrixAt(i, matrix);
        boxes.setColorAt(i, color.setHex(Math.random()*0xffffff));
    }
    scene.add(boxes);

    //spheres
    shperes = new THREE.InstancedMesh(
        new THREE.IcosahedronGeometry(0.075, 3),
        new THREE.MeshLambertMaterial(),  //如木头，镜面反差色
        100
    );
    shperes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);//看不太出来效果，性能更好
   
    for (let i=0; i<shperes.count;i++){
        matrix.setPosition(
            Math.random() - 0.5, //x: -0.5 ~ 0.5
            Math.random() * 2,   //y: 0 ~ 2
            Math.random() - 0.); //z: -0.5 ~ 0.5
        shperes.setMatrixAt(i, matrix);
        shperes.setColorAt(i, color.setHex(Math.random()*0xffffff));
    }
    scene.add(shperes);
}

async function enablePhysics(){
    physics = await OimoPhysics();
    physics.addMesh(floor);
    physics.addMesh(boxes, 1);
    physics.addMesh(shperes,1);
}


function initControls(){
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.y = 1;
    controls.update();
}


function enableShadow(){
    renderer.shadowMap.enabled = true;//渲染器渲染出来
    boxes.castShadow = true;//物体
    //dirLight.shadow.camera.zoom = 6;
    boxes.receiveShadow = true;
    floor.receiveShadow = true;//平面接收
    dirLight.castShadow = true;//光
    
}


function render(){
    requestAnimationFrame( render );//实时渲染

    let index = Math.floor(Math.random() * boxes.count);
    position.set(0, Math.random() + 1, 0);
    physics.setMeshPosition(boxes, position, index);

    index = Math.floor(Math.random() * boxes.count);
    position.set(0, Math.random() + 1, 0);
    physics.setMeshPosition(shperes, position, index);
    
    renderer.render(scene,camera);
}
