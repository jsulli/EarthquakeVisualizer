



THREE.GlobeCamera = function(focalLength, width, height, clipMin, clipMax) {

    THREE.PerspectiveCamera.call(this, focalLength, width, height, clipMin, clipMax)

    this.controls = 0
    this.scaleFactor = 34
    this.rotSpeed = new THREE.Vector2(-25.00, -5.00)
    this.idle = true


    this.update = function() {
        if(this.idle) {
            var x = this.position.x,
                y = this.position.y,
                z = this.position.z,
                tx = controls.target.x,
                ty = controls.target.y,
                tz = controls.target.z

            var theta = new THREE.Vector2(this.rotSpeed.x / 100000, -this.rotSpeed.y / 100000)

            this.position.x = x * Math.cos(theta.x) + z * Math.sin(theta.x) - y * Math.sin(theta.y);
            this.position.y = y * Math.cos(theta.x) + z * Math.sin(theta.y) + x * Math.sin(theta.y);
            this.position.z = z * Math.cos(theta.x) - x * Math.sin(theta.x) - y * Math.sin(theta.y);

            controls.target.x = tx * Math.cos(theta.x) + tz * Math.sin(theta.x) - ty * Math.sin(theta.y);
            controls.target.y = ty * Math.cos(theta.x) + tz * Math.sin(theta.y) + tx * Math.sin(theta.y);
            controls.target.z = tz * Math.cos(theta.x) - tx * Math.sin(theta.x) - ty * Math.sin(theta.y);
        }
    }

    this.setIdleSpeed = function(x, y) {
        var _this = this
        if(y === undefined) y = x/7
        new TWEEN.Tween(this.rotSpeed)
            .to({
                x: x,
                y: y}, 3500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                _this.rotSpeed.set(this.x, this.y)
            })
            .start()
    }


    this.testTween = function() {
        var p = {x: 0.00}
        var cameraTween = new TWEEN.Tween(p)
            .to({x: 1.00}, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function() {
                console.log("test")
            }).start()
    }

    this.moveToTarget = function(pos) {
        this.idle = false

        var height = 70

        var handle1 = new THREE.Object3D
        var handle2 = new THREE.Object3D
        var start = new THREE.Object3D
        var end = new THREE.Object3D

        start.position.set(this.position.x, this.position.y, this.position.z)
        end.position.set(pos.x, pos.y, pos.z)

        start.lookAt(origin)
        end.lookAt(origin)

        end.translateZ(height* -1)

        handle1.position.set(start.position.x, start.position.y, start.position.z)
        handle2.position.set(end.position.x, end.position.y, end.position.z)

        Util.lookAtAndOrient(handle1, origin, end)
        Util.lookAtAndOrient(handle2, origin, start)

        var angle = Util.findAngle(start.position, origin, end.position)
        angle = angle * 60
        handle1.translateX(angle)
        handle2.translateX(angle)

        var curve = new THREE.CubicBezierCurve3(
            start.position,
            handle1.position,
            handle2.position,
            end.position)

        var time = start.position.distanceTo(end.position) * 8
        if(time < 2000) time = 2000
        if(time > 6000) time = 6000

        var _this = this

        this.cameraTween = new TWEEN.Tween({x:0.00})
            .to({x: 1.00}, time)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function() {
                var point = curve.getPointAt(this.x)
                _this.position.x = point.x
                _this.position.y = point.y
                _this.position.z = point.z
            }).start()

        quakes.setPing(pos)
    }


    /*this.zoom = function(amount, speed) {
        if(speed === undefined) speed = 1500
        var last = 0
        var cam = this

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
            .onUpdate(function() {
                cam.translateZ(this.x-last)
                last = this.x
            })
            .start()
    }*/
}
THREE.GlobeCamera.prototype = Object.create( THREE.PerspectiveCamera.prototype );
THREE.GlobeCamera.prototype.constructor = THREE.GlobeCamera;

