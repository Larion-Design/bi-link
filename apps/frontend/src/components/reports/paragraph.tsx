import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'

const style = StyleSheet.create({
  container: {
    width: '100vw',
  },
  text: { fontSize: 16 },
})

type Props = {
  text: string
}

export const Paragraph: React.FunctionComponent<Props> = ({ text }) => (
  <View style={style.container}>
    <Text style={style.text}>{text}</Text>
  </View>
)
