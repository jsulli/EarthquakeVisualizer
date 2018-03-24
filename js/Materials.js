
Materials = function() {

    this.baseColor = new THREE.Color(0x4eebb3)

    this.initGlow = function(vert, frag) {
        this.countryGlowMat = new THREE.ShaderMaterial( {
            uniforms:
                {
                    "c":		{ type: "f", value: 1.4 }, //0.28 - 0.6
                    "p":		{ type: "f", value: 1.1 }, //4.2  - 6.0
                    glowColor: 	{ type: "c", value: this.baseColor },
                    viewVector: { type: "v3", value: camera.position },
                    fogColor:    { type: "c", value: scene.fog.color },
                    fogNear:     { type: "f", value: scene.fog.near },
                    fogFar:      { type: "f", value: scene.fog.far }
                },
            vertexShader:  vert,
            fragmentShader: frag,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            fog: true
        })

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

        this.outerGlowMat = new THREE.ShaderMaterial({
            uniforms:
                {
                    c: 			{ type: "f",  value: 0.1 },
                    p: 			{ type: "f",  value: 3.0 },
                    glowColor: 	{ type: "c",  value: new THREE.Color("#86C8BC") },
                    viewVector: { type: "v3", value: camera.position }
                },
            vertexShader: vert,
            fragmentShader: frag,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            fog: false
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
