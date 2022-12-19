import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Water } from 'three/examples/jsm/objects/Water';
//import waterTexture from 'images/waternormals.jpg';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
const waterTexture = document.getElementById("img-material")
const lensflareTexture0 = document.getElementById("img-material-1")
const lensflareTexture1 = document.getElementById("img-material-2")
import { Sky } from 'three/examples/jsm/objects/Sky';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
let renderer, camera, scene, light, meshes;
let mixer,mixer2,mixer3;
let plane, model;
let model1;
let pointLight,ambientLight,dirLight;
let spotLight, lightHelper;
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


window.addEventListener('resize', function(){//渲染结果随着窗体的变化而变化（浏览器变窄了，渲染窗口也变窄）
    camera.aspect = window.innerWidth/this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, this.window.innerHeight);
})


/* ------------------场景三要素初始化------------------- */
function initRenderer() {
    renderer = new THREE.WebGL1Renderer({ alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);
}

function initCamera(){
    camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(100,100,50);
    camera.lookAt(100,300,300);
}

function initScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
}
/* ------------------场景三要素初始化------------------- */



/* ------------------灯光------------------- */
function initLight(){
    // light = new THREE.HemisphereLight(0xffffff, 0x444444);
    // light.position.set(0, 1, 0);
    // scene.add(light);
    // dirLight = new THREE.DirectionalLight(0xffffff);
    // dirLight.position.set(-3, 10, 10);
    // scene.add(dirLight);

    ambientLight = new THREE.AmbientLight(0xffffff, .8);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(.1, 1, .95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    // 太阳点光源
    pointLight = new THREE.PointLight(0xffffff, 1.2, 2000);
    pointLight.color.setHSL(.995, .5, .9);
    pointLight.position.set(0, 45, -2000);
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load(lensflareTexture0);
    const textureFlare1 = textureLoader.load(lensflareTexture1);
    // 镜头光晕
    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement( textureFlare0, 600, 0, pointLight.color));
    lensflare.addElement(new LensflareElement( textureFlare1, 60, .6));
    lensflare.addElement(new LensflareElement( textureFlare1, 70, .7));
    lensflare.addElement(new LensflareElement( textureFlare1, 120, .9));
    lensflare.addElement(new LensflareElement( textureFlare1, 70, 1));
    pointLight.add(lensflare);
    scene.add(pointLight);

    //灯塔光
    spotLight = new THREE.SpotLight( 0xffff00 );
    //灯塔坐标  -10,8,50
    spotLight.position.set( -10, 40, 50 );
    spotLight.intensity = 10;
    spotLight.angle = 0.3;
    spotLight.penumbra = 0.2;
    spotLight.decay = 1;
    spotLight.distance = 200;
    
    //spotLight.target.position.set(200, 5, 0);
    //spotLight.target = plane;
    //spotLight.target.updateMatrixWorld();

    //spotLight.rotateZ(Math.PI / 2);
    //spotLight.map = textures[ 'disturb.jpg' ];

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.focus = 1;
    scene.add( spotLight );

    lightHelper = new THREE.SpotLightHelper( spotLight );
    scene.add( lightHelper );

}
/* ------------------灯光------------------- */



