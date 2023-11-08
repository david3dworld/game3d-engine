import * as Drei from '@react-three/drei'
import { KeyboardControlsEntry } from '@react-three/drei'

export type Controls =
    | 'forward'
    | 'backward'
    | 'left'
    | 'right'
    | 'forwardAlt'
    | 'backwardAlt'
    | 'leftAlt'
    | 'rightAlt'
    | 'jump'
    | 'sprint'
    | 'toggleCamera'
    | 'toggleCrouch'

export const keyboardControlsMap: KeyboardControlsEntry<Controls>[] = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'forwardAlt', keys: ['ArrowUp', 'KeyI'] },
    { name: 'backwardAlt', keys: ['ArrowDown', 'KeyK'] },
    { name: 'leftAlt', keys: ['ArrowLeft', 'KeyJ'] },
    { name: 'rightAlt', keys: ['ArrowRight', 'KeyL'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'sprint', keys: ['Shift'] },
    { name: 'toggleCamera', keys: ['KeyV'] },
    { name: 'toggleCrouch', keys: ['KeyC'] },
]
