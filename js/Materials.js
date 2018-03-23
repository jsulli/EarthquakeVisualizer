
Materials = function() {

    var countryGlowMat = new THREE.ShaderMaterial( {
        uniforms:
            {
                "c":		{ type: "f", value: 0.6 }, //0.28 - 0.6
                "p":		{ type: "f", value: 6.0 }, //4.2  - 6.0
                glowColor: 	{ type: "c", value: new THREE.Color(0x4eebb3) },
                viewVector: { type: "v3", value: camera.position }
            },
        vertexShader: document.getElementById('glowVertexShader').textContent,
        fragmentShader: document.getElementById('glowFragmentShader').textContent,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    })

    var nameGlowMat = new THREE.ShaderMaterial( {
        uniforms:
            {
                c: 			{ type: "f",  value: 0.8 },
                p: 			{ type: "f",  value: 6.0 },
                glowColor: 	{ type: "c",  value: new THREE.Color("#ffffff") },
                viewVector: { type: "v3", value: camera.position }
            },
        vertexShader: document.getElementById('glowVertexShader').textContent,
        fragmentShader: document.getElementById('glowFragmentShader').textContent,
        side: THREE.FrontSide,
        blending: THREE.SubtractiveBlending,
        transparent: true
    })

    // globeshader: new THREE.MeshBasicMaterial({
    //     shader: THREE.SmoothShading,
    //     map: globetexture,
    //     transparent: true
    // })
}
