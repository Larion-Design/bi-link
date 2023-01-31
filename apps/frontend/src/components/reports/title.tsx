import React from 'react'
import { StyleSheet, View, Text } from '@react-pdf/renderer'

type Props = {
  title: string
}

const style = StyleSheet.create({
  titleContainer: { width: '100vw' },
  title: { fontSize: 24 },
})

export const Title: React.FunctionComponent<Props> = ({ title }) => (
  <View style={style.titleContainer}>
    <Text style={style.title}>{title}</Text>
  </View>
)
