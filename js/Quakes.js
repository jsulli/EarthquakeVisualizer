var data

function Quakes(path) {
    console.log("loading json")
    $.getJSON(path, function(json) {
        console.log(json)
        data = json
        console.log("json loaded")


        var cylinder = new THREE.CylinderBufferGeometry(0.2, 1, 10, 10, 2)
        var obj = new THREE.Mesh(cylinder, new THREE.MeshBasicMaterial())

        data.features.forEach(function(element) {
            var obj = new THREE.Mesh(cylinder, new THREE.MeshBasicMaterial())
            gpsSurface.addGeoSymbol(
                new THREE.GeoSpatialMap.GeoSymbol(obj, {
                    phi: element.geometry.coordinates[0],
                    lambda: element.geometry.coordinates[1]
                })
            )
            obj.lookAt(gpsSurface.position)
            obj.translateZ(-5)
            obj.rotateX(90 * (Math.PI / 180))

            scene.add(obj)
        })

    })
}
