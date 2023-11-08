import * as React from 'react'
import * as Leva from 'leva'
import * as Drei from '@react-three/drei'

export const useAppControls = () =>
    Leva.useControls({
        'Performance Settings': Leva.folder(
            {
                perfOverlay: { label: 'Overlay', value: true },
            },
            { collapsed: true, order: 999 },
        ),
    })

export const useCameraControls = () =>
    Leva.useControls('Camera', () => ({
        cameraMode: {
            label: 'Camera Mode',
            // value: 'fly',
            // value: 'thirdPerson',
            value: 'firstPerson',

            options: {
                'First Person': 'firstPerson',
                'Third Person': 'thirdPerson',
                Fly: 'fly',
            },
        },
        // zoom: {
        //   label: 'Zoom',
        //   value: 0,
        //   min: -10,
        //   max: 1,
        //   step: 0.1,
        //   render: (get) => get('Camera.cameraMode') === 'thirdPerson',
        // },
        fov: {
            label: 'Field of view',
            value: 60,
            min: 40,
            max: 120,
            step: 1,
            render: () => false,
        },
    }))
