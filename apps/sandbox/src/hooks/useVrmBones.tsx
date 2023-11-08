import * as React from 'react'
import * as THREE from 'three'

import { VRM } from '@pixiv/three-vrm'

// there's a lot more bones available in VRMHumanBoneName
export const getVrmBones = (vrm: VRM) => ({
    head: vrm.humanoid.getNormalizedBoneNode('head'),
    neck: vrm.humanoid.getNormalizedBoneNode('neck'),
    upperChest: vrm.humanoid.getNormalizedBoneNode('upperChest'),
    chest: vrm.humanoid.getNormalizedBoneNode('chest'),
    hips: vrm.humanoid.getNormalizedBoneNode('hips'),
    spine: vrm.humanoid.getNormalizedBoneNode('spine'),
    leftShoulder: vrm.humanoid.getNormalizedBoneNode('leftShoulder'),
    rightShoulder: vrm.humanoid.getNormalizedBoneNode('rightShoulder'),
    leftEye: vrm.humanoid.getNormalizedBoneNode('leftEye'),
    rightEye: vrm.humanoid.getNormalizedBoneNode('rightEye'),
    leftUpperArm: vrm.humanoid.getNormalizedBoneNode('leftUpperArm'),
    rightUpperArm: vrm.humanoid.getNormalizedBoneNode('rightUpperArm'),
    leftLowerArm: vrm.humanoid.getNormalizedBoneNode('leftLowerArm'),
    rightLowerArm: vrm.humanoid.getNormalizedBoneNode('rightLowerArm'),
    leftHand: vrm.humanoid.getNormalizedBoneNode('leftFoot'),
    rightHand: vrm.humanoid.getNormalizedBoneNode('rightHand'),
    leftUpperLeg: vrm.humanoid.getNormalizedBoneNode('leftUpperLeg'),
    rightUpperLeg: vrm.humanoid.getNormalizedBoneNode('rightUpperLeg'),
    leftLowerLeg: vrm.humanoid.getNormalizedBoneNode('leftLowerLeg'),
    rightLowerLeg: vrm.humanoid.getNormalizedBoneNode('rightLowerLeg'),
    leftFoot: vrm.humanoid.getNormalizedBoneNode('leftFoot'),
    rightFoot: vrm.humanoid.getNormalizedBoneNode('rightFoot'),
})

export type VrmBonesMap = ReturnType<typeof getVrmBones>

export const useVrmBones = (vrm: VRM) =>
    React.useMemo(() => {
        return getVrmBones(vrm)
    }, [vrm])
