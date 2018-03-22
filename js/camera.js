import * as THREE from "../dependencies/three/three.module.js"

export class GlobeCamera extends THREE.PerspectiveCamera {

    constructor(controls, focalLength, width, height, clipMin, clipMax) {
        super(focalLength, width, height, clipMin, clipMax)

        this.controls = 0
        this.scaleFactor = 34
        this.rotSpeed = new THREE.Vector2(-25.00, -5.00)
        this.origin = new THREE.Vector3()
        this.idle = true
    }

    update() {
        if(this.idle) {
            let x = position.x,
                y = position.y,
                z = position.z,
                tx = this.controls.target.x,
                ty = this.controls.target.y,
                tz = this.controls.target.z

            let theta = new THREE.Vector2(this.rotSpeed.x / 100000, -this.rotSpeed.y / 100000)

            position.x = x * Math.cos(theta.x) + z * Math.sin(theta.x) - y * Math.sin(theta.y);
            position.y = y * Math.cos(theta.x) + z * Math.sin(theta.y) + x * Math.sin(theta.y);
            position.z = z * Math.cos(theta.x) - x * Math.sin(theta.x) - y * Math.sin(theta.y);

            this.controls.target.x = tx * Math.cos(theta.x) + tz * Math.sin(theta.x) - ty * Math.sin(theta.y);
            this.controls.target.y = ty * Math.cos(theta.x) + tz * Math.sin(theta.y) + tx * Math.sin(theta.y);
            this.controls.target.z = tz * Math.cos(theta.x) - tx * Math.sin(theta.x) - ty * Math.sin(theta.y);
        }
    }

    setIdleSpeed(x, y) {
        if(y === undefined) y = x/7
        new TWEEN.Tween(this.rotSpeed)
            .to({
                x: x,
                y: y}, 3500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.rotSpeed.set(this.x, this.y)
            })
            .start()
    }

    zoom(amount, speed) {
        if(speed === undefined) speed = 1500
        let last = 0
        let cam = this

        if((position.distanceTo(origin) + amount) < 2700) {
            amount = 2700 - position.distanceTo(origin)
            if(amount > 0) return
        }

        if(position.distanceTo(origin) + amount > 22000) {
            return
        }

        new TWEEN.Tween({x:0})
            .to({x: amount}, speed)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                cam.translateZ(this.x-last)
                last = this.x
            })
            .start()
    }
}
