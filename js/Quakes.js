
function Quakes(path) {
    var _this = this

    // load json
    $.getJSON(path, function(json) {
        _this.init(json)
    })

    this.init = function(data) {
        this.data = data
        var geo = new THREE.CylinderBufferGeometry(0.2, 1, 10, 10, 2)
        this.markerObj = new THREE.Mesh(geo, new THREE.MeshBasicMaterial())

        //this.createMarker(this.data.features[12])
        this.markAll()
    }


    this.markAll = function() {
        this.data.features.forEach(function(quake) {
            _this.createMarker(quake)
        })
    }

    this.createMarker = function(quake) {
        var marker = this.markerObj.clone()
        gpsSurface.addGeoSymbol(
            new THREE.GeoSpatialMap.GeoSymbol(marker, {
                phi: quake.geometry.coordinates[1],
                lambda: quake.geometry.coordinates[0]
            })
        )
        marker.lookAt(gpsSurface.position)
        marker.translateZ(-5)
        marker.rotateX(90 * (Math.PI / 180))
        marker.scale.multiplyScalar(0.6)
        marker.scale.multiplyScalar(Math.log(quake.properties.mag))
        scene.add(marker)
    }
}
