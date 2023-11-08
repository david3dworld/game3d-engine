/**
 * A map from Mixamo rig name to VRM Humanoid bone name
 */
const PREFIX = 'mixamorig'
const single = (obj, prefix = PREFIX) =>
    Object.assign({}, ...Object.entries(obj).map(([k, v]) => ({ [`${prefix}${k}`]: v })))

const sides = (obj, prefix = PREFIX) =>
    Object.assign(
        {},
        ...Object.entries(obj).map(([k, v]) => ({
            [`${prefix}Left${k}`]: `left${v}`,
            [`${prefix}Right${k}`]: `right${v}`,
        })),
    )

export const fbxToVrmRigMapMixamo = {
    ...single({
        Hips: 'hips',
        Spine: 'spine',
        Spine1: 'chest',
        Spine2: 'upperChest',
        Neck: 'neck',
        Head: 'head',
    }),
    ...sides({
        Shoulder: 'Shoulder',
        Arm: 'UpperArm',
        ForeArm: 'LowerArm',
        Hand: 'Hand',

        HandThumb1: 'ThumbMetacarpal',
        HandThumb2: 'ThumbProximal',
        HandThumb3: 'ThumbDistal',
        HandIndex1: 'IndexProximal',
        HandIndex2: 'IndexIntermediate',
        HandIndex3: 'IndexDistal',
        HandMiddle1: 'MiddleProximal',
        HandMiddle2: 'MiddleIntermediate',
        HandMiddle3: 'MiddleDistal',
        HandRing1: 'RingProximal',
        HandRing2: 'RingIntermediate',
        HandRing3: 'RingDistal',
        HandPinky1: 'LittleProximal',
        HandPinky2: 'LittleIntermediate',
        HandPinky3: 'LittleDistal',

        UpLeg: 'UpperLeg',
        Leg: 'LowerLeg',
        Foot: 'Foot',
        ToeBase: 'Toes',
    }),
}
