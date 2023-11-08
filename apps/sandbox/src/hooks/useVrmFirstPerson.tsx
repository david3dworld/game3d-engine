import * as THREE from 'three'
import * as React from 'react'
import * as R3F from '@react-three/fiber'

import { VRM, VRMExpression } from '@pixiv/three-vrm'

export const useVrmFirstPerson = (vrm: VRM, isFirstPerson = false) => {
    const { camera } = R3F.useThree()
    const isFirstPersonSetup = React.useRef(false)

    // can be done better with vrm.scene.traverse

    React.useEffect(() => {
        if (!vrm?.firstPerson) return
        if (!isFirstPerson) return

        // doesn't work with vroid models
        if (!isFirstPersonSetup.current) {
            isFirstPersonSetup.current = true
            vrm.firstPerson.setup({ firstPersonOnlyLayer: 11, thirdPersonOnlyLayer: 12 })
        }

        // hide face, works with vroid models
        vrm.scene.traverse((object) => {
            // console.log('>', object.name, object)

            if (object.name.startsWith('Face')) object.visible = false
            // if (object.name.startsWith('Body')) object.visible = false
            if (object.name === 'Body') (window as any).vrmBody = object
        })
    }, [vrm, camera, isFirstPerson])
}
