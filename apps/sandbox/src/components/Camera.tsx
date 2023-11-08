import * as React from 'react'
import * as THREE from 'three'
import * as R3F from '@react-three/fiber'
import * as Drei from '@react-three/drei'
import * as Leva from 'leva'

import { useCameraControls } from '../hooks/useLevaControls'
import { Controls } from '../maps/keyboardControlsMap'

const Camera = () => {
    const camera = R3F.useThree((state) => state.camera) as THREE.PerspectiveCamera
    const [{ cameraMode, fov }, set] = useCameraControls()

    const [sub] = Drei.useKeyboardControls<Controls>()
    React.useEffect(() => {
        sub(
            (state) => state.toggleCamera,
            (pressed) => {
                if (pressed)
                    set({ cameraMode: cameraMode === 'fly' ? 'firstPerson' : 'fly' })
            },
        )
    }, [cameraMode])

    React.useEffect(() => {
        camera.fov = fov
        camera.updateProjectionMatrix()
    }, [fov, camera])

    return (
        <>
            {cameraMode === 'fly' && (
                <>
                    <Drei.PointerLockControls selector="canvas" />
                    <Drei.FlyControls
                        makeDefault
                        rollSpeed={0.55}
                        movementSpeed={2.5}
                        dragToLook
                    />
                </>
            )}
        </>
    )
}

export default Camera
