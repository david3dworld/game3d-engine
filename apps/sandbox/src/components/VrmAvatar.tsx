// GOAL:
// - General purpose VRM component
// - May be support BVH and VMD animations.

import * as THREE from 'three'
import * as React from 'react'
import * as R3F from '@react-three/fiber'
import * as Drei from '@react-three/drei'

import { VRM, VRMExpressionPresetName, VRMHumanBoneName } from '@pixiv/three-vrm'

import { Interactive } from '@react-three/xr'
import { useVrm } from '../hooks/useVrm'
import { useVrmBlinking } from '../hooks/useVrmBlinking'
import { useFbxAnimationsOnVrm, AnimationInfo } from '../hooks/useFbxAnimationsOnVrm'
import VrmAudio from './VrmAudio'
import { AudioInfo, AudioCallback } from './VrmAudioExpressions'
import { useVrmFirstPerson } from '../hooks/useVrmFirstPerson'
import { useVrmLookAt } from '../hooks/useVrmLookAt'
import { useVrmBones, VrmBonesMap } from '../hooks/useVrmBones'

const VRM_URL = './vrm/VRM1_Constraint_Twist_Sample.vrm'

export type VrmAvatarProps = {
    vrmUrl?: string
    animation?: AnimationInfo
    audio?: AudioInfo
    lookAtTarget?: 'camera' | THREE.Object3D
    lookAtMoveHead?: boolean
    lookAtMoveBody?: boolean
    isFirstPerson?: boolean
    shadows?: boolean
    renderCallback?: (
        vrm: VRM,
        rootState: R3F.RootState,
        delta: number,
        bones: VrmBonesMap,
    ) => void
    audioCallback?: AudioCallback
    onVrmLoad?: (vrm: VRM) => void
    primitiveProps?: R3F.PrimitiveProps
} & Exclude<R3F.GroupProps, 'lookAt'>

const VrmAvatar = (
    {
        vrmUrl = VRM_URL,
        animation,
        audio,
        lookAtTarget,
        lookAtMoveHead = undefined,
        lookAtMoveBody = undefined,
        isFirstPerson = undefined,
        shadows = true,
        renderCallback,
        audioCallback,
        onVrmLoad,
        primitiveProps,
        onClick,
        ...groupProps
    }: VrmAvatarProps,
    ref,
) => {
    const { vrm } = useVrm(vrmUrl, shadows)
    useVrmFirstPerson(vrm, isFirstPerson)
    useVrmBlinking(vrm)
    useVrmLookAt(vrm, lookAtTarget, lookAtMoveHead, lookAtMoveBody)
    const bones = useVrmBones(vrm)

    useFbxAnimationsOnVrm(vrm, animation)

    React.useEffect(() => {
        if (ref) ref.current = vrm
        if (onVrmLoad) onVrmLoad(vrm)
    }, [vrm, onVrmLoad])

    R3F.useFrame((rootState, delta) => {
        vrm.update(delta) // updates vrm model's state, for expressions, animations, etc
        if (renderCallback) renderCallback(vrm, rootState, delta, bones)
    })

    const [audioPlay, setAudioPlay] = React.useState(false)

    return (
        <group {...groupProps}>
            {audio && (
                <VrmAudio
                    key={audio.url}
                    vrm={vrm}
                    audio={audio}
                    audioCallback={audioCallback}
                    play={audioPlay}
                />
            )}
            <React.Suspense>
                <primitive object={vrm.scene} {...primitiveProps} />

                {/* Click helper mesh */}
                <mesh
                    visible={false}
                    position={[0, 0.8, 0]}
                    onClick={(e) => {
                        console.log('vrm onclick')
                        setAudioPlay(!audioPlay)
                        if (onClick) onClick(e)
                    }}
                >
                    <boxGeometry args={[0.5, 1.6, 0.5]} />
                    <meshBasicMaterial opacity={0.25} transparent />
                </mesh>
            </React.Suspense>
        </group>
    )
}

export default React.forwardRef(VrmAvatar)
