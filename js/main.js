import * as THREE from '../dependencies/three/three.module.js'
import OrbitControls from '../dependencies/three/controls/OrbitControls.js'
import { GlobeCamera } from './camera.js'

let container, stats
let camera, controls, projector
let scene, renderer, light
let mouseX, mouseY
let fog
let globe

init()
animate()

function init() {
    container = document.getElementById("container")

    scene = new THREE.Scene()

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, logarithmicDepthBuffer: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.autoClear = false
    renderer.sortObjects = true
    container.appendChild(renderer.domElement)

    camera = new GlobeCamera(15, window.innerWidth, window.innerHeight, 50, 100000)
    camera.position.z = -350 * camera.scaleFactor
    scene.add(camera)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.rotateSpeed = 0.07
    controls.zoomSpeed = 1.0
    controls.panSpeed = 0.1
    controls.noRoll = true
    controls.staticMoving = false
    controls.dynamicDampingFactor = 0.5
    camera.controls = controls

    projector = new THREE.Projector()

    light = new THREE.AmbientLight(0xffffff)
    scene.add(light)

    fog = new THREE.Fog('#003834', 50, 100)
    scene.fog = fog

    renderer.domElement.addEventListener('mousedown', onMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('resize', onWindowResize, false);
}


function onMouseDown(event) {
    event.preventDefault()
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseUp(event) {
    event.preventDefault()
    let vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5)
    projector.unprojectVector(vector, camera)
    let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
    let intersects = raycaster.intersectObject(globe)

    if(intersects.length > 0 && mouseX === event.clientX && mouseY === event.clientY) {
        let pos = intersects[0].point
        findQuakes() // TODO
        camera.idle = false
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth / window.innerHeight)
}

function animate() {
    requestAnimationFrame(animate)
    render()
    TWEEN.update()
    controls.update()
    camera.update()

    // do some quake animation stuff here
}

function render() {
    let dist = camera.position.distanceTo(new THREE.Vector3())

    fog.near = dist-35
    fog.far = dist-2

    renderer.render(scene, camera)
}
