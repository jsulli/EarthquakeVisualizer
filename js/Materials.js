
Materials = function() {

    this.baseColor = new THREE.Color(0x4eebb3)

    this.initGlow = function(vert, frag) {
        this.countryGlowMat = new THREE.ShaderMaterial( {
            uniforms:
                {
                    "c":		{ type: "f", value: 1.4 }, //0.28 - 0.6
                    "p":		{ type: "f", value: 1.1 }, //4.2  - 6.0
                    glowColor: 	{ type: "c", value: this.baseColor },
                    viewVector: { type: "v3", value: camera.position }
                },
            vertexShader:  vert,
            fragmentShader: frag,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        })

        this.nameGlowMat = new THREE.ShaderMaterial( {
            uniforms:
                {
                    c: 			{ type: "f",  value: 1.3 },
                    p: 			{ type: "f",  value: 1 },
                    glowColor: 	{ type: "c",  value: new THREE.Color("#ffffff") },
                    viewVector: { type: "v3", value: camera.position }
                },
            vertexShader: vert,
            fragmentShader: frag,
            side: THREE.FrontSide,
            blending: THREE.SubtractiveBlending,
            transparent: true
        })
    }

    this.initGlobe = function(vert, frag) {
        this.start = Date.now()
        this.globeMat = new THREE.ShaderMaterial({
            uniforms:
                {
                    c:              { type: "f", value: 0.0001 },
                    p:              { type: "f", value: 1.0 },
                    time:           { type: "f", value: 0.0 },
                    reflectivity:   { type: "f", value: 0.0 },
                    glowColor:      { type: "c", value: new THREE.Color(0x279989)},
                    viewVector:     { type: "v3", value: camera.position}
                },
            vertexShader: vert,
            fragmentShader: frag,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            fog: false
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
        this.globeMat.uniforms.time.value = 0.00005 * (Date.now() - this.start);
        //this.globeMat.uniforms.reflectivity.value = Math.min(Math.max(dist/600, 0.01), 0.5)
    }
}
