import * as React from 'react'
import * as THREE from 'three'
import * as R3F from '@react-three/fiber'
import { VRM } from '@pixiv/three-vrm'

import { useCameraControls } from '../hooks/useLevaControls'

// Functions on the same principles as https://github.com/pmndrs/three-stdlib/blob/048da9a1d104d86e1fcb8b32ffc2e01d9b962002/src/controls/PointerLockControls.ts#L10
// But but with VRM in mind
export function useFirstPersonCamera(
    vrm?: VRM,
    { maxDownAngle = 0, maxUpAngle = 0, maxHorizontalAngle = Math.PI / 3 } = {},
) {
    const [{ cameraMode }] = useCameraControls()

    const eulerY = React.useMemo(() => new THREE.Euler(0, 0, 0, 'YXZ'), [])
    const eulerX = React.useMemo(() => new THREE.Euler(0, 0, 0, 'YXZ'), [])
    const neck = React.useMemo(() => vrm?.humanoid?.getNormalizedBoneNode('neck'), [vrm])
    const head = React.useMemo(() => vrm?.humanoid?.getNormalizedBoneNode('head'), [vrm])

    const onDocumentMouseMove = React.useCallback(
        (e) => {
            if (!vrm || !vrm.scene || !head || !neck) return
            if (cameraMode !== 'firstPerson') return
            if (!document.pointerLockElement) return

            const mouseNode = head

            // move character - left right
            eulerY.copy(vrm.scene.rotation)
            eulerY.y -= e.movementX * 0.002 // left right
            // eulerY.y = Math.min(maxHorizontalAngle, Math.max(-maxHorizontalAngle, eulerY.y))
            vrm.scene.rotation.copy(eulerY)

            // move head - up down
            eulerX.copy(mouseNode.rotation)
            eulerX.x += e.movementY * 0.002 // up down
            eulerX.x = Math.max(
                Math.PI / 2 - (Math.PI - maxUpAngle),
                Math.min(Math.PI / 2 - maxDownAngle, eulerX.x),
            )
            mouseNode.rotation.copy(eulerX)
        },
        [vrm, cameraMode, maxDownAngle, maxUpAngle, maxHorizontalAngle],
    )

    React.useEffect(() => {
        document.addEventListener('mousemove', onDocumentMouseMove)
        return () => {
            document.removeEventListener('mousemove', onDocumentMouseMove)
        }
    }, [vrm, cameraMode, maxDownAngle, maxUpAngle, maxHorizontalAngle])

    return
}
