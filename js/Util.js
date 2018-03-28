function Util() {}

Util.lookAtAndOrient = function(
    objectToAdjust,
    pointToLookAt,
    pointToOrientXTowards) {

    var v1 = pointToOrientXTowards.position.clone().sub(objectToAdjust.position).normalize()
    var v2 = pointToLookAt.clone().sub(objectToAdjust.position).normalize()
    var v3 = new THREE.Vector3().crossVectors(v2, v1).normalize()
    objectToAdjust.up.copy(v3)

    objectToAdjust.lookAt(pointToLookAt)
}

Util.findAngle = function(p0, p1, p2) {
    var b = Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2),
        a = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2),
        c = Math.pow(p2.x - p0.x, 2) + Math.pow(p2.y - p0.y, 2)
    return Math.acos((a + b - c) / Math.sqrt(4 * a * b))
}
