import * as React from 'react'
import * as R3F from '@react-three/fiber'
import * as Drei from '@react-three/drei'
import { useReflow } from '@react-three/flex'

const Text = ({
    weight = 'Regular',
    anchorX = 'left',
    anchorY = 'top',
    textAlign = 'left',
    fontSize,
    ...props
}) => {
    const reflow = useReflow()

    const fontPath = `/fonts/Inter-3.19/Inter Hinted for Windows/Desktop/Inter-${weight}.ttf`

    return (
        <React.Suspense fallback={undefined}>
            <Drei.Text
                // receiveShadow
                // castShadow
                anchorX={anchorX}
                anchorY={anchorY}
                textAlign={textAlign}
                font={fontPath}
                fontSize={fontSize}
                sdfGlyphSize={16}
                // sdfGlyphSize={32} // high quality
                onSync={() => void reflow()}
                {...props}
            />
        </React.Suspense>
    )
}

export default Text
