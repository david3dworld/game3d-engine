import * as React from 'react'
import * as R3F from '@react-three/fiber'
import * as Drei from '@react-three/drei'
import * as THREE from 'three'

const Sun = ({
    // Ideally, I should hook it up with the character or cmaera position for the shadows sake
    position = [100, 100, 100],
    color = undefined,
    intensity = 1,
    castShadow = true,
    indicator = true,
    mapSize = 1024,
    shadowCameraArea = 50,
    // for fixing shadow acne, try small values < 0.001 (pos or negative)
    bias = 0,
    normalBias = 0,
}: any) => (
    <>
        <Drei.Sphere
            visible={indicator}
            scale={20}
            position={[position[0] * 50, position[1] * 50, position[2] * 50]}
        >
            <sphereGeometry />
            <meshStandardMaterial color={[5, 5, 0]} />
        </Drei.Sphere>

        <Drei.Sky
            // distance={100}
            // mieCoefficient={0.1}
            // mieDirectionalG={0.6}
            // rayleigh={1}
            // turbidity={12}
            sunPosition={position}
        />
        <directionalLight
            color={color}
            position={position}
            intensity={intensity}
            castShadow={castShadow}
            //
            // reduce for perf
            shadow-mapSize-width={mapSize}
            shadow-mapSize-height={mapSize}
            //
            // Change for environment size, affects shadow size/quality
            shadow-camera-far={500}
            shadow-camera-left={-shadowCameraArea}
            shadow-camera-right={shadowCameraArea}
            shadow-camera-top={shadowCameraArea}
            shadow-camera-bottom={-shadowCameraArea}
            //
            // for fixing shadow acne, try small values < 0.01 (pos or negative)
            shadow-bias={bias}
            shadow-normalBias={normalBias}
        />
    </>
)

export default Sun
