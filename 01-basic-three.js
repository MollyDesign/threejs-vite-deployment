import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


let scene, cube, sphere, camera, renderer;
let axesHelper, controls;

init();
render();

function init(){
    /* 1. 创建scene，以及物体*/
    scene = new THREE.Scene(); //容器
    const geometry1 = new THREE.BoxGeometry(1,1,1);

    const geometry2 = new THREE.SphereGeometry(0.4);

    const material1 = new THREE.MeshBasicMaterial({color:0xffbb00});
    const material2 = new THREE.MeshBasicMaterial({color:0xff2200});

    cube = new THREE.Mesh(geometry1,material1);//Mesh：物体
    sphere= new THREE.Mesh(geometry2,material2);
    //sphere.position.x = 1;
    sphere.position.y = 1;
    //sphere.position.z = 1;

    scene.add(cube);
    scene.add(sphere);

    /* 1.1 显示坐标轴*/
    axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);
    //x轴是横着的，红色的，y轴是竖着的，绿色的；z轴式垂直于屏幕的,蓝色的

     /* 2. 创建camera */
     camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
     camera.position.z = 5;
     camera.position.x = 2;
     camera.position.y = 1;
     

     /* 3. 创建renderer */
     renderer = new THREE.WebGL1Renderer();
     renderer.setSize(window.innerWidth,window.innerHeight);
     document.body.appendChild(renderer.domElement)

     /* 4. 控制器 */
     controls = new OrbitControls(camera, renderer.domElement);
}

function render(){
    renderer.render(scene, camera);
    //cube.rotation.y += 0.01;
    requestAnimationFrame(render);
    
}