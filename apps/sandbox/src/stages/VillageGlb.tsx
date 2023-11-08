import React, { useRef } from 'react'
import * as THREE from 'three'
import { Stage, useGLTF } from '@react-three/drei'
import * as Drei from '@react-three/drei'
import * as R3R from '@react-three/rapier'

import Sun from '../components/Sun'

export function Model(props) {
    const { nodes, materials } = useGLTF('./glb/Desert Village.glb') as unknown as {
        nodes: any
        materials: { [key: string]: THREE.MeshPhysicalMaterial }
    }

    React.useEffect(() => {
        for (const k of Object.keys(materials)) {
            const m = materials[k]
            // m.transmission = 0
        }
    }, [materials])

    return (
        <group {...props} dispose={null}>
            {/* <fog attach="fog" args={['#fff', 20, 40]} /> */}
            {/* <ambientLight intensity={0.4} /> */}
            <Sun intensity={0.5} />
            {/* <Light position={[200, 200, 17]} intensity={0.5} /> */}

            {/* <R3R.CuboidCollider position={[0, -0.5, 0]} args={[20, 0.5, 20]} /> */}

            {/* Ground */}
            <R3R.RigidBody type="fixed" colliders={'cuboid'}>
                <mesh receiveShadow position={[0, -0.255, 0]}>
                    <boxGeometry args={[300, 0.5, 300]} />
                    <meshStandardMaterial opacity={0.1} />
                </mesh>
            </R3R.RigidBody>

            <group>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Villagepmx_1.geometry}
                    material={materials['Sand (Instance)']}
                ></mesh>
                {/* <mesh
          castShadow
          receiveShadow
          geometry={nodes.Villagepmx_2.geometry}
          material={materials['Houses (Instance)']}
        ></mesh> */}

                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Villagepmx_3.geometry}
                    material={materials['Pillars (Instance)']}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Villagepmx_4.geometry}
                    material={materials['HouseLarge1 (Instance)']}
                ></mesh>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Villagepmx_5.geometry}
                    material={materials['HouseMid1 (Instance)']}
                ></mesh>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Villagepmx_6.geometry}
                    material={materials['HouseSmall1 (Instance)']}
                ></mesh>
            </group>
        </group>
    )
}

useGLTF.preload('./glb/Desert Village.glb')
