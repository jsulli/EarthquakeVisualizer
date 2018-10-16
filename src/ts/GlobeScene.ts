import {BaseScene} from "./BaseScene"
import {
    Color,
    IcosahedronBufferGeometry,
    Mesh,
    MeshBasicMaterial,
    Raycaster,
    SphereBufferGeometry
} from "three"

import {Materials} from "./Materials"
import {ObjLoader} from "./ObjLoader"
import {GeoSpatialMap} from "./GeoSpatialMap"
import {QuakeDataLoader} from "./QuakeDataLoader"
import {QuakeMarkers} from "./QuakeMarkers"
import {QuakeList} from "./QuakeList"


export class GlobeScene extends BaseScene {

    private materials: Materials

    private countryObjPath = './assets/models/countries.obj'
    private namesObjPath = './assets/models/countryNames.obj'

    private globeModel
    private countriesModel
    private namesModel

    private gpsSurface

    private scaleFactor = 20

    private quakeMarkers
    private quakeList




    constructor() {
        super()

        this.materials = new Materials(this.camera, this.scene)

        this.initObjects()
        this.initGPS()
        this.initQuakes()
    }


    private initObjects() {
        this.materials.initGlow(() => {
            ObjLoader.load(this.countryObjPath, (obj) => {
                this.countriesModel = obj.parent
                this.countriesModel.scale.multiplyScalar(this.scaleFactor)
                this.countriesModel.children.forEach((child) => {
                    let mat = this.materials.countryMat.clone()
                    mat.color = Materials.randomizeColor(new Color(0x5bdec6))
                    child.material = mat
                })
                this.scene.add(this.countriesModel)
            })

            ObjLoader.load(this.namesObjPath, (obj) => {
                this.namesModel = new Mesh(obj.geometry, Materials.nameGlowMat)
                this.namesModel.scale.multiplyScalar(20.075)
                this.scene.add(this.namesModel)
            })
        })

        this.materials.initGlobe(() => {
            let sphere = new IcosahedronBufferGeometry(149, 5)
            this.globeModel = new Mesh(sphere, Materials.globeMat)
            this.scene.add(this.globeModel)
        })
    }

    private initGPS() {
        let globeShader = new MeshBasicMaterial()
        let obj = new SphereBufferGeometry(150, 50, 50)
        this.gpsSurface = new GeoSpatialMap(obj, globeShader)
        this.gpsSurface.setTextureEdgeLongitude(-260.0)
        this.gpsSurface.setRadius(150)
    }


    private initQuakes() {
        let quakeData = new QuakeDataLoader("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", () => {
            this.quakeMarkers = new QuakeMarkers(quakeData, this.gpsSurface, this.scene, this.camera, this.materials)
            this.quakeList = new QuakeList(this.quakeMarkers, quakeData)
            this.quakeMarkers.setList(this.quakeList)
        })
    }


    protected handleRaycastIntersections(ray: Raycaster) {
        let intersects = ray.intersectObject(this.globeModel)
        if (intersects.length > 0) {
            let pos = intersects[0].point
            this.quakeMarkers.findNearest(pos)
        }
    }
}
