import * as THREE from 'three'
import * as React from 'react'
import * as R3F from '@react-three/fiber'
import * as Drei from '@react-three/drei'

import VrmAudioExpressions, { AudioInfo, AudioCallback } from './VrmAudioExpressions'
import { VRM } from '@pixiv/three-vrm'

const VrmAudio = (
    {
        vrm,
        audio,
        play = false,
        loop = true,
        audioCallback,
    }: {
        vrm: VRM
        audio: AudioInfo
        play?: boolean
        loop?: boolean
        audioCallback?: AudioCallback
    },
    ref,
) => {
    const _ref = React.useRef<THREE.PositionalAudio>()
    const soundRef = ref ?? _ref

    React.useEffect(() => {
        const positionalAudio = soundRef.current
        if (!positionalAudio) return

        if (play) {
            positionalAudio.play()
        } else {
            positionalAudio.pause()
        }
    }, [play, audio.url])

    return (
        <React.Suspense key={audio.url}>
            <Drei.PositionalAudio
                url={audio.url}
                ref={soundRef}
                distance={5}
                autoplay={play}
                loop={loop}
                load
            />
            {play && (
                <VrmAudioExpressions
                    vrm={vrm}
                    soundRef={soundRef}
                    audio={audio}
                    audioCallback={audioCallback}
                />
            )}
        </React.Suspense>
    )
}

export default React.forwardRef(VrmAudio)
