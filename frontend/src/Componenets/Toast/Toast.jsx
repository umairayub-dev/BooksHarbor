import React from 'react'
import cx from 'classnames'
import {MdErrorOutline,MdCheckCircleOutline} from 'react-icons/md'

const Toast = ({toast}) => {
    const classes = cx(
        'zIndex-9999 fixed top-14 start-50 p-2 rounded-3 m-1 text-center align-baseline align-content-center justifiy-content-center myToast',
        {'bg-danger text-white': toast.type === 'error',
    'bg-success text-white': toast.type === 'success'}
    )
  return (
    <div className={classes} style={{maxWidth: '24rem'}}>
        {toast.type === 'success' ? <MdCheckCircleOutline className='me-2' size={24}></MdCheckCircleOutline> : <MdErrorOutline className='me-2' size={24}></MdErrorOutline>}
        {toast.message}
    </div>
  )
}

export default Toast