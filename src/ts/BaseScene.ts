import {
    AmbientLight, CubeTextureLoader,
    Fog, Raycaster,
    Scene, Vector3,
    WebGLRenderer
} from "three"

import * as TWEEN from "tween"
import * as THREE from "three"
(window as any).THREE = THREE;

import 'three/examples/js/controls/OrbitControls'

import {GlobeCamera} from "./GlobeCamera"


export abstract class BaseScene {

    public camera: GlobeCamera
    public renderer = new WebGLRenderer({antialias: true})

    public scene = new Scene()
    private sceneSky = new Scene()

    private fog = new Fog(0x013330, 50, 160)

    private controls

    private downX = 0
    private downY = 0

    private origin = new Vector3()


    protected constructor() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        let container = document.getElementById('container')
        container.appendChild(this.renderer.domElement)


        this.scene.fog = this.fog

        //Camera controls
        this.camera = new GlobeCamera(70, window.innerWidth / window.innerHeight, 1, 2000)
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.controls.rotateSpeed = 0.005
        this.controls.zoomSpeed = 1
        this.controls.panSpeed = 0.1
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.camera.controls = this.controls
        this.camera.position.x = 240

        let ambient = new AmbientLight(0xdddddd, 0.4)
        this.scene.add(ambient)

        this.initSky()

        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false)
        this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false)
        window.addEventListener('resize', this.onViewResize.bind(this), false)

        this.render()
    }

    private initSky() {
        let p = "./assets/textures/sky/"
        let images = ["xpos.jpg", "xneg.jpg", "ypos.jpg", "yneg.jpg", "zpos.jpg", "zneg.jpg"]
        this.sceneSky.background = new CubeTextureLoader().setPath(p).load(images)
    }

    public onViewResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    private onMouseDown(event) {
        event.preventDefault()
        this.downX = event.clientX
        this.downY = event.clientY
    }

    private onMouseUp(event) {
        event.preventDefault()
        let upX = event.clientX
        let upY = event.clientY
        if (Math.abs(this.downX - upX) < 30 && Math.abs(this.downY - upY) < 30) {
            let vector = new Vector3((upX / window.innerWidth) * 2 - 1, -(upY / window.innerHeight) * 2 + 1, 1.0)
            vector.unproject(this.camera)
            let raycaster = new Raycaster(this.camera.position, vector.sub(this.camera.position).normalize())
            this.handleRaycastIntersections(raycaster)
        }
    }

    protected abstract handleRaycastIntersections(ray: Raycaster)

    public render() {
        requestAnimationFrame(this.render.bind(this))
        TWEEN.update()

        //update fog distances
        this.camera.update()
        let dist = this.camera.position.distanceTo(this.origin)
        this.camera.far = dist - 15
        this.camera.updateProjectionMatrix()
        this.fog.near = dist - (170)
        this.fog.far = dist - (60)

        this.controls.update()

        this.renderer.render(this.sceneSky, this.camera)
        this.renderer.clearDepth()
        this.renderer.render(this.scene, this.camera)
    }
}



