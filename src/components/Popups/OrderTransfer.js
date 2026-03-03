import React, { useState, useEffect } from 'react'
import './style.scss'
import {
  Dialog,
  Classes,
  InputGroup,
  Text,
  Button,
  Icon,
  TextArea,
  RadioGroup,
  Radio,
  Spinner,
  Tag,
  Tooltip,
  MenuItem,
  Position,
} from '@blueprintjs/core'
import Notif from '../Notification'
import { UserAPI, OutletManagementAPI } from '../../api'
import { useHistory } from 'react-router-dom'
import { FaStore } from 'react-icons/fa'
import { debounce } from '../../utils/helpers'
import { Select } from '@blueprintjs/select'
import { useSelector } from 'react-redux'

export default function OrderTransfer({ load, onClose, isOpen, callback }) {
  let reasonRef = null
  const [outlets, setOutlets] = useState({
    load: false,
  })
  const reduxoutlets = useSelector(state => state.outlets)
  useEffect(() => {
    setOutlets(ps => ({
      ...ps,
      items: reduxoutlets ? reduxoutlets.filter(o => o.is_pos_open) : [],
    }))
  }, [reduxoutlets])

  const checkInputs = () => {
    return outlets.selectedOutlet?.id && reasonRef.value.trim() !== ''
      ? true
      : false
  }
  return (
    <Dialog
      canEscapeKeyClose
      style={{ background: '#fff', minWidth: '20vw' }}
      isOpen={isOpen}>
      <div className={`${Classes.DIALOG_BODY} customer-main`}>
        <Button
          icon='cross'
          className='close-btn'
          minimal
          onClick={() => {
            onClose()
          }}
        />
        <Text className='title'>
          <Icon icon='swap-horizontal' />
          Transfer order
        </Text>
        <div className='order-transfer'>
          {/* <label>Select outlet</label> */}
          <div className='order-transfer-select'>
            {outlets.Outletname ? (
              <div>
                <span>
                  <FaStore />
                </span>
                <span>
                  <span>{outlets.Outletname} </span>
                  <span>{outlets.address}</span>
                </span>
              </div>
            ) : outlets.load ? (
              <>
                <Spinner tagName='circle' intent='primary' size={20} />
                <span>Searching nearest outlet...</span>
              </>
            ) : (
              <Select
                activeItem={outlets.selectedOutlet}
                popoverProps={{
                  minimal: true,
                  position: Position.BOTTOM_LEFT,
                }}
                items={outlets.items || []}
                itemPredicate={(q, item) => {
                  return item.Outletname.toLowerCase().includes(q.toLowerCase())
                }}
                filterable
                noResults={
                  <MenuItem intent='primary' disabled text='No results.' />
                }
                itemRenderer={(props, { handleClick, modifiers }) => (
                  <MenuItem
                    key={props.id}
                    icon='shop'
                    onClick={handleClick}
                    active={modifiers.active}
                    disabled={modifiers.disabled}
                    style={{ textTransform: 'capitalize' }}
                    text={props?.Outletname || ' '}
                  />
                )}
                onItemSelect={ou => {
                  // console.log(ou)
                  setOutlets(o => ({ ...o, selectedOutlet: ou }))
                }}>
                <Button
                  large
                  minimal
                  intent='primary'
                  icon='shop'
                  style={{
                    textTransform: 'capitalize',
                  }}
                  text={
                    outlets.selectedOutlet?.Outletname || 'Select an outlet'
                  }
                  // intent='primary'
                  rightIcon='chevron-down'
                />
              </Select>
            )}
          </div>
          {/* <label>Transfer reason</label> */}
          <InputGroup
            inputRef={ref => (reasonRef = ref)}
            placeholder='Transfer reason'
            large
          />
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Button
          loading={load}
          large
          intent='primary'
          rightIcon='swap-horizontal'
          text='Transfer'
          onClick={() => {
            if (checkInputs()) {
              callback({
                transfer_reason: reasonRef.value,
                outlet_id: outlets.selectedOutlet.id,
              })
            } else Notif.error('Please fill required information!')
          }}
        />
      </div>
    </Dialog>
  )
}
