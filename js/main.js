
var camera, controls, projector
var scene, renderer, light
var mouseX, mouseY
var fog
var globe, countries, countryNames
var materials

init()
animate()

function init() {

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    camera = new THREE.GlobeCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;

    materials = new Materials()

    //Camera controls
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.25;
    controls.zoomSpeed = 0.1;
    controls.panSpeed = 0.1;
    controls.noRoll = true;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.075;
    camera.controls = controls

    var ambient = new THREE.AmbientLight(0xdddddd, 0.4)
    scene.add(ambient)

    var point = new THREE.PointLight(0xcc33ff)
    point.position.y = 300
    scene.add(point)

    var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    var material = new THREE.MeshBasicMaterial( { color: 0xcccccc } );

    mesh = new THREE.Mesh( geometry, material );
    //scene.add( mesh );

    material.needsUpdate = true

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}



function animate() {
    controls.update()
    camera.update()
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
