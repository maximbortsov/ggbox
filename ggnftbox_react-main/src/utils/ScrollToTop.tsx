import React, { FC, PropsWithChildren, useEffect } from 'react'
import { useLocation } from 'react-router-dom'


const ScrollToTop: FC<{ props?: PropsWithChildren<any> }> = (props): JSX.Element => {
    const location = useLocation()
    useEffect(() => {
        const state = location.state ? location.state as { ignoreScrolling: boolean } : null
        if (!state?.ignoreScrolling) {
            window.scrollTo(0, 0)
        }
    }, [location])

    return (
        <>
            {props.children}
        </>
    )
}

export default ScrollToTop