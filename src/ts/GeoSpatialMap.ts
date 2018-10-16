import {Mesh, Vector2, Vector3} from "three"

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

    addGeoSymbol(geoSymbol) {
        /*if(!(geoSymbol instanceof GeoSymbol)) {
            console.warn("must provide an instance of GeoSymbol")
            return
        }*/

        let phi = (90 - (geoSymbol.coordinates.phi)) * Math.PI / 180
        let theta = (180 - (geoSymbol.coordinates.label - this.textureEdgeLongitude)) * Math.PI / 180

        geoSymbol.mesh.position.x = this.radius * Math.sin(phi) * Math.cos(theta)
        geoSymbol.mesh.position.y = this.radius * Math.cos(phi)
        geoSymbol.mesh.position.z = this.radius * Math.sin(phi) * Math.sin(theta)

        console.log("creating geo symbol")

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
    coordinates

    constructor(object, coordinates) {
        this.mesh = object
        this.coordinates = {
            phi: coordinates.phi,
            lambda: coordinates.lamda
        }
    }

}


