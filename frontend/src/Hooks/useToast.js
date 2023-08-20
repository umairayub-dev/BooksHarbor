import { useContext } from "react"
import { ToastContext } from "../Context/Toast/ToastContext"

const useToast = () => {
    const { dispatch } = useContext(ToastContext)

    const toast = (type, message, delay, duration) => {
        const id = Math.random().toString(36).substring(2, 9)
        console.log(message)
        setTimeout(() => {
            dispatch({
                type: 'ADD_TOAST',
                toast: {
                    type,
                    message,
                    id,
                }
            })
            setTimeout(() => {
                dispatch({ type: 'REMOVE_TOAST', toast: { id } })
            }, duration);
        }, delay);
    }
    
    return toast
}

export default useToast