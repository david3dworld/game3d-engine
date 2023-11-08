import * as THREE from 'three'
import * as React from 'react'
import * as R3F from '@react-three/fiber'

import { VRM, VRMExpression, VRMExpressionPresetName } from '@pixiv/three-vrm'

export const useVrmBlinking = (
    vrm: VRM,
    isBlinking = true,
    blinkProperties: {
        maxBlink?: number
        minBlink?: number
        randomness?: number
        continuity?: number
        closeTime?: number
        openTime?: number
    } = {},
) => {
    const {
        minBlink = 0,
        randomness = 3.5,
        continuity = 1,
        closeTime = 0.16,
        openTime = 0.34,
    } = blinkProperties

    const status = React.useRef<'ready' | 'closing' | 'open'>('ready')
    const blinkValue = React.useRef(0)
    const blinkCounter = React.useRef(0)

    R3F.useFrame((_, delta) => {
        if (!vrm?.expressionManager) return

        if (!isBlinking) {
            vrm.expressionManager.setValue('blink', 0)
            vrm.expressionManager.setValue('blinkLeft', 0)
            vrm.expressionManager.setValue('blinkRight', 0)
            return
        }

        switch (status.current) {
            case 'closing':
                if (blinkValue.current > 0) blinkValue.current -= delta / closeTime
                else {
                    blinkValue.current = 0
                    status.current = 'open'
                }
                break
            case 'open':
                if (blinkValue.current < 1) blinkValue.current += delta / openTime
                else {
                    blinkValue.current = 1
                    status.current = 'ready'
                }
                break
            case 'ready':
                blinkCounter.current += delta
                if (blinkCounter.current >= continuity) {
                    if (Math.floor(Math.random() * randomness) === 0)
                        status.current = 'closing'
                    blinkCounter.current = 0
                }

                break
        }

        vrm.expressionManager.setValue(
            'blink',
            Math.max(0, 1 - minBlink - blinkValue.current),
        )
        vrm.expressionManager.setValue('blinkLeft', minBlink)
        vrm.expressionManager.setValue('blinkRight', minBlink)
    })
}
