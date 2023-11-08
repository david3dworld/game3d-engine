import * as R3F from '@react-three/fiber'
import * as Drei from '@react-three/drei'
import * as THREE from 'three'
import * as React from 'react'
import * as Koestlich from '@coconut-xr/koestlich'
import * as Flex from '@coconut-xr/flex'
import * as Xr from '@react-three/xr'

const depth = 0.5
const maxWidth = depth * 0.75
const h = depth * 0.13
const gutter = depth * 0.01

const Hud = () => {
    const camera = R3F.useThree((state) => state.camera) as THREE.PerspectiveCamera

    const [{ width, height }, setDimensions] = React.useState({ height: 0, width: 0 })
    React.useEffect(() => {
        const updateSize = () => {
            const fov = THREE.MathUtils.degToRad(camera.fov)
            const height = 2 * Math.tan(fov / 2) * depth
            const width = height * camera.aspect
            setDimensions({ width, height })
        }
        updateSize()
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    const w = width > maxWidth ? maxWidth : width

    return (
        <Drei.ScreenSpace depth={depth}>
            <Koestlich.RootContainer
                loadYoga={Flex.loadYoga}
                backgroundColor="#000"
                backgroundOpacity={0.5}
                borderRadius={depth * 0.01}
                width={w - gutter * 2}
                maxWidth={maxWidth}
                positionRight={w / 2 - gutter}
                positionTop={height / 2 - h - gutter}
                padding={depth * 0.015}
                overflow="hidden"
                height={h}
            >
                <Koestlich.Container>
                    <React.Suspense>
                        <Koestlich.Text
                            index={1}
                            color="#FFF"
                            fontSize={depth * 0.0185}
                            lineHeightMultiplier={1.3}
                            marginTop={depth * -0.005}
                        >
                            Coconut XR Lorem Ipsum is simply dummy text of the printing
                            and typesetting industry. Lorem Ipsum has been the industry's
                            standard dummy text ever since the 1500s, when an unknown
                            printer took a galley of type and scrambled it to make a type
                            specimen book. It has survived not only five centuries, but
                            also the leap into electronic typesetting, remaining
                            essentially unchang Coconut XR Lorem Ipsum is simply dummy
                            text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it
                            to make a type specimen book. It has survived not only five
                            centuries, but also the leap into electronic typesetting,
                            remaining essentially unchang
                        </Koestlich.Text>
                    </React.Suspense>
                </Koestlich.Container>
            </Koestlich.RootContainer>
        </Drei.ScreenSpace>
    )
}

export default Hud
