import React from 'react'
import Logo from '../../../assets/logo.png'
import { Image, View, Text, StyleSheet, Link } from '@react-pdf/renderer'

const style = StyleSheet.create({
  container: {
    height: '10vh',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: { fontSize: 14 },
})

export const Header: React.FunctionComponent = () => (
  <View fixed style={style.container}>
    <View style={style.info}>
      <Text>Corporate Intelligence Agency</Text>
      <Text>Calea Moșilor, Nr. 158, Sector 2, București</Text>
      <Text>CUI RO 34720804</Text>
      <Text>
        Tel:
        <Link src={'tel:+40720201303'}>+40 720 201 303</Link>
      </Text>
      <Text>
        E-Mail:
        <Link src={'mailto:office@corporateintelligence.ro'}>office@corporateintelligence.ro</Link>
      </Text>
    </View>
    <Image cache={true} source={Logo} />
  </View>
)