/* ------------------加载3维模型------------------- */
function initMeshes(){
    //plane
    plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5000, 5000),
    new THREE.MeshPhongMaterial({
        color:0x999999,
        transparent: true
    })
    );
    plane.rotation.x = - Math.PI / 2;
    //scene.add(plane);

    //model
    // const island_loader = new GLTFLoader();
    // island_loader.name = "island_loader";
    // island_loader.load('models/gltb/noseanopharos.glb',function(gltf){
    //      model = gltf.scene;
    //      scene.add(model);
    //      model.position.set(0, 4, 0);
    //      model.rotation.y = - 10;
    //      gltf.scene.traverse( function(object){ 
    //          // console.log(object.type);
            
    //          if(object.isMesh){
    //              //console.log(object);
    //              //object.castShadow = true;
    //              object.material.roughness = .6;
    //          }   
    //      })

    //      model.scale.set(1.5,1.5,1.5);
    //      //模型放大

    //      render();
    //  });

    //灯塔
    const lighthouse_loader = new GLTFLoader();
    lighthouse_loader.load('models/gltb/pharos.glb',function(gltf){
        model = gltf.scene;
        scene.add(model);
        model.position.set(-10, 8, 50);
        model.rotation.y = 60;
        gltf.scene.traverse( function(object){ 
            // console.log(object.type);
            
            if(object.isMesh){
                //console.log(object);
                //object.castShadow = true;
                object.material.roughness = .6;
            }   
        })

        model.scale.set(2,2,2);
        console.log(model)
        //模型放大

        render();
    });
    //console.log(loader);

    //二号小岛
    const island_loader_2 = new GLTFLoader();
    island_loader_2.load('models/gltb/island.glb',function(gltf){
        model = gltf.scene;
        scene.add(model);
        model.position.set(500, -2, 200);
        model.rotation.y = - 10;
        gltf.scene.traverse( function(object){ 
            // console.log(object.type);
            
            if(object.isMesh){
                //console.log(object);
                //object.castShadow = true;
                object.material.roughness = .6;
            }   
        })

        model.scale.set(20,20,20);
        //模型放大

        render();
    });


    //小船
    const smallship_loader = new GLTFLoader();
    smallship_loader.load('models/gltb/BoatWSail_small.glb',function(gltf){
        model1 = gltf.scene;
        scene.add(model1);
        model1.position.set(80, 0, 160);
        model1.rotation.y = - 1;
        
        gltf.scene.traverse( function(object){ 
            // console.log(object.type);
            
            if(object.isMesh){
                //console.log(object);
                object.castShadow = true;
            }   
        })
        model1.scale.set(22,22,22);
        render();
    });

    //大船
    const bigship_loader = new GLTFLoader();
    bigship_loader.load('models/gltb/Sail ship_big.glb',function(gltf){
        model = gltf.scene;
        scene.add(model);
        model.position.set(20, 0, 150);
        model.rotation.y = - 2;
        //左右为为X轴，右为正；上下为Y轴；为Z轴
        gltf.scene.traverse( function(object){ 
            // console.log(object.type);
            
            if(object.isMesh){
                //console.log(object);
                object.castShadow = true;
            }   
        })
        model.scale.set(10,10,10);
        render();
    });


    //光照船
    const light_boat_loader = new GLTFLoader();
    light_boat_loader.load('models/gltb/boat_1.glb',function(gltf){
        model = gltf.scene;
        scene.add(model);
        model.position.set(0, 5, 0);
        //model.position.set(200, 5, 0);
        //左右为为X轴，右为正；上下为Y轴；为Z轴
        gltf.scene.traverse( function(object){ 
            // console.log(object.type);
            
            if(object.isMesh){
                //console.log(object);
                object.castShadow = true;
            }   
        })
        model.scale.set(1.2,1.2,1.2);
        render();
    });

    //火烈鸟
    const bird_loader = new GLTFLoader();
    bird_loader.load('models/gltb/flamingo.glb',function(gltf){
        const mesh = gltf.scene.children[0];
        mesh.scale.set(.35, .35, .35);
        mesh.position.set(-100, 80, -300);
        mesh.rotation.y = - 1;
        mesh.castShadow = true;
        scene.add(mesh);

        const bird2 = mesh.clone();
        bird2.position.set(150, 80, -500);
        scene.add(bird2);

        mixer = new THREE.AnimationMixer(mesh);
        mixer.clipAction(gltf.animations[0]).setDuration(1.2).play();
        //this.mixers.push(mixer);

        mixer2 = new THREE.AnimationMixer(bird2);
        mixer2.clipAction(gltf.animations[0]).setDuration(1.8).play();
        //this.mixers.push(mixer2);


        // scene.add(gltf.scene);
         gltf.scene.traverse( function(object){ 
             console.log(object.type);
            
             if(object.isMesh){
                 console.log(object);
                 object.castShadow = true;
             }   
         })

        console.log(gltf);

        render();

    });

    //鲸鱼
    const whale_loader = new GLTFLoader();
    whale_loader.load('models/gltb/Whale.glb',function(gltf){
        const mesh = gltf.scene.children[0];
        mesh.scale.set(30, 30, 30);
        mesh.position.set(-100, -20, -300);
        mesh.rotation.y = - 1;
        mesh.castShadow = true;
        scene.add(mesh);

        mixer3 = new THREE.AnimationMixer(mesh);
        mixer3.clipAction(gltf.animations[0]).play();



        // scene.add(gltf.scene);
         gltf.scene.traverse( function(object){ 
             console.log(object.type);
            
             if(object.isMesh){
                 console.log(object);
                 object.castShadow = true;
             }   
         })

        //让模型动起来
        // const clip = gltf.animations[3];
        // mixer = new THREE.AnimationMixer(gltf.scene);
        // const action = mixer.clipAction(clip);
        //action.play();
        console.log(gltf);

        render();

    });

}

