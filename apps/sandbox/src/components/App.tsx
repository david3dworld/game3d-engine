import * as React from 'react'
import * as R3F from '@react-three/fiber'
import * as Drei from '@react-three/drei'
import * as R3R from '@react-three/rapier'
import * as Leva from 'leva'
import { XR, VRButton, Controllers, Hands } from '@react-three/xr'
import { Perf } from 'r3f-perf'

import Scene from './Scene'
import Effects from './Effects'
import Camera from './Camera'
import Hud from './Hud'
import {
    Scene as RapierCharacterControllerScene,
    Character as RapierCharacterControllerCharacter,
} from './experiments/_RapierCharacterController'

import { keyboardControlsMap } from '../maps/keyboardControlsMap'
import { useAppControls, useCameraControls } from '../hooks/useLevaControls'
import { usePageVisible } from '../hooks/usePageVisible'
import { useLoadingAssets } from '../hooks/useLoadingAssets'

const App = () => {
    const visible = usePageVisible()
    const loading = useLoadingAssets()
    console.log('loading', loading)

    return (
        <>
            <Drei.KeyboardControls map={keyboardControlsMap}>
                <R3F.Canvas
                    shadows
                    camera={{
                        // position: [0, 1.6, -2],
                        // position: [0, 2, -20],
                        // position: [0, 2, -9],
                        // rotation: [0, Math.PI, 0],
                        near: 0.01,
                    }}
                    onPointerDown={(e: any) => {
                        e.target.requestPointerLock()
                    }}
                >
                    <XR>
                        <Camera />
                        {/* <Effects /> */}

                        <R3R.Physics debug timeStep="vary" paused={!visible}>
                            <React.Suspense fallback={undefined}>
                                {/* <Drei.Plane rotation-x={Math.PI / 2} args={[100, 100, 4, 4]}>
                <meshBasicMaterial color="black" wireframe />
              </Drei.Plane> */}

                                <Scene />
                                {/* <RapierCharacterControllerCharacter /> */}
                                {/* <RapierCharacterControllerScene /> */}

                                {/* <Stuff /> */}
                            </React.Suspense>
                        </R3R.Physics>
                        <Hud />

                        {/* <Drei.Preload all /> */}

                        <Perf
                            position="top-left"
                            style={{
                                opacity: 0.6,
                                transformOrigin: 'top left',
                                zIndex: 0,
                            }}
                        />
                    </XR>
                </R3F.Canvas>

                {/* <VRButton
					style={{
						position: 'fixed',
						bottom: 0,
						left: 0,
						fontWeight: 700,
					}}
				/> */}
                <Leva.Leva collapsed />
            </Drei.KeyboardControls>
        </>
    )
}
export default App
