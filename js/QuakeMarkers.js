function QuakeMarkers() {
    var _this = this
    this.markers = []


    ObjLoader.load('./assets/models/pin.obj', function(obj) {
        _this.markerObj = new THREE.Mesh(obj.geometry, new THREE.MeshBasicMaterial())
        _this.markerObj.scale.x = 35
        _this.markerObj.scale.y = 35
        _this.markerObj.scale.z = 12
        _this.initMarkers()
    })
    ObjLoader.load('./assets/models/ping.obj', function(obj) {
        _this.ping = new THREE.Mesh(obj.geometry, materials.pingMat)
        _this.ping.scale.multiplyScalar(10)
        _this.ping.visible = false
        scene.add(_this.ping)
    })


    this.setPing = function(pos) {
        this.ping.position.set(pos.x, pos.y, pos.z)
        this.ping.lookAt(origin)
        this.ping.visible = true
    }


    this.findNearest = function(pos) {
        var dist = 1000
        var nearestIndex
        for (var i = 0; i < this.markers.length; i++) {
            var cur = this.markers[i].position.distanceTo(pos)
            if (cur < dist) {
                dist = cur
                nearestIndex = i
            }
        }
        if (dist < 7) {
            this.selectIndex(nearestIndex)
        }
    }


    this.selectIndex = function(index) {
        var target = this.markers[index].position
        camera.moveToTarget(target)
        this.setPing(target)
        quakeList.activateIndex(index)
    }


    this.initMarkers = function() {
        quakeData.getQuakes().forEach(function(quake) {
            _this.createMarker(quake)
        })
    }


    this.clearQuakes = function() {
        this.markers.forEach(function(marker) {
            scene.remove(marker)
        })
        quakeList.clearList()
        this.markers = []
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
        marker.scale.multiplyScalar(0.003)
        marker.scale.multiplyScalar(Math.pow(quake.properties.mag, 3))
        this.markers.push(marker)
        scene.add(marker)
    }

}

QuakeMarkers.prototype.constructor = QuakeMarkers
