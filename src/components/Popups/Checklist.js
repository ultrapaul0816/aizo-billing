import React, { useState } from 'react'
import { Dialog, Classes, Button, Text, Icon } from '@blueprintjs/core'
import Notif from '../Notification'

const list = [
  'Switch off the lights',
  'Cleaning done',
  'Lock Counter',
  'All Bills Settled',
]
export default function Checklist({ onClose, isOpen }) {
  const [checkedItems, setCheckedItems] = useState([])
  const toggleItem = (stat, item) => {
    setCheckedItems(items => {
      if (stat) {
        items.push(item)
        return [...items]
      } else return items.filter(c => c !== item)
    })
  }
  const closeAndReset = () => {
    onClose()
    setCheckedItems([])
  }
  return (
    <Dialog isOpen={isOpen} style={{background:'#fff'}} >
      <div className={Classes.DIALOG_BODY}>
        <Button
          icon='cross'
          className='close-btn'
          minimal
          onClick={closeAndReset}
        />
        <Text className='title'>
          <Icon icon='confirm' />
          Checklist
        </Text>
        <div className='checklist-cont'>
          {list.map(v => {
            const isChecked = checkedItems.includes(v)
            return (
              <div
                className={`checklist-item checklist-item--${
                  isChecked ? '' : 'un'
                }checked`}
                onClick={() => {
                  toggleItem(!isChecked, v)
                }}>
                <p>
                  <span />
                  {v}
                </p>
                <Icon
                  className={isChecked && 'icon--checked'}
                  iconSize={20}
                  icon={isChecked ? 'tick-circle' : 'circle'}
                />
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
            console.log(checkedItems)
            if (checkedItems.length === list.length) {
              setCheckedItems([])
              onClose(checkedItems)
            } else Notif.alert('Please mark all checklist to continue')
          }}
        />
      </div>
    </Dialog>
  )
}
