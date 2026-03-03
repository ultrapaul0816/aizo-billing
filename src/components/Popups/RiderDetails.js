import React, { useState } from 'react'
import { Dialog, Classes, Button, Text, Icon } from '@blueprintjs/core'
import Notif from '../Notification'

const list = [
  'Switch off the lights',
  'Cleaning done',
  'Lock Counter',
  'All Bills Settled',
]
export default function RiderDetails({ onClosed, isOpen, riderDetail }) {
  const closeAndReset = () => {
    onClosed()
  }
  return (
    <Dialog isOpen={isOpen} style={{ background: '#fff' }} >
      <div className={Classes.DIALOG_BODY}>
        <Button
          icon='cross'
          className='close-btn'
          minimal
          onClick={closeAndReset}
        />
        <Text className='title'>
          <Icon icon='confirm' />
          Assigned Orders
        </Text>
        <div className='checklist-cont'>
          {riderDetail && riderDetail.map(v => {
            return (
              <div
                className={`checklist-item checklist-item--unchecked`}
              >
                <p style={{ color: "#106ba3", fontSize: "12px" }}>{v.order_id}</p>
                <p style={{ fontSize: "12px" }}>{v.location}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Button
          large
          intent='primary'
          icon='tick'
          text='Done'
          onClick={() => {
            onClosed();
          }}
        />
      </div>
    </Dialog>
  )
}
