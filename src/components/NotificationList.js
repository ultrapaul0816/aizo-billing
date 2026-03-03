import React, { useState } from 'react'
import {
  IoMdCheckmark,
  IoMdAlert,
  IoMdListBox,
  IoMdPersonAdd
} from 'react-icons/io'
import moment from 'moment'
import './notif.scss'
import { Tag, Button } from '@blueprintjs/core'

const nList = [
  // {
  //   color: '#2962ff',
  //   ref: React.createRef(),
  //   content: 'New Order has arrived',
  //   icon: IoMdCheckmark,
  //   title: 'New Order!'
  // },
  // {
  //   color: '#d50000',
  //   ref: React.createRef(),
  //   content: 'API issue!',
  //   icon: IoMdAlert,
  //   title: 'An error occured'
  // },
  // {
  //   color: '#2962ff',
  //   ref: React.createRef(),
  //   content: '',
  //   icon: IoMdPersonAdd,
  //   title: '2 New customers'
  // },
  // {
  //   color: '#00c853',
  //   ref: React.createRef(),
  //   content: 'Click on reports tab!',
  //   icon: IoMdListBox,
  //   title: 'Daily report ready'
  // },
  // {
  //   color: '#00c853',
  //   ref: React.createRef(),
  //   content: 'See API Docs',
  //   icon: IoMdAlert,
  //   title: 'Changelog updated successfully'
  // }
]
const NotificationItem = React.forwardRef(({ l, ind }, ref) => (
  <li key={ind} ref={ref} style={{ animationDelay: `${ind / 10}s` }}>
    <span className='notif-icon'>
      <l.icon color={l.color} size={30} />
    </span>
    <div className='notif-content'>
      <span>{l.title}</span>
      <span>{l.content}</span>
    </div>
    <span>{moment().format('d:mm a')}</span>
  </li>
))
export default function NotificationList() {
  const [list, setList] = useState(nList)

  return (
    <div className='notif-cont'>
      <span>
        Notifications
        <Tag round intent='primary' style={{ marginLeft: '10px' }}>
          {list.length}
        </Tag>
      </span>
      <ul>
        {list.length ? (
          list.map((l, ind) => <NotificationItem ind={ind} l={l} ref={l.ref} />)
        ) : (
          <div className='notif-none'>
            {/* <img src={require('../utils/images/no_notif.png')} /> */}
            <span>No Notifications for now!</span>
          </div>
        )}
      </ul>
      <div className='notif-bottom'>
        <Button
          text='clear'
          onClick={() => {
            list
              .map(nl => nl.ref.current)
              .forEach((n, ind) => {
                n.animate(
                  [
                    { opacity: 1, transform: 'translateY(0)' },
                    { opacity: 0, transform: 'translateY(-10px)' }
                  ],
                  {
                    duration: 100,
                    delay: ind * 50,
                    fill: 'forwards'
                  }
                )
              })
            setTimeout(() => {
              setList([])
            }, nList.length * 100)
          }}
          minimal
        />
        <Button icon='settings' minimal />
      </div>
    </div>
  )
}
