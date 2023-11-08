import * as React from 'react'
import * as R3F from '@react-three/fiber'
import * as THREE from 'three'

const Light = ({
    position,
    intensity = 0.7,
    castShadow = true,
    indicator = true,
    mapSize = 512,
    bias = 0,
    normalBias = 0,
}) => (
    <>
        <mesh visible={indicator} scale={0.25} position={position}>
            <sphereGeometry />
            <meshStandardMaterial color={[1, 1, 0]} />
        </mesh>

        <pointLight
            castShadow={castShadow}
            position={position}
            intensity={intensity}
            //
            // reduce for perf
            shadow-mapSize-width={mapSize}
            shadow-mapSize-height={mapSize}
            //
            // for fixing shadow acne, try small values < 0.01 (pos or negative)
            shadow-bias={bias}
            shadow-normalBias={normalBias}
        />
    </>
)

export default Light
