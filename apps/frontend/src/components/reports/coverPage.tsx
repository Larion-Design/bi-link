import React from 'react'
import { Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import Logo from '../../../assets/logo.png'

type Props = {
  reportName: string
}

const style = StyleSheet.create({
  container: {
    marginTop: '40vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 36, fontWeight: 'bold', textAlign: 'center' },
})

export const CoverPage: React.FunctionComponent<Props> = ({ reportName }) => (
  <Page wrap={false}>
    <View style={style.container}>
      <Image cache={true} source={Logo} />
      <Text style={style.title}>{reportName}</Text>
    </View>
  </Page>
)
