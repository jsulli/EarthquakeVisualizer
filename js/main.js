
var camera, controls, projector
var scene, sceneSky
var renderer, light
var mouseX, mouseY
var fog
var glowSphere
var globe, countries, countryNames
var gpsSurface
var materials
var quakes

init()
render()

function init() {

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    sceneSky = new THREE.Scene()

    fog = new THREE.Fog(0x013330, 50, 160)
    scene.fog = fog

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.x = 240;

    //Camera controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.005;
    controls.zoomSpeed = 1;
    controls.panSpeed = 0.1;
    controls.noRoll = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
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
    initSky()
    initGPS()

    quakes = new Quakes("./assets/quakes.json")
}

function initSky() {
    var p = "./assets/textures/sky/"
    var images = ["xpos.png", "xneg.png","ypos.png","yneg.png","zpos.png","zneg.png"]
    sceneSky.background = new THREE.CubeTextureLoader().setPath(p).load(images)
}


function initObjects() {
    ShaderLoader("./assets/shaders/glow.vert", "./assets/shaders/glow.frag", function(vert, frag) {
        materials.initGlow(vert, frag)
        ObjectLoader('./assets/models/countries.obj', function(obj) {
            countries = obj.parent
            countries.scale.multiplyScalar(20)
            countries.children.forEach(function(child) {
                var mat = materials.countryMat.clone()
                //mat.uniforms.viewVector.value = camera.position
                //mat.uniforms.glowColor.value = materials.randomizeColor(materials.baseColor)
                mat.color = materials.randomizeColor(new THREE.Color(0x5bdec6))
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
        globe = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(148.7, 6), materials.globeMat)
        scene.add(globe)
    })
    var obj = new THREE.SphereBufferGeometry(200, 70, 50)
    glowSphere = new THREE.Mesh(obj, materials.outerGlowMat)
    //scene.add(glowSphere)

}

function initGPS() {
    var globeshader = new THREE.MeshBasicMaterial();
    var obj = new THREE.SphereBufferGeometry(150, 50, 50)
    gpsSurface = new THREE.GeoSpatialMap(obj, globeshader)
    gpsSurface.setTexturesEdgeLongitude(-260.0);
    gpsSurface.setRadius(150)
    //scene.add(gpsSurface)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}



function render() {
    requestAnimationFrame( render )

    //update fog distances
    var dist = camera.position.distanceTo(gpsSurface.position)
    camera.far = dist +2
    camera.updateProjectionMatrix()
    fog.near = dist-(170)
    fog.far = dist-(60)


    controls.update()
    materials.update()
    renderer.render(sceneSky, camera)
    renderer.clearDepth()
    renderer.render( scene, camera )
}
