import {
    AdditiveBlending,
    Camera,
    Color,
    FrontSide,
    MeshBasicMaterial, Scene,
    ShaderMaterial,
    SubtractiveBlending
} from "three"
import {ShaderLoader} from "./ShaderLoader"

export class Materials {

    static globeMat: ShaderMaterial
    static nameGlowMat: ShaderMaterial

    baseColor = new Color(0x4eebb3)

    pingMat = new MeshBasicMaterial({
        color: 0xff1509,
        transparent: true,
        opacity: 0.7
    })

    countryMat = new MeshBasicMaterial({
        color: this.baseColor
    })


    private camera
    private scene
    private startTime


    constructor(camera: Camera, scene: Scene) {
        this.camera = camera
        this.scene = scene
    }

    initGlow(callback) {
        new ShaderLoader("./assets/shaders/glow.vert", "./assets/shaders/glow.frag", (vert, frag) => {

            Materials.nameGlowMat = new ShaderMaterial({
                uniforms:
                    {
                        c: {type: "f", value: 1.3},
                        p: {type: "f", value: 1},
                        glowColor: {type: "c", value: new Color("#ffffff")},
                        viewVector: {type: "v3", value: this.camera.position},
                        fogColor: {type: "c", value: this.scene.fog.color},
                        fogNear: {type: "f", value: this.scene.fog.near},
                        fogFar: {type: "f", value: this.scene.fog.far}
                    },
                vertexShader: vert,
                fragmentShader: frag,
                side: FrontSide,
                blending: SubtractiveBlending,
                transparent: true,
                fog: true
            })
            callback()
        })
    }

    initGlobe(callback) {
        new ShaderLoader("./assets/shaders/globe.vert", "./assets/shaders/globe.frag", (vert, frag) => {
            this.startTime = Date.now()
            Materials.globeMat = new ShaderMaterial({
                uniforms:
                    {
                        c: {type: "f", value: 0.05},
                        p: {type: "f", value: 3.0},
                        time: {type: "f", value: 0.0},
                        reflectivity: {type: "f", value: 0.2},
                        glowColor: {type: "c", value: new Color(0x279989)},
                        viewVector: {type: "v3", value: this.camera.position},
                        fogColor: {type: "c", value: this.scene.fog.color},
                        fogNear: {type: "f", value: this.scene.fog.near},
                        fogFar: {type: "f", value: this.scene.fog.far}
                    },
                vertexShader: vert,
                fragmentShader: frag,
                side: FrontSide,
                blending: AdditiveBlending,
                transparent: true,
                fog: false
            })
            callback()
        })
    }


    static randomizeColor(color) {
        return new Color(
            color.r + ((Math.random() * 0.4) - 0.2),
            color.g + ((Math.random() * 0.4) - 0.2),
            color.b + ((Math.random() * 0.4) - 0.2)
        )
    }

    update() {
        if (Materials.globeMat === undefined) {
            return
        }
        let dist = this.camera.position.distanceTo(origin)
        Materials.globeMat.uniforms.time.value = 0.00003 * (Date.now() - this.startTime)
    }
}
