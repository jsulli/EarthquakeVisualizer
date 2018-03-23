uniform vec3 glowColor;
varying float intensity;

uniform samplerCube tCube;
uniform float reflectivity;
varying vec3 vReflect;
varying float vReflectionFactor;


void main() {
    vec4 reflectedColor = textureCube(tCube, vec3(-vReflect.x, vReflect.yz));

    vec3 glow = glowColor * intensity;
    //gl_FragColor = vec4(glow, 1.0);
    //gl_FragColor = reflectedColor;
    gl_FragColor = mix( vec4(glow, 1.0), reflectedColor, reflectivity);


}
