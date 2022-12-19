import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/pointerlockcontrols';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

let renderer, camera, scene, light, meshes;
let mixer,mixer2;
let control;
let plane, model,model1;
let dirLight;
let clock = new THREE.Clock();
let axesHelper;
let controls;

initRenderer();
initCamera();
initScene();
 
initLight();
initMeshes();

enableShadow();

initAxesHelper();
initControls();
animation()


window.addEventListener('resize', function(){//渲染结果随着窗体的变化而变化（浏览器变窄了，渲染窗口也变窄）
    camera.aspect = window.innerWidth/this.window.innerHeight;
    //camera.updateProjectionMatrix();
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
    camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(1, 2, -6);
    camera.lookAt(0,1,0);
}

function initScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x888888);
    //scene.fog= new THREE.Fog(0xa0a0a0, 10, 50);//场景虚化
    scene.scale.set(3,3,3);
}
/* ------------------场景三要素初始化------------------- */



/* ------------------灯光------------------- */
function initLight(){
    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 1, 0);
    scene.add(light);
    dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-3, 10, 10);
    scene.add(dirLight);
}
/* ------------------灯光------------------- */



/* ------------------加载3维模型------------------- */
function initMeshes(){
    //plane
    plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({
        color:0x999999
    })
    );
    plane.rotation.x = - Math.PI / 2;
    plane.position.set(0,0,0);
    plane.scale.set(1,1,1);
    scene.add(plane);

    //model
    

    const loader = new GLTFLoader();

    loader.load('models/gltb/Soldier.glb',function(gltf){
        model1=gltf.scene;
        scene.add(model1);

        
        model1.traverse( function(object){ 
            // console.log(object.type);
            
            if(object.isMesh){
                //console.log(object);
                object.castShadow = true;
            }   
        })
        model1.scale.set(0.5,0.5,0.5);
        //controls.target=model.position;

        //让模型动起来
        const clip = gltf.animations[0];
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(clip);
        action.play();
        console.log(gltf);

        render();
    });

    loader.load('models/gltb/library.glb',function(gltf){
        model=gltf.scene;
        scene.add(model);

        
        model.traverse( function(object){ 
            // console.log(object.type);
            
            if(object.isMesh){
                //console.log(object);
                object.castShadow = true;
            }   
        })
        model.scale.set(1,1,1);
        model.position.set(0,0.3,-2)
        //model.scale.set(0.01,0.01,0.01);

        //让模型动起来
        const clip2 = gltf.animations[0];
        mixer2 = new THREE.AnimationMixer(gltf.scene);
        const action1 = mixer2.clipAction(clip2);
        action1.play();
        console.log(gltf);

        render();
    });

    loader.load('models/gltb/cylinder.glb',function(gltf){
        model=gltf.scene;
        scene.add(model);

        
        model.traverse( function(object){ 
            // console.log(object.type);
            
            if(object.isMesh){
                //console.log(object);
                object.castShadow = true;
            }   
        })
        model.scale.set(0.5,0.5,0.5);
        model.position.set(0,3,-2)
        //model.scale.set(0.01,0.01,0.01);

        //让模型动起来
        
    });



}
    
/* ------------------加载3维模型------------------- */




/* ------------------坐标轴------------------- */
function initAxesHelper(){
    axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);
}
/* ------------------坐标轴------------------- */




/* ------------------阴影------------------- */
function enableShadow(){
    renderer.shadowMap.enabled = true;
    dirLight.castShadow = true;
    plane.receiveShadow = true; 


};
/* ------------------阴影------------------- */



/* ------------------控制器------------------- */
function initControls(){
    //controls = new OrbitControls(camera, renderer.domElement);
    //controls.autoRotate=true;
    controls=new PointerLockControls(camera,renderer.domElement);
    //controls.target.set(0, 1, 0);
    controls.update();
    window.addEventListener("click",function(e){
        console.log("pointer is lock")
        controls.lock();
    })

    window.addEventListener("keydown",function(e){
        /*switch(e.code){
            case "KeyA":
                controls.moveRight(-1)
                break;
            case "KeyW":
                controls.moveForward(1)
                break;
            case "KeyS":
                controls.moveForward(-1)
                break;
            case "KeyD":
                controls.moveRight(1)
                break;
        }*/
        keyDownWalk(e)
    })
}
/* ------------------控制器------------------- */



/* ------------------渲染器------------------- */
function render(){

    let delta = clock.getDelta();
    requestAnimationFrame( render );
    renderer.render(scene,camera);

    mixer.update(delta);
    //mixer2.update(delta);
}

function render2(){

    let delta = clock.getDelta();
    requestAnimationFrame( render );
    renderer.render(scene,camera);

    //mixer2.update(delta);
}
/* ------------------渲染器------------------- */

function animation() {
    requestAnimationFrame(animation)
    renderer.render(scene,camera)
    //controls.update()
}


function keyDownWalk(e) {
    let keyCode = e.keyCode;
    let position = model1.position, rotation = model1.rotation.y;
    //model1.rotation=controls.rotation;
    //rotation=this.controls.rotation.y;
    switch (keyCode) {

        
        case 87:        //w
            position.x += 0.02 * Math.cos(rotation);
            position.z += 0.02 * Math.sin(-rotation);
            break;
        case 65:        //a
            position.x += 0.02 * Math.cos(rotation + Math.PI/2);
            position.z += 0.02 * Math.sin(-rotation - Math.PI/2);
            break;
        case 68:        //d
            position.x += 0.02 * Math.cos(rotation - Math.PI/2);
            position.z += 0.02 * Math.sin(-rotation + Math.PI/2);
            break;
        case 83:        //s
            position.x -= 0.02 * Math.cos(rotation);
            position.z -= 0.02 * Math.sin(-rotation);
            break;
        default:
            break;
    }
}

