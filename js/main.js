var container
var camera, controls
var scene, sceneSky
var renderer, light
var downX, downY
var fog
var glowSphere
var globe, countries, countryNames
var gpsSurface
var materials
var quakes
var origin = new THREE.Vector3()

init()
render()

function init() {

    container = document.getElementById('container')
    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    scene = new THREE.Scene()
    sceneSky = new THREE.Scene()

    fog = new THREE.Fog(0x013330, 50, 160)
    scene.fog = fog

    camera = new THREE.GlobeCamera(70, window.innerWidth / window.innerHeight, 1, 2000)
    camera.position.x = 240
    //camera.position.y = 100

    //Camera controls
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.rotateSpeed = 0.005
    controls.zoomSpeed = 1
    controls.panSpeed = 0.1
    controls.noRoll = true
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    camera.controls = controls

    var ambient = new THREE.AmbientLight(0xdddddd, 0.4)
    scene.add(ambient)

    window.addEventListener('resize', onWindowResize, false)
    renderer.domElement.addEventListener('mousedown', onMouseDown, false)
    renderer.domElement.addEventListener('mouseup', onMouseUp, false)

    materials = new Materials()

    initObjects()
    initSky()
    initGPS()

    quakes = new Quakes("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson")
}


function initObjects() {

    materials.initGlow(function() {
        ObjLoader.load('./assets/models/countries.obj', function(obj) {
            countries = obj.parent
            countries.scale.multiplyScalar(20)
            countries.children.forEach(function(child) {
                var mat = materials.countryMat.clone()
                mat.color = materials.randomizeColor(new THREE.Color(0x5bdec6))
                child.material = mat
            })
            scene.add(countries)
        })
        ObjLoader.load('./assets/models/countryNames.obj', function(obj) {
            countryNames = new THREE.Mesh(obj.geometry, materials.nameGlowMat)
            countryNames.scale.multiplyScalar(20.075)
            scene.add(countryNames)
        })
    })


    materials.initGlobe(function() {
        console.log("loaded globe shaders")
        console.log(materials.globeMat)
        globe = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(149, 5), materials.globeMat)
        scene.add(globe)
    })
}

function initSky() {
    var p = "./assets/textures/sky/"
    var images = ["xpos.png", "xneg.png", "ypos.png", "yneg.png", "zpos.png", "zneg.png"]
    sceneSky.background = new THREE.CubeTextureLoader().setPath(p).load(images)
}

function initGPS() {
    var globeshader = new THREE.MeshBasicMaterial()
    var obj = new THREE.SphereBufferGeometry(150, 50, 50)
    gpsSurface = new THREE.GeoSpatialMap(obj, globeshader)
    gpsSurface.setTexturesEdgeLongitude(-260.0)
    gpsSurface.setRadius(150)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

function onMouseDown(event) {
    event.preventDefault()
    downX = event.clientX
    downY = event.clientY
}

function onMouseUp() {
    event.preventDefault()
    var upX = event.clientX
    var upY = event.clientY
    if (Math.abs(downX - upX) < 30 && Math.abs(downY - upY) < 30) {
        var vector = new THREE.Vector3((upX / window.innerWidth) * 2 - 1, -(upY / window.innerHeight) * 2 + 1, 1.0)
        vector.unproject(camera)
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
        var intersects = raycaster.intersectObject(globe)
        if (intersects.length > 0) {
            var pos = intersects[0].point
            quakes.findNearest(pos)
        }
    }
}

function render() {
    requestAnimationFrame(render)
    TWEEN.update()

    //update fog distances
    camera.update()
    var dist = camera.position.distanceTo(gpsSurface.position)
    camera.far = dist - 15
    camera.updateProjectionMatrix()
    fog.near = dist - (170)
    fog.far = dist - (60)

    controls.update()
    materials.update()
    renderer.render(sceneSky, camera)
    renderer.clearDepth()
    renderer.render(scene, camera)
}
