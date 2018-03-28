function ObjLoader() {}

ObjLoader.load = function(path, onLoad) {
    var loader = new THREE.OBJLoader()

    loader.load(path, function(object) {
        var obj
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                obj = child
            }
        })
        onLoad(obj)
    })
}
