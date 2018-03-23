
function ObjectLoader(path, onLoad) {

    var loader = new THREE.OBJLoader()

    loader.load(path, function(object) {
        var obj
        object.traverse(function(child) {
            if(child instanceof THREE.Mesh) {
                obj = child
            }
        })
        onLoad(obj)
    })
}
