import {
    CubicBezierCurve3,
    Object3D,
    OrbitControls,
    PerspectiveCamera,
    Vector2,
    Vector3
} from "three"

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
            var x = this.position.x,
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
        var _this = this
        if (y === undefined) y = x / 7
        new TWEEN.Tween(this.rotSpeed)
            .to({
                x: x,
                y: y
            }, 3500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                _this.rotSpeed.set(this.x, this.y)
            })
            .start()
    }

    moveToTarget(pos) {
        this.idle = false

        var height = 55

        var handle1 = new Object3D
        var handle2 = new Object3D
        var start = new Object3D
        var end = new Object3D

        start.position.set(this.position.x, this.position.y, this.position.z)
        end.position.set(pos.x, pos.y, pos.z)

        start.lookAt(this.origin)
        end.lookAt(this.origin)

        end.translateZ(height * -1)

        handle1.position.set(start.position.x, start.position.y, start.position.z)
        handle2.position.set(end.position.x, end.position.y, end.position.z)

        Util.lookAtAndOrient(handle1, origin, end)
        Util.lookAtAndOrient(handle2, origin, start)

        var angle = Util.findAngle(start.position, origin, end.position)
        angle = angle * 60
        handle1.translateX(angle)
        handle2.translateX(angle)

        var curve = new CubicBezierCurve3(
            start.position,
            handle1.position,
            handle2.position,
            end.position)

        var time = start.position.distanceTo(end.position) * 8
        if (time < 2000) time = 2000
        if (time > 6000) time = 6000

        var _this = this

        this.cameraTween = new TWEEN.Tween({x: 0.00})
            .to({x: 1.00}, time)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function() {
                var point = curve.getPointAt(this.x)
                _this.position.x = point.x
                _this.position.y = point.y
                _this.position.z = point.z
            }).start()
    }

    smoothZoom(amount, onComplete) {
        onComplete = onComplete || function() {}
        var speed = 3000
        var dist = this.position.distanceTo(this.origin)
        var last = 0

        var _this = this
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

