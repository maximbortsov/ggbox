import React, { FC } from 'react'
import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from '@mui/material'
import { observer } from 'mobx-react-lite'
import stores from '../../stores/Stores'


const ConfirmCancelLot: FC = () => (
    <Dialog
        open={stores.confirmCancelLotStore.isOpen}
        onClose={stores.confirmCancelLotStore.handleClose}
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
                textAlign: 'center',
                pb: 1,
            }}
        >
            CANCEL SALE
        </DialogTitle>
        <DialogContentText px={4} color={'white'} align={'center'}>
            You&apos;re about to remove your Moment from the Marketplace
        </DialogContentText>
        <DialogActions>
            <Button
                onClick={stores.confirmCancelLotStore.handleConfirm}
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
                CONFIRM
            </Button>
        </DialogActions>
    </Dialog>
)

export default observer(ConfirmCancelLot)