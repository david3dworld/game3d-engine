import * as React from 'react'
import * as THREE from 'three'
import * as R3F from '@react-three/fiber'
import * as R3R from '@react-three/rapier'
import * as Drei from '@react-three/drei'
import * as Leva from 'leva'

import { KinematicCharacterController } from '@dimforge/rapier3d-compat'
import { VRM, VRMExpressionPresetName } from '@pixiv/three-vrm'

import VrmAvatar, { VrmAvatarProps } from './VrmAvatar'
import { mixamoAnimations } from '../maps/fbxAnimations'
import { Controls } from '../maps/keyboardControlsMap'
import { useCameraControls } from '../hooks/useLevaControls'
import { useFirstPersonCamera } from '../hooks/useFirstPersonCamera'
import { euler } from '@react-three/rapier'

const WALK_SPEED = 0.0325 * 1
const WALK_SIDE_SPEED = 0.025 * 1

const CRAWL_SPEED = 0.02
const CRAWL_SIDE_SPEED = 0.015

const HEIGHT = 1.72
const RADIUS = 0.5
const HALF_HEIGHT = HEIGHT / 2 - RADIUS

const Avatar = React.forwardRef(
    ({ activeAnimation, timeScale, goodStuff, ...props }: VrmAvatarProps, ref) => {
        return (
            <VrmAvatar
                ref={ref}
                vrmUrl={'./vrm/sample headless.vrm'}
                animation={{
                    urlMap: {
                        Crawling: mixamoAnimations['Crawling'],
                        Praying: mixamoAnimations['Praying'],
                        Walking: mixamoAnimations['Walking'],
                        Idle: mixamoAnimations['Standing Idle'],
                        Falling: mixamoAnimations['Falling Idle'],
                    },
                    active: activeAnimation,
                    // active: walking ? 'Crawling' : 'Praying',
                    timeScale: timeScale,
                    ignoredBones: { neck: true, head: true },
                }}
                isFirstPerson
                {...props}
            />
        )
    },
)

const cameraDirection = new THREE.Vector3()
const lookAtDirection = new THREE.Vector3()
const lookAtPosition = new THREE.Vector3()
const movement = new THREE.Vector3()
const velocity = new THREE.Vector3()
const leftDirection = new THREE.Vector3()
const rightDirection = new THREE.Vector3()
const lookAtEuler = new THREE.Euler(0, 0, 0, 'YXZ')

