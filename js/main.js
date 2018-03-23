
var camera, controls, projector
var scene, renderer, light
var mouseX, mouseY
var fog
var globe, countries, countryNames
var materials

init()
render()

function init() {

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;

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

    window.addEventListener( 'resize', onWindowResize, false );

    console.log("initializing mats")
    materials = new Materials()

    initObjects()
}

function initObjects() {
    ShaderLoader("./assets/shaders/glow.vert", "./assets/shaders/glow.frag", function(vert, frag) {
        materials.initGlow(vert, frag)
        ObjectLoader('./assets/models/countries.obj', function(obj) {
            countries = obj.parent
            countries.scale.multiplyScalar(20)
            countries.children.forEach(function(child) {
                var mat = materials.countryGlowMat.clone()
                mat.uniforms.viewVector.value = camera.position
                mat.uniforms.glowColor.value = materials.randomizeColor(materials.baseColor)
                child.material = mat
            })
            scene.add(countries)
        })
        ObjectLoader('./assets/models/countryNames.obj', function(obj) {
            countryNames = new THREE.Mesh(obj.geometry, materials.nameGlowMat)
            countryNames.scale.multiplyScalar(20.075)
            scene.add(countryNames)
        })
    })
    ShaderLoader("./assets/shaders/globe.vert", "./assets/shaders/globe.frag", function(vert, frag) {
        materials.initGlobe(vert, frag)
        ObjectLoader('./assets/models/globe.obj', function(obj) {
            globe = new THREE.Mesh(obj.geometry, materials.globeMat)
            globe.scale.multiplyScalar(19)
            //scene.add(globe)
        })
    })
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}



function render() {
    requestAnimationFrame( render );
    controls.update()
    materials.update()
    renderer.render( scene, camera );

    //materials.countryGlowMat.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, countries.position)
    //materials.nameGlowMat.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, countryNames.position)
}
