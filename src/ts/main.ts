import {
    AmbientLight, Color, CubeTextureLoader,
    Fog,
    IcosahedronBufferGeometry, Mesh, MeshBasicMaterial,
    Raycaster,
    Scene, SphereBufferGeometry,
    Vector3,
    WebGLRenderer
} from "three"

import * as TWEEN from "tween"
import * as THREE from "three"
(window as any).THREE = THREE;

import {Materials} from "./Materials"
import {GeoSpatialMap} from "./GeoSpatialMap"
import {GlobeCamera} from "./GlobeCamera"
import 'three/examples/js/controls/OrbitControls'
import {QuakeData} from "./QuakeData"
import {ObjLoader} from "./ObjLoader"
import {QuakeMarkers} from "./QuakeMarkers"
import {QuakeList} from "./QuakeList"

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
var quakeData
var quakeList
var quakeMarkers
var origin = new Vector3()

init()
render()


function init() {

    container = document.getElementById('container')
    renderer = new WebGLRenderer({antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    scene = new Scene()
    sceneSky = new Scene()

    fog = new Fog(0x013330, 50, 160)
    scene.fog = fog

    camera = new GlobeCamera(70, window.innerWidth / window.innerHeight, 1, 2000)
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

    var ambient = new AmbientLight(0xdddddd, 0.4)
    scene.add(ambient)

    window.addEventListener('resize', onWindowResize, false)
    renderer.domElement.addEventListener('mousedown', onMouseDown, false)
    renderer.domElement.addEventListener('mouseup', onMouseUp, false)

    materials = new Materials(camera, scene)

    initObjects()
    initSky()
    initGPS()

    quakeData = new QuakeData("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function() {
        quakeMarkers = new QuakeMarkers(quakeData, gpsSurface, scene, camera, materials)
        quakeList = new QuakeList(quakeMarkers, quakeData)
        quakeMarkers.setList()
    })
}


function initObjects() {

    materials.initGlow(function() {
        ObjLoader.load('./assets/models/countries.obj', function(obj) {
            countries = obj.parent
            countries.scale.multiplyScalar(20)
            countries.children.forEach(function(child) {
                var mat = materials.countryMat.clone()
                mat.color = Materials.randomizeColor(new Color(0x5bdec6))
                child.material = mat
            })
            scene.add(countries)
        })
        ObjLoader.load('./assets/models/countryNames.obj', function(obj) {
            countryNames = new Mesh(obj.geometry, materials.nameGlowMat)
            countryNames.scale.multiplyScalar(20.075)
            scene.add(countryNames)
        })
    })

    materials.initGlobe(function() {
        globe = new Mesh(new IcosahedronBufferGeometry(149, 5), materials.globeMat)
        scene.add(globe)
    })
}

function initSky() {
    var p = "./assets/textures/sky/"
    var images = ["xpos.jpg", "xneg.jpg", "ypos.jpg", "yneg.jpg", "zpos.jpg", "zneg.jpg"]
    sceneSky.background = new CubeTextureLoader().setPath(p).load(images)
}


function initGPS() {
    var globeshader = new MeshBasicMaterial()
    var obj = new SphereBufferGeometry(150, 50, 50)
    gpsSurface = new GeoSpatialMap(obj, globeshader)
    gpsSurface.setTextureEdgeLongitude(-260.0)
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

function onMouseUp(event) {
    event.preventDefault()
    var upX = event.clientX
    var upY = event.clientY
    if (Math.abs(downX - upX) < 30 && Math.abs(downY - upY) < 30) {
        var vector = new Vector3((upX / window.innerWidth) * 2 - 1, -(upY / window.innerHeight) * 2 + 1, 1.0)
        vector.unproject(camera)
        var raycaster = new Raycaster(camera.position, vector.sub(camera.position).normalize())
        var intersects = raycaster.intersectObject(globe)
        if (intersects.length > 0) {
            var pos = intersects[0].point
            quakeMarkers.findNearest(pos)
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
