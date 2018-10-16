import {Mesh, Vector2, Vector3} from "three"
import {GlobalCoordinates} from "./data/GlobalCoordinates"

export class GeoSpatialMap extends Mesh {

    textureEdgeLongitude
    radius

    constructor(obj, shader) {
        super(obj, shader)
    }
    //this.radius = 46.4;
    //this.texture_edge_longitude = 0;

    setTextureEdgeLongitude(texture_edge_longitude) {
        this.textureEdgeLongitude = texture_edge_longitude
    }

    setRadius(radius) {
        this.radius = radius
    }

    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180
    }

    static coordinatesToRadians(phi, lambda) {
        let radianVector = new Vector2()
        radianVector.set(
            GeoSpatialMap.degreesToRadians(-phi) + Math.PI/2,
            GeoSpatialMap.degreesToRadians(-lambda) - Math.PI/2
        )

        console.log(radianVector)
        return radianVector
    }

    addGeoSymbol(geoSymbol: GeoSymbol) {

        let phi = (90 - (geoSymbol.coordinates.lat)) * Math.PI / 180
        let theta = (180 - (geoSymbol.coordinates.lon - this.textureEdgeLongitude)) * Math.PI / 180

        console.log("phi and theta: " )
        console.log(geoSymbol.coordinates.lat)
        console.log(geoSymbol.coordinates.lon)

        geoSymbol.mesh.position.x = this.radius * Math.sin(phi) * Math.cos(theta)
        geoSymbol.mesh.position.y = this.radius * Math.cos(phi)
        geoSymbol.mesh.position.z = this.radius * Math.sin(phi) * Math.sin(theta)
        console.log("adding geo symbol with position")
        console.log(geoSymbol.mesh.position)
        this.add(geoSymbol.mesh)
    }

    coordinatesToVector3(radianCoordinates) {
        var vector = new Vector3()

        vector.set(radianCoordinates.x, radianCoordinates.y - Math.PI/2, this.radius);
        //window.vector = vector;
        console.log(vector, this.radius);
        vector.set(
            this.radius * Math.cos(vector.y) * Math.sin(vector.x),
            this.radius * Math.sin(vector.y) * Math.sin(vector.x),
            this.radius * Math.cos(vector.x)
        );

        return vector;
    }
}

export class GeoSymbol {

    mesh
    coordinates: GlobalCoordinates

    constructor(object, coordinates: GlobalCoordinates) {
        this.mesh = object
        this.coordinates = coordinates
    }

}


