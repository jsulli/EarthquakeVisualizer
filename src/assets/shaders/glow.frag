
uniform vec3 glowColor;
varying float intensity;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
void main() {

    vec3 glow = glowColor * intensity;
    gl_FragColor = vec4(glow, 1.0);
    #ifdef USE_FOG
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    #endif
}
