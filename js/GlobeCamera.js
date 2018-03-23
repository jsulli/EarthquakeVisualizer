
THREE.GlobeCamera = function(focalLength, width, height, clipMin, clipMax) {

    THREE.PerspectiveCamera.call(this, focalLength, width, height, clipMin, clipMax)

    var controls = 0
    var scaleFactor = 34
    var rotSpeed = new THREE.Vector2(-25.00, -5.00)
    var origin = new THREE.Vector3()
    var idle = true


    this.update = function() {
        if(this.idle) {
            var x = position.x,
                y = position.y,
                z = position.z,
                tx = this.controls.target.x,
                ty = this.controls.target.y,
                tz = this.controls.target.z

            var theta = new THREE.Vector2(this.rotSpeed.x / 100000, -this.rotSpeed.y / 100000)

            position.x = x * Math.cos(theta.x) + z * Math.sin(theta.x) - y * Math.sin(theta.y);
            position.y = y * Math.cos(theta.x) + z * Math.sin(theta.y) + x * Math.sin(theta.y);
            position.z = z * Math.cos(theta.x) - x * Math.sin(theta.x) - y * Math.sin(theta.y);

            this.controls.target.x = tx * Math.cos(theta.x) + tz * Math.sin(theta.x) - ty * Math.sin(theta.y);
            this.controls.target.y = ty * Math.cos(theta.x) + tz * Math.sin(theta.y) + tx * Math.sin(theta.y);
            this.controls.target.z = tz * Math.cos(theta.x) - tx * Math.sin(theta.x) - ty * Math.sin(theta.y);
        }
    }

    this.setIdleSpeed = function(x, y) {
        if(y === undefined) y = x/7
        new TWEEN.Tween(this.rotSpeed)
            .to({
                x: x,
                y: y}, 3500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                this.rotSpeed.set(this.x, this.y)
            })
            .start()
    }

    this.zoom = function(amount, speed) {
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
    }
}

THREE.GlobeCamera.prototype = Object.create( THREE.PerspectiveCamera.prototype );
THREE.GlobeCamera.prototype.constructor = THREE.GlobeCamera;
