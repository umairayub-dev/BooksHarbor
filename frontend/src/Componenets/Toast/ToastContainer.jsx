import React, { useContext } from 'react'
import { ToastContext } from '../../Context/Toast/ToastContext'
import Toast from './Toast'

const ToastContainer = () => {
    const { state } = useContext(ToastContext)
    return (
        <div className='position-fixed top-14 start-50 translate-middle-x zIndex-9999'>
            {state.toasts && state.toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} />
            ))}
        </div>
    )
}

export default ToastContainer