import React, { ElementType, FC } from 'react'
import { IconButton, SvgIcon } from '@mui/material'


export const SocialNetworkLink: FC<{ icon: ElementType; viewBox: string; onClick?(): void }> =
    ({ icon, viewBox, onClick = (): void => console.log('clicked') }) => (
        <IconButton size={'medium'} onClick={onClick}>
            <SvgIcon
                component={icon}
                viewBox={viewBox}
                style={{
                    width: 32,
                    height: 32,
                }}
            />
        </IconButton>
    )