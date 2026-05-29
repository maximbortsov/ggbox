import React, { FC } from 'react'
import { Button, Dialog, DialogActions, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import stores from '../../stores/Stores'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'


const SuccessfulPayment: FC = () => (
    <Dialog
        open={stores.successfulPaymentStore.isOpen}
        onClose={stores.successfulPaymentStore.handleClose}
        sx={{
            zIndex: (theme): number => theme.zIndex.drawer + 1,
            '& .MuiDialog-paper': {
                borderRadius: 1,
                background: '#15204A',
                p: 1,
            },
        }}
    >
        <DialogTitle
            sx={{
                pb: 2,
            }}
        >
            <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                spacing={2}
            >
                <CheckCircleOutlineIcon
                    fontSize={'large'}
                    sx={{
                        color: '#554ADA',
                    }}
                />
                <Typography variant={'h6'}>
                    Successful Payment
                </Typography>
            </Stack>
        </DialogTitle>
        <DialogContentText px={4} color={'white'} align={'center'}>
            Your payment has been completed successfully
        </DialogContentText>
        <DialogActions>
            <Button
                onClick={stores.successfulPaymentStore.handleConfirm}
                variant={'contained'}
                disableElevation
                sx={{
                    background: '#554ADA',
                    borderRadius: 1,
                    mx: 'auto',
                    mt: 2,
                    fontSize: '1rem',
                    textTransform: 'none',
                    fontFamily: '"Raleway", sans-serif',
                    ':hover': {
                        background: '#5d53d9',
                    },
                }}
            >
                Continue
            </Button>
        </DialogActions>
    </Dialog>
)

export default observer(SuccessfulPayment)