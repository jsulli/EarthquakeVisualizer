import {ObjLoader} from "./ObjLoader"
import {Mesh, MeshBasicMaterial} from "three"
import {GeoSymbol} from "./GeoSpatialMap"

export class QuakeMarkers {
    
    
    markers = []
    markerObj
    ping

    scene
    camera

    quakeData
    quakeList

    constructor(quakeData, gpsSurface, scene, camera, materials) {
        let _this = this
        this.quakeData = quakeData
        this.scene = scene
        this.camera = camera

        ObjLoader.load('./assets/models/pin.obj', function(obj) {
            _this.markerObj = new Mesh(obj.geometry, new MeshBasicMaterial())
            _this.markerObj.scale.x = 35
            _this.markerObj.scale.y = 35
            _this.markerObj.scale.z = 12
            _this.initMarkers(quakeData, gpsSurface)
        })
        ObjLoader.load('./assets/models/ping.obj', function(obj) {
            _this.ping = new Mesh(obj.geometry, materials.pingMat)
            _this.ping.scale.multiplyScalar(10)
            _this.ping.visible = false
            scene.add(_this.ping)
        })
    }


    setList(quakeList) {
        this.quakeList = quakeList
    }


    setPing(pos) {
        this.ping.position.set(pos.x, pos.y, pos.z)
        this.ping.lookAt(origin)
        this.ping.visible = true
    }


    findNearest(pos) {
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


    selectIndex(index) {
        var target = this.markers[index].position
        let pos = this.camera.moveToTarget(target)
        this.setPing(target)
        this.quakeList.activateIndex(index)
    }


    initMarkers(quakeData, gpsSurface) {
        console.log("there are " + quakeData.getQuakes().count + " quakes")
        quakeData.getQuakes().forEach((quake) => {
            this.createMarker(quake, gpsSurface)
        })
    }


    clearMarkers() {
        this.markers.forEach((marker) => {
            this.scene.remove(marker)
        })
        this.quakeList.clearList()
        this.markers = []
    }


    createMarker(quake, gpsSurface) {
        var marker = this.markerObj.clone()
        gpsSurface.addGeoSymbol(
            new GeoSymbol(marker, {
                phi: quake.geometry.coordinates[1],
                lambda: quake.geometry.coordinates[0]
            })
        )
        marker.lookAt(gpsSurface.position)
        marker.translateZ(0)
        marker.scale.multiplyScalar(0.003)
        marker.scale.multiplyScalar(Math.pow(quake.properties.mag, 3))
        this.markers.push(marker)
        this.scene.add(marker)
    }

}
