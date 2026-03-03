import React, { useLayoutEffect } from 'react'
import { Grid } from '../../../../../components/Layout'
import { Card, MenuItem, Button } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import ChartJS from 'chart.js'

const GRID_GAP = '20px'

const tableData = [
  {
    color: 'orange',
    brand: 'Swiggy',
    earning: '20,345',
    orders: {
      cod: parseInt(Math.random() * 100) + 1,
      online: parseInt(Math.random() * 100) + 1
    },
    img:
      'https://lh3.googleusercontent.com/A8jF58KO1y2uHPBUaaHbs9zSvPHoS1FrMdrg8jooV9ftDidkOhnKNWacfPhjKae1IA'
  },
  {
    color: '#d50000',
    brand: 'Zomato',
    earning: '10,305',
    orders: {
      cod: parseInt(Math.random() * 100) + 1,
      online: parseInt(Math.random() * 100) + 1
    },
    img:
      'https://upload.wikimedia.org/wikipedia/commons/e/ef/Zomato-flat-logo.png'
  },
  {
    color: '#64dd17',
    brand: 'Uber eats',
    earning: '1,345',
    orders: {
      cod: parseInt(Math.random() * 100) + 1,
      online: parseInt(Math.random() * 100) + 1
    },
    img:
      'https://lh3.googleusercontent.com/GInoRiQ6UvZrz3bumhlHY_KTKA1_tYGWRH_yWiEEe3VermedHJq5DBy_HFlkypdHyeg'
  },
  {
    color: '#ffd600',
    brand: 'Instapizza',
    earning: '30,345',
    orders: {
      cod: parseInt(Math.random() * 100) + 1,
      online: parseInt(Math.random() * 100) + 1
    },
    img:
      'https://zapio-admin.com/media/company_logo/instapizza2.240bed4c-min_WkhkUTe.png'
  },
  {
    color: '#2962ff',
    brand: 'POS',
    earning: '12,876',
    orders: {
      cod: parseInt(Math.random() * 100) + 1,
      online: parseInt(Math.random() * 100) + 1
    },
    img: 'https://cdn1.iconfinder.com/data/icons/cv-resume-1/32/4-512.png'
  }
]
export default function PaymentDetails() {
  const { currency } = JSON.parse(localStorage.getItem("user"))
  let chartCanvas = []
  useLayoutEffect(() => {
    chartCanvas.forEach((ch, ind) => {
      new ChartJS(ch, {
        type: 'pie',
        data: {
          labels: tableData.map(t => t.brand),
          datasets: [
            {
              data: tableData.map(t => t.orders[ind === 0 ? 'online' : 'cod']),
              backgroundColor: tableData.map(t => t.color)
            }
          ]
        },
        options: {
          cutoutPercentage: 60,
          legend: { position: 'left', display: ind == 0 }
        }
      }).render({ duration: 1000 })
    })
  }, [])
  return (
    <Grid
      className='dash-payment'
      cs={1}
      ce={5}
      cgap={GRID_GAP}
      cols={['1fr', '1fr']}>
      <Card>
        <div className='pay-types-head'>
          <span>Payment Types</span>
          <Select
            items={[
              { label: 'Month', value: 'm' },
              { label: 'Week', value: 'w' },
              { label: 'Day', value: 'd' }
            ]}
            popoverProps={{ minimal: true }}
            filterable={false}
            itemRenderer={(props, { handleClick, modifiers }) => (
              <MenuItem
                key={props.value}
                icon='calendar'
                onClick={handleClick}
                active={modifiers.active}
                disabled={modifiers.disabled}
                style={{ textTransform: 'capitalize' }}
                text={props.label}
              />
            )}>
            <Button
              rightIcon='chevron-down'
              text='Month'
              minimal
              intent='primary'
            />
          </Select>
        </div>
        <div className='pay-chart'>
          <div>
            <span>Online</span>
            <canvas ref={ref => chartCanvas.push(ref)} />
          </div>
          <div>
            <span>Cash on delivery</span>
            <canvas ref={ref => chartCanvas.push(ref)} />
          </div>
        </div>
      </Card>
      <Card>
        <div className='pay-types-head'>
          <span>Payment Source</span>
          <Select
            items={[
              { label: 'Month', value: 'm' },
              { label: 'Week', value: 'w' },
              { label: 'Day', value: 'd' }
            ]}
            popoverProps={{ minimal: true }}
            filterable={false}
            itemRenderer={(props, { handleClick, modifiers }) => (
              <MenuItem
                key={props.value}
                icon='calendar'
                onClick={handleClick}
                active={modifiers.active}
                disabled={modifiers.disabled}
                style={{ textTransform: 'capitalize' }}
                text={props.label}
              />
            )}>
            <Button
              rightIcon='chevron-down'
              text='Month'
              minimal
              intent='primary'
            />
          </Select>
        </div>
        <div className='pay-body'>
          <table>
            <tr>
              <td></td>
              <td>Brand</td>
              <td>Orders</td>
              <td>Revenue</td>
            </tr>
            {tableData.map(t => (
              <tr>
                <td>
                  <img src={t.img} />
                </td>
                <td>{t.brand}</td>
                <td>{t.orders.cod + t.orders.online}</td>
                <td>{currency + ' ' + t.earning}</td>
              </tr>
            ))}
          </table>
        </div>
      </Card>
    </Grid>
  )
}
