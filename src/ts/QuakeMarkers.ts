import {ObjLoader} from "./ObjLoader"
import {Mesh, MeshBasicMaterial} from "three"
import {GeoSymbol} from "./GeoSpatialMap"
import {GlobalCoordinates} from "./data/GlobalCoordinates"

export class QuakeMarkers {
    
    private markers = []
    private markerObj
    private ping

    private scene
    private camera

    private quakeList

    constructor(quakeData, gpsSurface, scene, camera, materials) {
        this.scene = scene
        this.camera = camera

        ObjLoader.load('./assets/models/pin.obj', (obj) => {
            console.log("finished loading marker")
            this.markerObj = new Mesh(obj.geometry, new MeshBasicMaterial())
            this.markerObj.scale.x = 35
            this.markerObj.scale.y = 35
            this.markerObj.scale.z = 12
            this.initMarkers(quakeData, gpsSurface)
        })
        ObjLoader.load('./assets/models/ping.obj', (obj) => {
            this.ping = new Mesh(obj.geometry, materials.pingMat)
            this.ping.scale.multiplyScalar(10)
            this.ping.visible = false
            scene.add(this.ping)
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
        let dist = 1000
        let nearestIndex
        for (let i = 0; i < this.markers.length; i++) {
            let cur = this.markers[i].position.distanceTo(pos)
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
        let target = this.markers[index].position
        let pos = this.camera.moveToTarget(target)
        this.setPing(target)
        this.quakeList.activateIndex(index)
    }


    initMarkers(quakeData, gpsSurface) {
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
        let marker = this.markerObj.clone()
        gpsSurface.addGeoSymbol(
            new GeoSymbol(marker, new GlobalCoordinates(
                quake.geometry.coordinates[1],
                quake.geometry.coordinates[0]
            ))
        )
        marker.lookAt(gpsSurface.position)
        marker.translateZ(0)
        marker.scale.multiplyScalar(0.003)
        marker.scale.multiplyScalar(Math.pow(quake.properties.mag, 3))
        this.markers.push(marker)
        this.scene.add(marker)
    }

}
