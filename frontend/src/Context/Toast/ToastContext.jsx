import { createContext, useReducer, } from 'react'

export const ToastContext = createContext({ toast: [] })

const toastReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [...state.toasts, action.toast]
            }
        case 'REMOVE_TOAST':
            return {
                ...state,
                toasts: state.toasts.filter((toast) => toast.id !== action.toast.id)
            }

        default:
            throw new Error('Unhandled action type: ' + action.type);
    }
}

export const ToastContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(toastReducer, {
        toasts: []
    })

    return (
        <ToastContext.Provider value={{ state, dispatch }}>
            {children}
        </ToastContext.Provider>
    )
}