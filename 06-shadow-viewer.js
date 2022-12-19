import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js'

let renderer, camera, scene, light, meshes;
let axesHelper;
let controls;
let dirLight, spotLight;
let ground,  torusKnot, cube;
let clock = new THREE.Clock();
let dirLightShadowMapViewer, spotLightShadowMapViewer;

initRenderer();
initCamera();
initScene();

initLights();
initMeshes();

initAxesHelper();
initShadowMapViewer();
initControls();
enableShadow();
initCameraHelper();
render();


window.addEventListener('resize', function(){//渲染结果随着窗体的变化而变化（浏览器变窄了，渲染窗口也变窄）
    camera.aspect = window.innerWidth/this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, this.window.innerHeight);

    resizeShadowMapViewer();
    dirLightShadowMapViewer.updateForWindowResize();
    spotLightShadowMapViewer.updateForWindowResize();
})


/* ------------------场景三要素初始化------------------- */
function initRenderer() {
    renderer = new THREE.WebGL1Renderer();
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initCamera(){
    camera = new THREE.PerspectiveCamera(65,window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 35);
}

function initScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);  //  背景色
}
/* ------------------场景三要素初始化------------------- */

function initLights(){
    /* ambient Light */
    scene.add(new THREE.AmbientLight(0x404040));

    /* spot Light */
    spotLight= new THREE.SpotLight(0xffffff);
    spotLight.name = 'Spot light';
    spotLight.angle = Math.PI/5;
    spotLight.penumbra = 0.3;
    spotLight.position.set(10, 10, 5);
    scene.add(spotLight);

     /* dir Light */
     dirLight = new THREE.DirectionalLight(0xffffff, 1);
     dirLight.name='Dir light';
     dirLight.position.set(0, 10, 0);
     scene.add(dirLight);


}

function initMeshes(){
    /* torus */
    let geometry = new THREE.TorusKnotGeometry(25, 8, 100, 20);
    let material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shininess: 150,  //镜面反射的能力
        specular: 0x222222
    });
    torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.scale.multiplyScalar(1/18);
    torusKnot.position.y = 3;
    scene.add(torusKnot);

    /* cube */
    geometry = new THREE.BoxGeometry(3, 3, 3);
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(8, 3, 8);
    scene.add(cube);

    /* ground */
    geometry = new THREE.BoxGeometry(10, 0.15, 10);
    material = new THREE.MeshPhongMaterial({
        color:0xa0adaf,
        shininess: 150,
        specular: 0x111111
    });
    ground = new THREE.Mesh(geometry,material);
    ground.scale.multiplyScalar( 3 );
    scene.add(ground);

}

function initAxesHelper(){
    axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
}

function enableShadow(){//影子
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    spotLight.castShadow = true;
    dirLight.castShadow = true;

    torusKnot.castShadow = true;
    torusKnot.receiveShadow = true;

    cube.castShadow = true;
    cube.receiveShadow = true;

    ground.castShadow = false;
    ground.receiveShadow = true;
}

function initCameraHelper(){
    spotLight.shadow.camera.near = 8;
    spotLight.shadow.camera.far = 30;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(new THREE.CameraHelper(spotLight.shadow.camera));

    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 10;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    scene.add(new THREE.CameraHelper(dirLight.shadow.camera));
}

function initShadowMapViewer(){
    dirLightShadowMapViewer = new ShadowMapViewer( dirLight );
    spotLightShadowMapViewer = new ShadowMapViewer( spotLight );
    resizeShadowMapViewer();
}

function resizeShadowMapViewer(){
    const size = window.innerWidth * 0.2;
    dirLightShadowMapViewer.position.x = 10;
    dirLightShadowMapViewer.position.y = 10;
    dirLightShadowMapViewer.size.width = size;
    dirLightShadowMapViewer.size.height = size;
    dirLightShadowMapViewer.update();

    spotLightShadowMapViewer.size.set(size,size);
    spotLightShadowMapViewer.position.set(size + 20, 10);//用set自动调用update


}

function initControls(){
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);// 沿着（0，1，0）旋转
    controls.update();
}


function render(){
    requestAnimationFrame( render );

    const delta = clock.getDelta();
    renderer.render(scene,camera);

     /* 旋转 */
    torusKnot.rotation.x += 0.25 * delta;
    torusKnot.rotation.y += 2 * delta;
    torusKnot.rotation.z += 1 * delta;

    cube.rotation.x += 0.25 * delta;
    cube.rotation.y += 2 * delta;
    cube.rotation.z += 1 * delta;
    
    dirLightShadowMapViewer.render(renderer);
    spotLightShadowMapViewer.render(renderer);

}
