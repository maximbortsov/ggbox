import React, { FC, ReactElement } from 'react'
import { CircularProgress, Slide, SlideProps, Snackbar, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import stores from '../stores/Stores'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { observer } from 'mobx-react-lite'
import { SnackbarType } from '../utils/enums'


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return (
        <MuiAlert
            elevation={6}
            ref={ref}
            variant={'filled'}
            {...props}
        />
    )
})

const GGSnackbar: FC = () => {

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        stores.snackbars.closeSnackbar()
    }

    const SlideTransition = (props: SlideProps): ReactElement => <Slide {...props} direction={'up'}/>

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

    return (
        <Snackbar
            open={stores.snackbars.isShown}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            TransitionComponent={SlideTransition}
            autoHideDuration={stores.snackbars.type !== SnackbarType.LOADING ? 2500 : null}
            onClose={handleClose}
        >
            {
                stores.snackbars.type === SnackbarType.LOADING ?
                    <Alert
                        icon={false}
                        sx={{
                            width: '100%',
                            px: 2,
                            alignItems: 'center',
                            background: '#554ADA',
                            '& .MuiAlert-message': {
                                width: isMobile ? '100%' : 'unset',
                            },
                        }}
                    >
                        <Stack
                            direction={'row'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            sx={{
                                width: '100%',
                            }}
                        >
                            <Typography mr={5} flex={1}>
                                {stores.snackbars.message}
                            </Typography>

                            <CircularProgress
                                size={36}
                                sx={{ color: 'white' }}
                            />

                        </Stack>
                    </Alert>
                    :
                    <Alert severity={stores.snackbars.type}>
                        {stores.snackbars.message}
                    </Alert>
            }
        </Snackbar>
    )
}

export default observer(GGSnackbar)