// 海
 const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
 //const waterGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
 const water = new Water(waterGeometry, {
     textureWidth: 512,
     textureHeight: 512,
     //transparent: true,
     waterNormals: new THREE.TextureLoader().load(waterTexture,  texture => {
     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
     }),
     sunDirection: new THREE.Vector3(),
     sunColor: 0xfffff0,
     waterColor: 0x0072ff,
     distortionScale: 4,
     fog: scene.fog !== undefined
 });
 water.rotation.x = - Math.PI / 2;
 //water.depthTest = false;
// water.opacity = .2;
 //water.position.set(0, -5000, 0);
 scene.add(water);

// 天空
const sky = new Sky();
sky.scale.setScalar(10000);
scene.add(sky);
const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = 20;
skyUniforms['rayleigh'].value = 2;
skyUniforms['mieCoefficient'].value = 0.005;
skyUniforms['mieDirectionalG'].value = 0.8;

// 太阳
const sun = new THREE.Vector3();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const phi = THREE.MathUtils.degToRad(88);
const theta = THREE.MathUtils.degToRad(180);
sun.setFromSphericalCoords( 1, phi, theta );
sky.material.uniforms['sunPosition'].value.copy( sun );
water.material.uniforms['sunDirection'].value.copy(sun).normalize();
scene.environment = pmremGenerator.fromScene(sky).texture;

const manager = new THREE.LoadingManager();
manager.onProgress = async(url, loaded, total) => {
  if (Math.floor(loaded / total * 100) === 100) {
    this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
    Animations.animateCamera(camera, controls, { x: 0, y: 40, z: 140 }, { x: 0, y: 0, z: 0 }, 4000, () => {
      this.setState({ sceneReady: true });
    });
  } else {
    this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
  }
};
    
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
    pointLight.castShadow = true;
    //ambientLight.castShadow = true;
    plane.receiveShadow = true; 


};
/* ------------------阴影------------------- */



/* ------------------控制器------------------- */
 function initControls(){
     controls = new OrbitControls(camera, renderer.domElement);
     controls.target.set(80, 0, 160);
     controls.enableDamping = true;
     controls.enablePan = false;
     controls.maxPolarAngle = 1.5;
     controls.minDistance = 50;
     controls.maxDistance = 1200;

     window.addEventListener("keydown",function(e){
        keyDownWalk(e)
    })
     
     controls.update();

 }


function keyDownWalk(e) {
    let keyCode = e.keyCode;
    let position = model1.position, rotation = model1.rotation.y;
    //model1.rotation=controls.rotation;
    //rotation=this.controls.rotation.y;
    switch (keyCode) {

        //if靠近大船，加速，大船的用处，愿不愿意去大船，坐标，true，false，判断
        //坐标达到，一旦触发，就自动发送到服务器，速度：时间
        case 87:        //w
            position.x += 0.1 * Math.cos(rotation);
            position.z += 0.1 * Math.sin(-rotation);
            break;
        case 65:        //a
            position.x += 0.1 * Math.cos(rotation + Math.PI/2);
            position.z += 0.1 * Math.sin(-rotation - Math.PI/2);
            break;
        case 68:        //d
            position.x += 0.1 * Math.cos(rotation - Math.PI/2);
            position.z += 0.1 * Math.sin(-rotation + Math.PI/2);
            break;
        case 83:        //s
            position.x -= 0.1 * Math.cos(rotation);
            position.z -= 0.1 * Math.sin(-rotation);
            break;
        default:
            break;
    }
}

/* ------------------控制器------------------- */



/* ------------------渲染器------------------- */
function render(){
    const time = performance.now() / 3000;
    const delta = clock.getDelta();
    requestAnimationFrame( render );
   
    
    spotLight.rotation.y += 0.01;
	spotLight.target.position.x = Math.cos( time ) * 25;
	spotLight.target.position.z = Math.sin( time ) * 25;

	renderer.render(scene,camera);
    lightHelper.update();

    mixer.update(delta);
    mixer2.update(delta);
    mixer3.update(delta);

    
}
/* ------------------渲染器------------------- */


//console.log("hhhhhhh" + loader);
