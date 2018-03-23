
Loader = function(path, name) {

    var loader = new THREE.OBJLoader2()
    loader.setModelName(name)
    loader.load(path, loadComplete, null, null, null, false)

    function loadComplete(event) {
        console.log("finished loading " + event.detail.modelName)

        switch(event.detail.modelName) {
            case "globe":
                globe = event.detail.loaderRootNode
                globe.scale.set(100,100,100)
                //scene.add(globe)
                break
            case "countries":
                countries = event.detail.loaderRootNode
                countries.scale.multiplyScalar(20)
                countries.children.forEach(function(country) {
                    country.material = Materials.countryGlowMat
                })
                countries.material = Materials.countryGlowMat
                scene.add(countries)
                break
            case "countryNames":
                countryNames = event.detail.loaderRootNode
                countryNames.scale.multiplyScalar(20.2)
                countryNames.material = Materials.nameGlowMat
                scene.add(countryNames)
        }
    }
}

Loader('./assets/models/globe.obj', "globe")
Loader('./assets/models/countries.obj', "countries")
Loader('./assets/models/countryNames.obj', "countryNames")
