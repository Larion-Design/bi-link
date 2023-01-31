import React from 'react'
import { LinkAPI } from 'defs'
import { View, StyleSheet, Link as ExternalLink } from '@react-pdf/renderer'

const style = StyleSheet.create({
  container: {
    width: '100vw',
  },
  link: { fontSize: 16 },
})

type Props = LinkAPI

export const Link: React.FunctionComponent<Props> = ({ label, url }) => (
  <View style={style.container}>
    <ExternalLink style={style.link} src={url}>
      {label}
    </ExternalLink>
  </View>
)
