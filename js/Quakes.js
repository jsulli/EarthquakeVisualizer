
function Quakes(path) {
    var _this = this
    this.markers = []

    // load json
    $.getJSON(path, function(json) {
        _this.init(json)
    })

    this.init = function(data) {
        this.data = data
        ObjectLoader('./assets/models/pin.obj', function(obj) {
            _this.markerObj = new THREE.Mesh(obj.geometry, new THREE.MeshBasicMaterial())
            _this.markerObj.scale.x = 35
            _this.markerObj.scale.y = 35
            _this.markerObj.scale.z = 12
            _this.markAll()
        })
        ObjectLoader('./assets/models/ping.obj', function(obj) {
            _this.ping = new THREE.Mesh(obj.geometry, new THREE.MeshBasicMaterial({
                color: 0xff1509,
                transparent: true,
                opacity: 0.7
            }))
            _this.ping.scale.multiplyScalar(10)
            _this.ping.visible = false
            scene.add(_this.ping)
        })
    }

    this.setPing = function(pos) {
        this.ping.position.set(pos.x, pos.y, pos.z)
        this.ping.lookAt(origin)
        this.ping.visible = true
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
        marker.translateZ(0)
        //marker.rotateX(90 * (Math.PI / 180))
        marker.scale.multiplyScalar(0.003)
        marker.scale.multiplyScalar(Math.pow(quake.properties.mag, 3))
        this.markers.push(marker)
        scene.add(marker)
    }

    this.clearMarkers = function() {
        this.markers.forEach(function(marker) {
            scene.remove(marker)
        })
        this.markers = []
    }
}
