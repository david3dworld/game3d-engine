import * as THREE from 'three'
import * as React from 'react'
import * as R3F from '@react-three/fiber'
import * as Drei from '@react-three/drei'
import { VRM, VRMExpressionPresetName, VRMHumanBoneName } from '@pixiv/three-vrm'

import { useFbxAnimationClipOnVrm } from './useFbxAnimationClipOnVrm'
import { useFrame } from '@react-three/fiber'

const BLEND_DURATION = 0.25

export type AnimationInfo = {
    urlMap?: { [key: string]: string }
    active?: string
    timeScale?: number
    ignoredBones?: { [key in VRMHumanBoneName]?: boolean }
}

export const useFbxAnimationsOnVrm = (
    vrm: VRM,
    { active, urlMap = {}, timeScale = 1, ignoredBones = {} }: AnimationInfo = {},
) => {
    const animationClips: THREE.AnimationClip[] = []
    for (const key of Object.keys(urlMap)) {
        animationClips.push(useFbxAnimationClipOnVrm(vrm, urlMap[key], key, ignoredBones))
    }

    const animationApi = Drei.useAnimations(animationClips, vrm.scene)
    const prevRef = React.useRef<string | undefined>(undefined)
    const activeActionRef = React.useRef<THREE.AnimationAction | null | undefined>(
        undefined,
    )
    const running = React.useRef<boolean>(false)

    React.useEffect(() => {
        const prev = prevRef.current
        const prevAction = !prev ? undefined : animationApi.actions[prev]
        const activeAction = !active ? undefined : animationApi.actions[active]
        activeActionRef.current = activeAction
        activeAction?.play()

        if (prevAction !== undefined && prevAction !== activeAction)
            prevAction?.fadeOut(BLEND_DURATION)

        if (activeAction) {
            activeAction
                .reset()
                .setEffectiveTimeScale(timeScale)
                .setEffectiveWeight(1)
                .fadeIn(prevAction === undefined ? 0 : BLEND_DURATION)
                .play()
        }

        if (!prevAction && !activeAction) animationApi.mixer.stopAllAction()

        prevRef.current = active
    }, [vrm, active])

    // useFrame(() => {
    //     // some weird stuff started happening that animations do not keep on playing anymore
    //     const activeAction = activeActionRef.current
    //     if (!activeAction?.isRunning()) activeAction?.play()
    // }, -1)

    return animationApi
}
