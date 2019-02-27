import {
    CubicBezierCurve3,
    Object3D,
    OrbitControls,
    PerspectiveCamera,
    Vector2,
    Vector3
} from "three"
import {Util} from "./Util"
import * as TWEEN from "@tweenjs/tween.js"

export class GlobeCamera extends PerspectiveCamera {

    constructor(focalLength, aspect, clipMin, clipMax) {
        super(focalLength, aspect, clipMin, clipMax)
    }

    rotSpeed = new Vector2(-25.00, -5.00)
    idle = true
    controls: OrbitControls
    cameraTween
    origin = new Vector3()


    update() {
        if (this.idle) {
            let x = this.position.x,
                y = this.position.y,
                z = this.position.z,
                tx = this.controls.target.x,
                ty = this.controls.target.y,
                tz = this.controls.target.z

            var theta = new Vector2(this.rotSpeed.x / 100000, -this.rotSpeed.y / 100000)

            this.position.x = x * Math.cos(theta.x) + z * Math.sin(theta.x) - y * Math.sin(theta.y)
            this.position.y = y * Math.cos(theta.x) + z * Math.sin(theta.y) + x * Math.sin(theta.y)
            this.position.z = z * Math.cos(theta.x) - x * Math.sin(theta.x) - y * Math.sin(theta.y)

            this.controls.target.x = tx * Math.cos(theta.x) + tz * Math.sin(theta.x) - ty * Math.sin(theta.y)
            this.controls.target.y = ty * Math.cos(theta.x) + tz * Math.sin(theta.y) + tx * Math.sin(theta.y)
            this.controls.target.z = tz * Math.cos(theta.x) - tx * Math.sin(theta.x) - ty * Math.sin(theta.y)
        }
    }

    setIdleSpeed(x, y) {
        if (y === undefined) y = x / 7
        new TWEEN.Tween(this.rotSpeed)
            .to({
                x: x,
                y: y
            }, 3500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.rotSpeed.set(x, y)
            })
            .start()
    }

    moveToTarget(pos) {
        this.idle = false

        let height = 55

        let handle1 = new Object3D
        let handle2 = new Object3D
        let start = new Object3D
        let end = new Object3D

        start.position.set(this.position.x, this.position.y, this.position.z)
        end.position.set(pos.x, pos.y, pos.z)

        start.lookAt(this.origin)
        end.lookAt(this.origin)

        end.translateZ(height * -1)

        handle1.position.set(start.position.x, start.position.y, start.position.z)
        handle2.position.set(end.position.x, end.position.y, end.position.z)

        Util.lookAtAndOrient(handle1, this.origin, end)
        Util.lookAtAndOrient(handle2, this.origin, start)

        let angle = Util.findAngle(start.position, this.origin, end.position)
        angle = angle * 60
        handle1.translateX(angle)
        handle2.translateX(angle)

        let curve = new CubicBezierCurve3(
            start.position,
            handle1.position,
            handle2.position,
            end.position)

        let time = start.position.distanceTo(end.position) * 8
        if (time < 2000) time = 2000
        if (time > 6000) time = 6000

        let progress = { x: 0.00 }
        this.cameraTween = new TWEEN.Tween(progress)
            .to({x: 1.00}, time)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                let point = curve.getPointAt(progress.x)
                this.position.x = point.x
                this.position.y = point.y
                this.position.z = point.z
            }).start()
    }

    smoothZoom(amount, onComplete) {
        onComplete = onComplete || function() {}
        let speed = 3000
        let dist = this.position.distanceTo(this.origin)
        let last = 0

        let _this = this
        new TWEEN.Tween({z:0})
            .to({z:amount}, speed)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function() {
                _this.translateZ(this.z-last)
                last = this.z
            })
            .onComplete(function() {
                onComplete()
            })
            .start()
    }
}

