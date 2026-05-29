import { useEffect } from 'react'

// hook to detect click outside reffed component
export const useOutsideClickAlerter = (ref: React.MutableRefObject<any>, onClick: (() => void)): void => {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event): void {
            if (ref.current && !ref.current.contains(event.target)) {
                onClick()
            }
        }

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref])
}