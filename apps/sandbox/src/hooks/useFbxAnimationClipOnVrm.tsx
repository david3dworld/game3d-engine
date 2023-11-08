/*
 * Adapted from https://github.com/pixiv/three-vrm/blob/dev/packages/three-vrm/examples/humanoidAnimation/loadMixamoAnimation.js
 *
 * Built to support 2 kind of .fbx animations: Mixamo exports and Cascadeur export.
 * - Mixamo .fbx without skin: These work out of the box without issues. What the code initially supported.
 * - Cascadeur .fbx without meshes/skin: These do not and require a very certain export process/setup and also need to be changed when importing into three.js (as of 26 July 2023).
 *
 * More notes here: https://www.notion.so/Working-with-Cascadeur-Animations-8bd19c8cda1841ac9c1b04ec71d4bd3e
 * But basically:
 * - Cascadeur animations have to be using a Mixamo exported model (X bot or Y bot) so that the rigging is proper.
 * - The first & last frame of the animation in Cascadeur has to be a T-pose i.e. disable autoposing when rigging in Cascadeur.
 *   - Without this, the model remains in a T-pose and doesn't animate at all or does so really weirdly.
 *   - With this, the animation flickers between T-pose but otherwise animated properly which isn’t ideal either.
 * - To resolve this, the code below essentially removes the first and last frame of the animation (i.e first and last track values).
 * - Also export at 30fps cause the code relies on it.
 *
 * NOTE: Without preloading when using multiple FBX animations, shit will not work properly
 * TODO: Put all this logic in a useMemo
 * NOTE: Doesn't support VRM0.0 although the original did. Should be easy to add support if needed.
 */

import * as React from 'react'
import * as Drei from '@react-three/drei'
import * as THREE from 'three'
import { VRM } from '@pixiv/three-vrm'

import { fbxToVrmRigMapMixamo } from '../maps/fbxToVrmRigMapMixamo'

const CASCADEUR_FRAME = 1 / 30

export const useFbxAnimationClipOnVrm = (
    vrm: VRM,
    fbxUrl: string,
    name?: string,
    ignoredBones = {},
) => {
    if (!vrm.humanoid) throw new Error('vrm.humanoid is undefined')

    const fbx = Drei.useFBX(fbxUrl)
    const clip = fbx.animations[0]

    const isCascadeur = clip.name !== 'mixamo.com' // this might need to be changed if we want to support other formats in the future
    if (isCascadeur && clip.duration < CASCADEUR_FRAME * 3)
        throw new Error(
            'Due to the Cascadeur needs to be at least 3 frames long for it to function properly',
        )

    const restRotationInverse = React.useMemo(() => new THREE.Quaternion(), [])
    const parentRestWorldRotation = React.useMemo(() => new THREE.Quaternion(), [])
    const _quat = React.useMemo(() => new THREE.Quaternion(), [])
    const _vec3 = React.useMemo(() => new THREE.Vector3(), [])

    // Adjust with reference to hips height.
    const animationHipsHeight = fbx.getObjectByName('mixamorigHips')?.position.y
    if (!animationHipsHeight)
        throw new Error(`FBX animation's mixamorigHips bone not found.`)

    const vrmHipsY = vrm.humanoid.getNormalizedBoneNode('hips')?.getWorldPosition(_vec3).y
    if (!vrmHipsY) throw new Error(`VRM model's hips bone not found.`)

    const vrmRootY = vrm.scene.getWorldPosition(_vec3).y
    const vrmHipsHeight = Math.abs(vrmHipsY - vrmRootY)
    const hipsPosition = vrmHipsHeight / animationHipsHeight

    // Convert each tracks for VRM use, and push to `tracks`
    const tracks: THREE.KeyframeTrack[] = [] // KeyframeTracks compatible with VRM will be added here
    for (const track of clip.tracks) {
        const [rigName, propertyName] = track.name.split('.')
        const rigNode = fbx.getObjectByName(rigName)
        const vrmBoneName = fbxToVrmRigMapMixamo[rigName]
        const vrmNode = vrm.humanoid?.getNormalizedBoneNode(vrmBoneName)

        if (!!vrmNode && ignoredBones[vrmBoneName] !== true) {
            const name = `${vrmNode.name}.${propertyName}`
            const times = !isCascadeur ? track.times : track.times.slice(0, -2) // to ignore first & last frame

            if (track instanceof THREE.QuaternionKeyframeTrack) {
                // --- Cascadeur related adjustments ---
                const lengthDiff = !isCascadeur ? 0 : 4
                const adjustedLength = track.values.length - lengthDiff * 2 // to ignore first & last frame
                const values = new Float32Array(adjustedLength)

                // --- Make values compatible with VRM model ---
                // Store rotations of rest-pose.
                rigNode?.getWorldQuaternion(restRotationInverse).invert()
                rigNode?.parent?.getWorldQuaternion(parentRestWorldRotation)

                // Retarget rotation of rig (mixamoRig prevously) to NormalizedBone.
                for (let i = 0; i < adjustedLength; i += 4) {
                    const flatQuaternion = track.values.slice(
                        lengthDiff + i,
                        lengthDiff + i + 4,
                    )
                    _quat.fromArray(flatQuaternion)

                    // 親のレスト時ワールド回転 * トラックの回転 * レスト時ワールド回転の逆
                    // Google translate: parent rest world rotation * track rotation * inverse rest world rotation
                    _quat
                        .premultiply(parentRestWorldRotation)
                        .multiply(restRotationInverse)

                    _quat.toArray(flatQuaternion)
                    values[i + 0] = _quat.x
                    values[i + 1] = _quat.y
                    values[i + 2] = _quat.z
                    values[i + 3] = _quat.w
                }

                tracks.push(new THREE.QuaternionKeyframeTrack(name, times, values))
            } else if (track instanceof THREE.VectorKeyframeTrack) {
                // --- Cascadeur related adjustments ---
                const lengthDiff = !isCascadeur ? 0 : 3
                const adjustedLength = track.values.length - lengthDiff * 2 // to ignore first & last frame
                const values = new Float32Array(adjustedLength)

                // --- Make values compatible with VRM model ---
                // Update position to match hips height.
                for (let i = 0; i < adjustedLength; i += 3) {
                    values[i + 0] = track.values[lengthDiff + i + 0] * hipsPosition
                    values[i + 1] = track.values[lengthDiff + i + 1] * hipsPosition
                    values[i + 2] = track.values[lengthDiff + i + 2] * hipsPosition
                }

                tracks.push(new THREE.VectorKeyframeTrack(name, times, values))
            }
        }
    }

    // console.log('clipTracks', JSON.stringify(clipTracks))
    const duration = !isCascadeur ? clip.duration : clip.duration - CASCADEUR_FRAME * 2
    return new THREE.AnimationClip(name ?? fbxUrl, duration, tracks, clip.blendMode)
}
