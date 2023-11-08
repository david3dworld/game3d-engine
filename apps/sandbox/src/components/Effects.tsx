import * as React from 'react'
import * as Drei from '@react-three/drei'
import * as Post from '@react-three/postprocessing'
import * as Leva from 'leva'

const Effects = () => {
    const { ambientOcculsion, bakeShadows } = Leva.useControls('Performance Settings', {
        ambientOcculsion: { label: 'AO', value: false },
        bakeShadows: { label: 'Bake Shadows', value: false },
    })

    return (
        <React.Suspense>
            {ambientOcculsion && (
                <Post.EffectComposer>
                    {/* <Post.SMAA /> */}
                    <Post.N8AO />
                </Post.EffectComposer>
            )}
            {bakeShadows && <Drei.BakeShadows />}
        </React.Suspense>
    )
}

export default Effects
