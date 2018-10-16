import {Mesh} from "three"
import * as THREE from "three"
(window as any).THREE = THREE;
import 'three/examples/js/loaders/OBJLoader'

export class ObjLoader {

    static load(path, onLoad?) {
        let loader = new THREE.OBJLoader()

        loader.load(path, function(object) {
            let obj
            object.traverse(function(child) {
                if (child instanceof Mesh) {
                    obj = child
                }
            })
            onLoad(obj)
        })
    }
}
