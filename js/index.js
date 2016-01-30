// index.js

var scene, 
    camera, 
    renderer,
    controls;

var rayCaster,
    mouse;

var mesh,
    cube,
    cubeBSP;

var WIDTH,
    HEIGHT;

var VIEW_ANGLE = 45,
    ASPECT,
    NEAR = 0.1,
    FAR = 10000;

var toRadians = 0.0174533;

var tools = {
  MOVE: 'move',
  CHIP: 'chips'
};
var currentTool = tools.CHIP;

window.addEventListener('resize', function() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    ASPECT = WIDTH / HEIGHT;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = ASPECT;
    camera.updateProjectionMatrix();
});

window.addEventListener('contextmenu', function(event) {

  switch (currentTool) {
    case tools.MOVE:
      console.log('right move!');
      break;
    case tools.CHIP:
      console.log('right chip!');
      chip(event);
      break;
    default:
      event.preventDefault();
      console.log('right click');
      return false;
      break;
  }
}, false);

init();
animate();

function init() {
  // Create the scene
  scene = new THREE.Scene();
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  ASPECT = WIDTH / HEIGHT;

  // Create a renderer and add it to the DOM
  renderer = new THREE.WebGLRenderer({
    antialias:true
  });
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);

  // Create a camera, zoom it out from the model a bit, and add it to the scene.
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.set(0, 6, 0);
  scene.add(camera);


  // Set the background color of the scene
  renderer.setClearColor(0xbada55, 1);

  // Create a light, set its position, and add it to the scene.
  var light = new THREE.PointLight(0xffffff);
  light.position.set(100, 100, 100);
  scene.add(light);
  var light2 = new THREE.PointLight(0xffff00);
  light2.position.set(-100, -100, -100);
  scene.add(light2);

  // Load mesh and add it to the scene
  // var loader = new THREE.JSONLoader();
  // loader.load("models/cube.json", function(geometry) {
  //   var material = new THREE.MeshLambertMaterial({
  //     color: 0x55B663
  //   });
  //   mesh = new THREE.Mesh(geometry, material);
  //   scene.add(mesh);
  // });

  // Create inner knot
  var knotGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  var knotMaterial = new THREE.MeshLambertMaterial({
    color: 0xffff00
  });
  var knot = new THREE.Mesh(knotGeometry, knotMaterial);
  var knowBSP = new ThreeBSP(knot);
  scene.add(knot);

  // Create exterior cube
  var cubeGeometry = new THREE.CubeGeometry(36,36,36);
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x55B663
  });
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeBSP = new ThreeBSP(cube);
  scene.add(cube);

  // Add OrbitControls so that we can pan around the scene with the mouse
  controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  // Render the scene
  renderer.render(scene, camera);
  controls.update();
}

function chip(event) {
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  mouse.x = (event.clientX/WIDTH)*2-1;
  mouse.y = -(event.clientY/HEIGHT)*2+1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);

  for (var i=0; i<1; i++) {
    console.log('found one!');
    intersects[i].object.material.color.set(0xff0000);
  }

  var sphereGeometry = new THREE.SphereGeometry(10, 10, 10);
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xffff00
  });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.x = intersects[0].point.x;
  sphere.position.y = intersects[0].point.y;
  sphere.position.z = intersects[0].point.z;
  var sphereBSP = new ThreeBSP(sphere);
  var subtractBSP = cubeBSP.subtract(sphereBSP);
  var result = subtractBSP.toMesh(new THREE.MeshLambertMaterial({
    color: 0x55B663
  }));
  result.geometry.computeVertexNormals();
  scene.remove(cube);
  cube = result;
  cubeBSP = new ThreeBSP(cube);
  scene.add(cube);
  // scene.add(sphere);

  // renderer.render(scene, camera);
}