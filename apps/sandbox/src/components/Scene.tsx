import * as React from 'react'
import * as THREE from 'three'
import * as R3F from '@react-three/fiber'
import * as Drei from '@react-three/drei'
import * as R3R from '@react-three/rapier'
import * as Leva from 'leva'

import { VRM, VRMExpressionPresetName } from '@pixiv/three-vrm'
import { suspend } from 'suspend-react'

import VrmAvatar from './VrmAvatar'
import Player from './Player'

import { cascadeurAnimations, mixamoAnimations } from '../maps/fbxAnimations'
import { Model as VillageGlb } from '../stages/VillageGlb'
import { useTextures } from '../hooks/useTextures'
import { GameLevel } from '../stages/GameLevel'
import CharacterController from './CharacterController'

const Scene = () => {
    const options = Leva.useControls(
        'Scene Settings',
        { goodStuff: true },
        { collapsed: true, order: 999 },
    )

    const [antagonistVrm, setAntagonistVrm] = React.useState<VRM | undefined>(undefined)
    const [playerVrm, setPlayerVrm] = React.useState<VRM | undefined>(undefined)

    return (
        <>
            <React.Suspense fallback={undefined}>
                <>
                    <VillageGlb position={[0, -5, 0]} />

                    <fog attach="fog" args={['#fff', 20, 1000]} />
                    <ambientLight intensity={0.4} />
                    {/* <R3R.RigidBody type="fixed" colliders={'cuboid'}>
                        <mesh receiveShadow position={[0, -25, 0]}>
                            <boxGeometry args={[300, 50, 300]} />
                            <meshStandardMaterial color="#999" opacity={0.1} />
                        </mesh>
                    </R3R.RigidBody> */}
                </>
            </React.Suspense>

            <React.Suspense fallback={undefined}>
                {options.goodStuff && (
                    <R3R.RigidBody colliders={'cuboid'} lockRotations>
                        <VrmAvatar
                            position={[-0.25, 0, 3.5]}
                            rotation={[0, Math.PI / 1, 0]}
                            vrmUrl={'./vrm/sample c.vrm'}
                            animation={{
                                urlMap: {
                                    Walking: mixamoAnimations['Walking 2'],
                                    Idle: mixamoAnimations['Standing Idle copy'],
                                    Angry: mixamoAnimations.Angry,
                                },
                                active: 'Idle',
                            }}
                            // audio={{
                            //   url: './audio/sample-1-32khz.ogg',
                            //   mouthBoost: 0.6,
                            //   mouthMinThreshold: 0.1,
                            //   mouthMin: 0.01,
                            // }}
                            // lookAtTarget="camera"
                            lookAtTarget={playerVrm?.scene}
                            // lookAtMoveHead
                            // lookAtMoveBody
                            renderCallback={(
                                vrm,
                                { clock: { elapsedTime } },
                                delta,
                                bones,
                            ) => {
                                const em = vrm?.expressionManager
                                if (!em) return
                                // em.setValue('lookLeft', 1)
                                em.setValue('surprised', 0)
                                em.setValue('angry', 1)
                                em.setValue('happy', 0.0)
                            }}
                            audioCallback={({ expressionManager }, _, fn) => {
                                expressionManager?.setValue('happy', fn([1000]))
                                // expressionManager?.setValue('surprised', fn([2000]))
                            }}
                            onVrmLoad={(vrm) => {
                                setAntagonistVrm(vrm)
                            }}
                        />
                    </R3R.RigidBody>
                )}
            </React.Suspense>

            <Player
                lookAtTarget={antagonistVrm?.scene}
                onVrmLoad={(vrm) => {
                    setPlayerVrm(vrm)
                }}
                goodStuff={options.goodStuff}
            />

            <axesHelper args={[5]} position={[0, 0.005, 0]} />
        </>
    )
}

export default Scene
