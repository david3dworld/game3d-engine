import * as THREE from 'three'
import * as React from 'react'
import * as R3F from '@react-three/fiber'
import * as Drei from '@react-three/drei'
import { VRM, VRMUtils, VRMLoaderPlugin } from '@pixiv/three-vrm'

export const vrmLoader = (loader: any) => {
    loader.register((parser: any) => new VRMLoaderPlugin(parser))
}

// NOTE: Preloading to go with this will be needed for complex scenes/with multiple models to ensure we don't block the main thread
// Ex: Drei.useGLTF.preload(VRM_URL, true, true, vrmLoader)

export const useVrm = (vrmUrl: string, shadows = true) => {
    // load VRM model
    const { userData } = Drei.useGLTF(vrmUrl, true, true, vrmLoader)
    const vrm: VRM = userData.vrm

    // Setup vrm model
    React.useEffect(() => {
        if (!vrm) return

        // improves perf
        VRMUtils.removeUnnecessaryJoints(vrm.scene)
        VRMUtils.removeUnnecessaryVertices(vrm.scene)
        VRMUtils.rotateVRM0(vrm) // rotate the vrm around y axis if the vrm is VRM0.0

        // Disable frustum culling, to avoid jitteriness
        vrm.scene.traverse((obj) => {
            obj.frustumCulled = false
            obj.receiveShadow = shadows
            obj.castShadow = shadows
        })
    }, [vrm, shadows])

    return { vrm, userData }
}
