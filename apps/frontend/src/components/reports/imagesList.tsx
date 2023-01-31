import React from 'react'
import { FileAPIOutput } from 'defs'
import { StyleSheet, View, Image } from '@react-pdf/renderer'

const style = StyleSheet.create({
  container: { width: '100vw', display: 'flex' },
  image: { height: 300, width: '30%' },
})

type Props = {
  images: FileAPIOutput[]
}

export const ImagesList: React.FunctionComponent<Props> = ({ images }) => (
  <View style={style.container}>
    {images.map(({ fileId, url: { url } }) => (
      <Image key={fileId} style={style.image} cache={true} source={url} />
    ))}
  </View>
)
