import * as THREE from 'three'
import * as React from 'react'
import * as R3F from '@react-three/fiber'

import { VRM, VRMExpression, VRMExpressionPresetName } from '@pixiv/three-vrm'
import { useVrmBones } from './useVrmBones'

const angleLimit = (60 * Math.PI) / 180

export const useVrmLookAt = (
    vrm: VRM,
    target?: 'camera' | THREE.Object3D,
    moveHead = false,
    moveBody = false,
) => {
    const { camera } = R3F.useThree()
    const bones = useVrmBones(vrm)

    React.useEffect(() => {
        if (!vrm.lookAt) return
        vrm.lookAt.target = target === 'camera' ? camera : target
    }, [vrm, target, camera, bones])

    const v = React.useRef(new THREE.Vector3())
    const _identQ = React.useRef(new THREE.Quaternion())
    const _zV = React.useRef(new THREE.Vector3(0, 0, -1))
    const _tmpQ0 = React.useRef(new THREE.Quaternion())
    const _tmpV0 = React.useRef(new THREE.Vector3())

    R3F.useFrame(() => {
        // HEAD MOVEMENT
        if (moveHead) {
            const followerBone = bones.neck
            if (followerBone) {
                const targetDirection = followerBone
                    // .worldToLocal(_tmpV0.setFromMatrixPosition(target.matrixWorld))
                    .worldToLocal(v.current.copy(camera.position))
                    .normalize()

                let rot = _tmpQ0.current.setFromUnitVectors(_zV.current, targetDirection)
                const angle = 2 * Math.acos(rot.w)

                let speedFactor = 0.08
                if (angle > angleLimit * 1.5) {
                    rot = _identQ.current
                    speedFactor = 0.04
                } else if (angle > angleLimit) {
                    rot.setFromAxisAngle(
                        _tmpV0.current.set(rot.x, rot.y, rot.z).normalize(),
                        angleLimit,
                    )
                }

                followerBone.quaternion.slerp(rot, speedFactor)
            }
            // HEAD MOVEMENT END
        }
    })

    moveBody
}
