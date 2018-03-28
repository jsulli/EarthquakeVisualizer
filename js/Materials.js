Materials = function() {

    this.baseColor = new THREE.Color(0x4eebb3)

    this.pingMat = new THREE.MeshBasicMaterial({
        color: 0xff1509,
        transparent: true,
        opacity: 0.7
    })

    this.countryMat = new THREE.MeshBasicMaterial({
        color: this.baseColor
    })

    this.initGlow = function(callback) {
        var _this = this
        ShaderLoader("./assets/shaders/glow.vert", "./assets/shaders/glow.frag", function(vert, frag) {

            _this.nameGlowMat = new THREE.ShaderMaterial({
                uniforms:
                    {
                        c: {type: "f", value: 1.3},
                        p: {type: "f", value: 1},
                        glowColor: {type: "c", value: new THREE.Color("#ffffff")},
                        viewVector: {type: "v3", value: camera.position},
                        fogColor: {type: "c", value: scene.fog.color},
                        fogNear: {type: "f", value: scene.fog.near},
                        fogFar: {type: "f", value: scene.fog.far}
                    },
                vertexShader: vert,
                fragmentShader: frag,
                side: THREE.FrontSide,
                blending: THREE.SubtractiveBlending,
                transparent: true,
                fog: true
            })
            callback()
        })
    }

    this.initGlobe = function(callback) {
        var _this = this
        ShaderLoader("./assets/shaders/globe.vert", "./assets/shaders/globe.frag", function(vert, frag) {
            _this.start = Date.now()
            _this.globeMat = new THREE.ShaderMaterial({
                uniforms:
                    {
                        c: {type: "f", value: 0.05},
                        p: {type: "f", value: 3.0},
                        time: {type: "f", value: 0.0},
                        reflectivity: {type: "f", value: 0.2},
                        glowColor: {type: "c", value: new THREE.Color(0x279989)},
                        viewVector: {type: "v3", value: camera.position},
                        fogColor: {type: "c", value: scene.fog.color},
                        fogNear: {type: "f", value: scene.fog.near},
                        fogFar: {type: "f", value: scene.fog.far}
                    },
                vertexShader: vert,
                fragmentShader: frag,
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                transparent: true,
                fog: false
            })
            callback()
        })
    }


    this.randomizeColor = function(color) {
        return new THREE.Color(
            color.r + ((Math.random() * 0.4) - 0.2),
            color.g + ((Math.random() * 0.4) - 0.2),
            color.b + ((Math.random() * 0.4) - 0.2)
        )
    }

    this.update = function() {
        if (this.globeMat === undefined) {
            return
        }
        var dist = camera.position.distanceTo(origin)
        this.globeMat.uniforms.time.value = 0.00003 * (Date.now() - this.start)
    }
}
