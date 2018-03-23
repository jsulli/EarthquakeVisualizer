
Loader = function(path, name) {

    var loader = new THREE.OBJLoader()

    var obj
    loader.load(path, function(object) {
        object.traverse(function(child) {
            if(child instanceof THREE.Mesh) {
                obj = child
            }
        })
        complete(obj, name)
    })




    function complete(object, name) {
        switch(name) {
            case "countries":
                countries = object.parent
                countries.scale.multiplyScalar(20)
                console.log("object has " + countries.children.length + " children")

                var color = new THREE.Color(0x4eebb3)
                for(var i = 0; i < countries.children.length; i++) {
                    var countryGlowMat = new THREE.ShaderMaterial( {
                        uniforms:
                            {
                                "c":		{ type: "f", value: 1.4 }, //0.28 - 0.6
                                "p":		{ type: "f", value: 1.1 }, //4.2  - 6.0
                                glowColor: 	{ type: "c", value: color },
                                viewVector: { type: "v3", value: camera.position }
                            },
                        vertexShader: document.getElementById('glowVertexShader').textContent,
                        fragmentShader: document.getElementById('glowFragmentShader').textContent,
                        side: THREE.FrontSide,
                        blending: THREE.AdditiveBlending,
                        transparent: true
                    })
                    countries.children[i].material = countryGlowMat
                    var val = (Math.random() * 0.5) - 0.25;
                    countries.children[i].material.uniforms.glowColor.value = new THREE.Color(
                        color.r + ((Math.random() * 0.4) - 0.2),
                        color.g + ((Math.random() * 0.4) - 0.2),
                        color.b + ((Math.random() * 0.4) - 0.2));
                }
                scene.add(countries)
                break;
            case "countryNames":
                var nameGlowMat = new THREE.ShaderMaterial( {
                    uniforms:
                        {
                            c: 			{ type: "f",  value: 1.3 },
                            p: 			{ type: "f",  value: 1 },
                            glowColor: 	{ type: "c",  value: new THREE.Color(0xffffff) },
                            viewVector: { type: "v3", value: camera.position }
                        },
                    vertexShader: document.getElementById('glowVertexShader').textContent,
                    fragmentShader: document.getElementById('glowFragmentShader').textContent,
                    side: THREE.FrontSide,
                    blending: THREE.AdditiveBlending,
                    transparent: true
                })
                countryNames = new THREE.Mesh(object.geometry, nameGlowMat)
                countryNames.scale.multiplyScalar(20.075)
                scene.add(countryNames)
        }
    }

}
