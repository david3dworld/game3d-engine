import * as Drei from '@react-three/drei'

// Main reason for this file is to preload all FBX files in one go, as we cannot use more than 1 without preloading.
// A single FBX animation can only be used once, likely a limitation of the useFBX hook. So, there'll be duplicated files/animations here for each character that uses an animation.
export const mixamoAnimations = {
    ['Standing Idle']: './animations/mixamo/Standing Idle.fbx',
    ['Standing Idle copy']: './animations/mixamo/Standing Idle copy.fbx',
    ['Walking']: './animations/mixamo/Walking.fbx',
    ['Walking 2']: './animations/mixamo/Walking 2.fbx',
    ['Sad Idle']: './animations/mixamo/Sad Idle.fbx',
    ['Falling Idle']: './animations/mixamo/Falling Idle.fbx',
    ['Annoyed Head Shake']: './animations/mixamo/Annoyed Head Shake.fbx',
    ['Angry']: './animations/mixamo/Angry.fbx',
    ['Crawling']: './animations/mixamo/Crawling.fbx',
    ['Praying']: './animations/mixamo/Praying.fbx',
    ['Dig And Plant Seeds']: './animations/mixamo/Dig And Plant Seeds.fbx',
    ['Sitting']: './animations/mixamo/Sitting.fbx',
    ['Female Sitting Pose']: './animations/mixamo/Female Sitting Pose.fbx',
}

for (const key of Object.keys(mixamoAnimations)) {
    Drei.useFBX.preload(mixamoAnimations[key])
}

export const cascadeurAnimations = {
    ['Crawl Idle']: './animations/cascadeur/Crawl Idle.fbx',
    ['Stand Test']: './animations/cascadeur/Stand Test.fbx',
    ['Male Crouch Pose mixamo']: './animations/Male Crouch Pose mixamo.fbx',
    ['Male Crouch Pose cascadeur']: './animations/Male Crouch Pose cascadeur 8.fbx',
}

for (const key of Object.keys(cascadeurAnimations)) {
    Drei.useFBX.preload(cascadeurAnimations[key])
}
