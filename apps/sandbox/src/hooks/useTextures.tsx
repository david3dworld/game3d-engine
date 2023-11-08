import React, { useRef } from 'react'
import * as THREE from 'three'
import * as Drei from '@react-three/drei'

const prefixUrl = './textures/'

const textureUrl = (name: string, type = 'Color', res = '1K') =>
    `${prefixUrl}${name}_${res}-JPG/${name}_${res}_${type}.jpg`

const textureUrls = (name: string, onlyColor = false, hasAo = false) =>
    onlyColor
        ? [textureUrl(name)]
        : [
              textureUrl(name),
              textureUrl(name, 'Displacement'),
              textureUrl(name, 'NormalGL'),
              textureUrl(name, 'Roughness'),
              ...(!hasAo ? [] : [textureUrl(name, 'AmbientOcclusion')]),
          ]
const textureProps = ([
    map,
    displacementMap,
    normalMap,
    roughnessMap,
    aoMap,
]: THREE.Texture[]) => ({
    map,
    displacementMap,
    normalMap,
    roughnessMap,
    aoMap,
})

export const useTextures = (
    name: string,
    onlyColor = false,
    hasAo = false,
): [ReturnType<typeof textureProps>, THREE.Texture[]] => {
    const arr = Drei.useTexture(textureUrls(name, onlyColor, hasAo))
    return [textureProps(arr), arr]
}
