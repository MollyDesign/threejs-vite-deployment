import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let renderer, camera, scene, light, meshes;
let axesHelper;
let controls;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(1, 1);

let amount = 3;
let count = Math.pow(amount, 3);//总数
let colored = 0;

let color = new THREE.Color();
let white = new THREE.Color().setHex(0xffffff);

initRenderer();
initCamera();

scene = new THREE.Scene();

initLight();
initAxesHelper();
controls = new OrbitControls(camera, renderer.domElement);

initMeshes();

render();


window.addEventListener('resize', function(){//渲染结果随着窗体的变化而变化（浏览器变窄了，渲染窗口也变窄）
    camera.aspect = window.innerWidth/this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, this.window.innerHeight);
})

document.addEventListener('mousemove', function( event ){
    mouse.x = (event.clientX/window.innerWidth) * 2 - 1;  // 把鼠标位置归一化处理：-1~1
    mouse.y = - (event.clientY/window.innerHeight) * 2 + 1 +0.05;
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

function initMeshes(){
    const geometry = new THREE.IcosahedronGeometry(0.5, 3);
    const material = new THREE.MeshPhongMaterial({color:0xffffff});
    meshes = new THREE.InstancedMesh(geometry, material, count);

    let index = 0;
    const offset = (amount-1)/2;
    const matrix = new THREE.Matrix4();

    for(let i=0;i<amount;i++){
        for(let j=0;j<amount;j++){
            for(let k=0;k<amount;k++){
                matrix.setPosition(offset - i, offset - j, offset - k);
                meshes.setMatrixAt(index, matrix);
                meshes.setColorAt(index, white);
                index = index + 1;
            }
        }
    }
    scene.add(meshes);
}


function render(){
    requestAnimationFrame( render );

    raycaster.setFromCamera(mouse, camera);
    
    const intersection = raycaster.intersectObject(meshes);//物体和鼠标的交集
    if (intersection.length > 0){
        const instanceId = intersection[0].instanceId; //记录相交的第一个物体的ID
        meshes.getColorAt(instanceId, color);
        if (color.equals(white)){
            meshes.setColorAt(instanceId, color.setHex (Math.random() * 0xffffff));
            meshes.instanceColor.needsUpdate = true;
            colored = colored + 1;
        }
    }
    //console.log(intersection.length);
    document.querySelector('div.status').innerHTML = colored + '/' + count;
    renderer.render(scene,camera);
} 
