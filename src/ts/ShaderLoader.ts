import {DefaultLoadingManager, FileLoader} from "three"


export class ShaderLoader {

    constructor(vertex_url, fragment_url, onLoad, onProgress?, onError?) {
        var vertex_loader = new FileLoader(DefaultLoadingManager)
        vertex_loader.setResponseType('text')
        vertex_loader.load(vertex_url, function(vertex_text) {
            var fragment_loader = new FileLoader(DefaultLoadingManager)
            fragment_loader.setResponseType('text')
            fragment_loader.load(fragment_url, function(fragment_text) {
                onLoad(vertex_text, fragment_text)
            })
        }, onProgress, onError)
    }
}
