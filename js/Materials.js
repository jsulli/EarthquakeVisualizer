
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

    this.initGlow = function(vert, frag) {

        this.nameGlowMat = new THREE.ShaderMaterial( {
            uniforms:
                {
                    c: 			{ type: "f",  value: 1.3 },
                    p: 			{ type: "f",  value: 1 },
                    glowColor: 	{ type: "c",  value: new THREE.Color("#ffffff") },
                    viewVector: { type: "v3", value: camera.position },
                    fogColor:    { type: "c", value: scene.fog.color },
                    fogNear:     { type: "f", value: scene.fog.near },
                    fogFar:      { type: "f", value: scene.fog.far }
                },
            vertexShader: vert,
            fragmentShader: frag,
            side: THREE.FrontSide,
            blending: THREE.SubtractiveBlending,
            transparent: true,
            fog: true
        })
    }

    this.initGlobe = function(vert, frag) {
        this.start = Date.now()
        this.globeMat = new THREE.ShaderMaterial({
            uniforms:
                {
                    c:              { type: "f", value: 0.05 },
                    p:              { type: "f", value: 3.0 },
                    time:           { type: "f", value: 0.0 },
                    reflectivity:   { type: "f", value: 0.2 },
                    glowColor:      { type: "c", value: new THREE.Color(0x279989)},
                    viewVector:     { type: "v3", value: camera.position},
                    fogColor:    { type: "c", value: scene.fog.color },
                    fogNear:     { type: "f", value: scene.fog.near },
                    fogFar:      { type: "f", value: scene.fog.far }
                },
            vertexShader: vert,
            fragmentShader: frag,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            fog: true
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
        if(this.globeMat === undefined) {return }
        var dist = camera.position.distanceTo(origin);
        this.globeMat.uniforms.time.value = 0.00003 * (Date.now() - this.start);
        //this.globeMat.uniforms.reflectivity.value = Math.min(Math.max(dist/600, 0.01), 0.5)
    }
}
