// Initial inspiration from https://github.com/Automattic/VU-VRM/blob/trunk/script.js

import * as THREE from 'three'
import * as React from 'react'
import * as R3F from '@react-three/fiber'
import * as Drei from '@react-three/drei'

import { VRM, VRMExpressionPresetName } from '@pixiv/three-vrm'

// the audio file's sample rate/khz affects the bucket size
// frequency buckets can only be a power of 2, starting at 32
const FREQUENCY_BIN_COUNT = 2048 // bucket size / 2 = bin count
const SAMPLE_RATE = 32000 // for vowel detection especially, the calculations will need to be adjusted if sample rate changes. so, we'll try to stick to a single sample rate

// this is all very rough and estimate based, these values will also change based on the voice type
// Formants hz values from: https://corpus.eduhk.hk/english_pronunciation/index.php/2-2-formants-of-vowels/
// More links: https://en.wikipedia.org/wiki/IPA_vowel_chart_with_audio, https://en.wikipedia.org/wiki/Formant
export const AUTOMATIC_EXPRESSION_FORMANTS = {
    // aa: [710, 1100, 2540],
    aa: [690, 1660, 2490],
    ih: [400, 1920, 2560],
    ou: [310, 870, 2250],
    ee: [280, 2250, 2890],
    // oh: [590, 880, 2540],
    oh: [590, 880, 2540],
}
export const VOWEL_EXPRESSIONS: (VRMExpressionPresetName &
    keyof typeof AUTOMATIC_EXPRESSION_FORMANTS)[] = ['aa', 'ih', 'ou', 'ee', 'oh']

export const byteToFloat = (num: number) => num / 256

export const indexToHz = (index: number, sampleRate: number) =>
    index * (sampleRate / FREQUENCY_BIN_COUNT)

export const hzToIndex = (
    frequencyHz: number,
    sampleRate: number,
    roundFn = Math.round,
) => {
    const indexFloat = frequencyHz / (sampleRate / FREQUENCY_BIN_COUNT)
    return roundFn(indexFloat)
}

export const frequencyFormant =
    (frequencyData: Uint8Array, sampleRate: number) =>
    (hz: number, range = 20) => {
        const minIndex = hzToIndex(hz - range, sampleRate)
        const maxIndex = hzToIndex(hz + range, sampleRate)

        let peakIndex = -1
        for (let i = minIndex; i < maxIndex; i++) {
            if (frequencyData[i] > (frequencyData[peakIndex] ?? -Infinity)) peakIndex = i
        }

        return {
            formant: indexToHz(peakIndex, sampleRate),
            peak: byteToFloat(frequencyData[peakIndex]),
        }
    }

// generate how much current audio frequency data matches certain formants range
export const formantsProbability =
    (frequencyData: Uint8Array, sampleRate: number) =>
    (formants: number[], range?: number) => {
        if (!formants) return 0

        const getFrequencyFormant = frequencyFormant(frequencyData, sampleRate)
        let formantsTotal = 0
        for (let i = 0; i < formants.length; i++) {
            formantsTotal += getFrequencyFormant(formants[i], range).peak
        }

        // not really the best way to workout the probability but kinda works
        return formantsTotal / formants.length
    }

type FormantsProbabilityFn = ReturnType<typeof formantsProbability>

export type AudioInfo = {
    url: string
    sampleRate?: number
    automaticExpressions?: (keyof typeof AUTOMATIC_EXPRESSION_FORMANTS)[]
    mouthMinThreshold?: number
    mouthMax?: number
    mouthMin?: number
    mouthBoost?: number
}

export type AudioCallback = (
    vrm: VRM,
    audioAnalyser: THREE.AudioAnalyser,
    formantsProbabilityFn: FormantsProbabilityFn,
) => void

const VrmAudioExpressions = ({
    vrm,
    soundRef,
    audio,
    audioCallback,
}: {
    vrm: VRM
    soundRef: React.MutableRefObject<THREE.Audio>
    audio: AudioInfo
    audioCallback?: AudioCallback
}) => {
    const {
        sampleRate = SAMPLE_RATE,
        automaticExpressions = VOWEL_EXPRESSIONS,
        mouthMinThreshold = 0.15,
        mouthBoost = 0.75,
        mouthMax = 1,
        mouthMin = 0.05,
    } = audio
    const analyserRef = React.useRef<THREE.AudioAnalyser | undefined>()

    React.useEffect(() => {
        analyserRef.current = new THREE.AudioAnalyser(
            soundRef.current,
            FREQUENCY_BIN_COUNT * 2,
        )

        return () => {
            // reset expressions on unmount
            for (const exp of automaticExpressions)
                vrm.expressionManager?.setValue(exp, 0)
        }
    }, [])

    R3F.useFrame(() => {
        const analyser = analyserRef.current
        if (!analyser) return

        const formantsProbabilityFn = formantsProbability(
            analyser.getFrequencyData(),
            sampleRate,
        )
        for (const expression of automaticExpressions) {
            const formants = AUTOMATIC_EXPRESSION_FORMANTS[expression]
            if (formants) {
                const probability = formantsProbabilityFn(formants) * mouthBoost
                const value =
                    probability < mouthMinThreshold
                        ? mouthMin
                        : Math.max(Math.min(probability, mouthMax), mouthMin)
                vrm.expressionManager?.setValue(expression, value)
            }
        }

        if (audioCallback && vrm) audioCallback(vrm, analyser, formantsProbabilityFn)
    })

    return null
}

export default VrmAudioExpressions
