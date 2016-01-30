// index.js

var scene, 
    camera, 
    renderer,
    controls;

init();
animate();

function init() {
  // Create the scene
  scene = new THREE.Scene();
  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;

  // Create a renderer and add it to the DOM
  renderer = new THREE.WebGLRenderer({
    antialias:true
  });
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);

  // Create a camera, zoom it out from the model a bit, and add it to the scene.
  camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 20000);
  camera.position.set(0, 6, 0);
  scene.add(camera);

  // Add event listener for window resize
  window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  });

  // Set the background color of the scene
  renderer.setClearColor(0xbada55, 1);

  // Create a light, set its position, and add it to the scene.
  var light = new THREE.PointLight(0xffffff);
  light.position.set(-100, 200, 100);
  scene.add(light);

  // Load mesh and add it to the scene
  var loader = new THREE.JSONLoader();
  loader.load("models/cube.json", function(geometry) {
    var material = new THREE.MeshLambertMaterial({
      color: 0x55B663
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });

  // Add OrbitControls so that we can pan around the scene with the mouse
  controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  // Render the scene
  renderer.render(scene, camera);
  controls.update();
}