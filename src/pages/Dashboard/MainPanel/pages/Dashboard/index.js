import React, { useState } from 'react'
import './styles.scss'
import { Div } from '../../../../../components/Elements'
import { Grid } from '../../../../../components/Layout'
import { Card, Button, Icon, MenuItem, Text } from '@blueprintjs/core'
import { DateRangePicker } from '@blueprintjs/datetime'
import PaymentDetails from './PaymentDetails'

const topData = [
  { icon: 'chart', title: 'Gross Sales', value: '₹1,30,100' },
  { icon: 'full-stacked-chart', title: 'Transactions', value: '156' },
  { icon: 'percentage', title: 'Discount given', value: '20%' },
  { icon: 'person', title: 'Customers', value: '200' }
]
const GRID_GAP = '20px'
export default function Dashboard() {
  const [welcomeVisible, setWelVisible] = useState(true)
  let wel = null
  return (
    <Div className='dashboard'>
      {welcomeVisible ? (
        <div ref={ref => (wel = ref)} className='dash-welcome'>
          <span className='welcome-title'>
            <Icon icon='hand' />
            Welcome back!
          </span>
          <span className='welcome-desc'>
            Below are the statistics that can be helpful for you!
          </span>
          <Button
            icon='cross'
            minimal
            onClick={() => {
              if (wel) {
                const a = wel.animate([{ opacity: 1 }, { opacity: 0 }], {
                  duration: 100
                })
                a.onfinish = () => setWelVisible(false)
              }
            }}
          />
        </div>
      ) : (
        ''
      )}
      <Grid
        cols={topData.map(() => '1fr')}
        rgap={GRID_GAP}
        cgap={GRID_GAP}
        className='dashboard-main'>
        {topData.map((v, i) => (
          <Card
            className='top-cards'
            style={{ animationDelay: i/10+'s' }}
            elevation={2}>
            <div className='card-left'>
              <Icon iconSize={30} icon={v.icon} />
            </div>
            <div className='card-right'>
              <div className='dash-card-head'>{v.title}</div>
              <div className='dash-card-body'>{v.value}</div>
              <div className='dash-card-footer'></div>
            </div>
            <Button icon='chevron-down' className='dash-card-action' minimal />
          </Card>
        ))}
        <PaymentDetails />
        <Grid cs={1} ce={5} cols={['1fr', '1fr']}>
          <Card className='dash-card-report'>
            <div className='report-head'>
              <Icon icon='document' />
              <Text>Download Reports</Text>
            </div>
            <DateRangePicker />
            <div className='report-footer'>
              <Button
                large
                text='Reset'
                icon='eraser'
                intent='danger'
                minimal
              />
              <div>
                <Button
                  large
                  minimal
                  text='View'
                  large
                  intent='primary'
                  // icon='download'
                />
                <Button
                  large
                  text='Download'
                  large
                  intent='primary'
                  icon='download'
                />
              </div>
            </div>
          </Card>
        </Grid>
      </Grid>
    </Div>
  )
}