const Player = (props) => {
    const camera = R3F.useThree((state) => state.camera) as THREE.PerspectiveCamera
    const [{ cameraMode }] = useCameraControls()
    const { world } = R3R.useRapier()
    const body = React.useRef<R3R.RapierRigidBody>(null)
    const [vrm, setVrm] = React.useState<VRM>()

    const characterController = React.useRef<KinematicCharacterController>()
    const collider = React.useRef<R3R.RapierCollider>(null)
    const grounded = React.useRef(false)
    const head = React.useMemo(() => vrm?.humanoid?.getNormalizedBoneNode('head'), [vrm])
    const neck = React.useMemo(() => vrm?.humanoid?.getNormalizedBoneNode('neck'), [vrm])
    const moveNeck = true

    const moving = Drei.useKeyboardControls<Controls>(
        (s) => s.forward || s.backward || s.left || s.right,
    )
    const movingBackward = Drei.useKeyboardControls<Controls>((s) => s.backward)

    const [crouching, setCrouching] = React.useState(false)
    const crawling = crouching && moving

    const [subKeyboard, getKeyboard] = Drei.useKeyboardControls<Controls>()
    React.useEffect(() => {
        subKeyboard(
            (state) => state.toggleCrouch,
            (pressed) => {
                if (pressed) setCrouching(!crouching)
            },
        )
    }, [crouching, neck, head])

    useFirstPersonCamera(vrm, { maxDownAngle: 0 })

    React.useEffect(() => {
        const c = world.createCharacterController(0.01)
        c.setApplyImpulsesToDynamicBodies(true)
        c.enableSnapToGround(0.05)
        c.enableAutostep(0.25, 0.1, true)
        c.setMaxSlopeClimbAngle((45 * Math.PI) / 180)
        c.setMinSlopeSlideAngle((30 * Math.PI) / 180)

        characterController.current = c
    }, [world])

    R3F.useFrame((context, delta) => {
        // R3R.useBeforePhysicsStep(() => {
        //   const delta = world.timestep
        if (
            !characterController.current ||
            !body.current ||
            !collider.current ||
            !vrm ||
            !head ||
            !neck
        )
            return
        const c = characterController.current
        const pressed = getKeyboard()

        // character movement based on camera direction
        movement.set(0, 0, 0)
        if (cameraMode === 'firstPerson') {
            camera.getWorldDirection(cameraDirection)
            cameraDirection.normalize()
            cameraDirection.multiplyScalar(-1)

            const speed = crouching ? CRAWL_SPEED : WALK_SPEED
            const sideSpeed = crouching ? CRAWL_SIDE_SPEED : WALK_SIDE_SPEED

            if (pressed.left) {
                leftDirection.crossVectors(cameraDirection, camera.up)
                movement.add(leftDirection.multiplyScalar(sideSpeed))
            }
            if (pressed.right) {
                rightDirection.crossVectors(camera.up, cameraDirection)
                movement.add(rightDirection.multiplyScalar(sideSpeed))
            }
            if (pressed.forward) movement.sub(cameraDirection.multiplyScalar(speed))
            if (pressed.backward) movement.add(cameraDirection.multiplyScalar(speed))
        }

        if (!grounded.current) velocity.y -= (9.807 * delta) / 60 // apply gravity

        // update character position
        movement.add(velocity)
        c.computeColliderMovement(collider.current, movement)
        grounded.current = c.computedGrounded()
        const position = R3R.vec3(body.current.translation())
        position.add(R3R.vec3(c.computedMovement()))
        body.current.setNextKinematicTranslation(position)

        // camera movement based on character position
        if (cameraMode === 'firstPerson') {
            // set camera position
            vrm?.lookAt?.getLookAtWorldPosition(lookAtPosition)
            camera.position.copy(lookAtPosition)

            // set camera rotation i.e. look at position
            lookAtEuler.setFromQuaternion(head.quaternion)
            lookAtEuler.x += Math.PI + 0.4 // enable extra down movement
            lookAtEuler.z -= Math.PI
            lookAtEuler.y = vrm.scene.rotation.y
            camera.rotation.copy(lookAtEuler)
        }
    })

    const standingAnimation = cameraMode !== 'fly' && moving ? 'Walking' : 'Idle'
    const crouchingAnimation = cameraMode !== 'fly' && moving ? 'Crawling' : 'Praying'
    const activeAnimation = crouching ? crouchingAnimation : standingAnimation

    console.log('active animation', activeAnimation)

    return (
        <React.Suspense fallback={undefined}>
            <R3R.RigidBody
                type="kinematicPosition"
                colliders={false}
                position={[0, 3, 0]}
                ref={body}
            >
                <Avatar
                    {...props}
                    activeAnimation={activeAnimation}
                    timeScale={movingBackward ? -1 : 1}
                    position={[0, -HEIGHT / 2, 0]}
                    onVrmLoad={(vrm) => {
                        setVrm(vrm)
                    }}
                />

                <R3R.CapsuleCollider args={[HALF_HEIGHT, RADIUS]} ref={collider} />
                {/* <R3R.CylinderCollider args={[MODEL_HEIGHT, 0.22]} ref={collider} /> */}
                {/* <R3R.CuboidCollider args={[0.25, MODEL_HEIGHT, 0.25]} ref={collider} /> */}
            </R3R.RigidBody>
        </React.Suspense>
    )
}

export default Player
