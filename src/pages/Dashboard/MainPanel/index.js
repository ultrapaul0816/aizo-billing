import React from 'react'
import { Expanded, Grid } from '../../../components/Layout'
import Header from './Header'
import PanelBody from './PanelBody'
// import '../../../utils/styles/home.scss'
import { Div } from '../../../components/Elements'

export default function MainPanel({setSound}) {
  return (
      <Div className='main-panel'>
        <Header setSound={setSound} />
        <PanelBody />
      </Div>
  )
}
