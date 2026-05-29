import React, { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StopSale } from '../../cadence/transactions/market'
import stores from '../../stores/Stores'
import { LoadingButton } from '@mui/lab'
import * as fcl from '@onflow/fcl'
import GGConfirmation from '../GGConfirmation'
import { authInBlocto } from '../../services/flowService'


const CancelBtn: FC<{ nftFlowId: string }> = ({ nftFlowId }) => {

    const [loading, setLoading] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const [isCancellingConfirmShown, setIsCancellingConfirmShown] = useState(false)
    const navigate = useNavigate()

    const handleCancel = async () => {
        setLoading(true)
        let bloctoConfirmed = true

        const transactionId = await fcl.mutate({
            cadence: StopSale,
            proposer: fcl.currentUser,
            payer: fcl.currentUser,
            authorizations: [fcl.currentUser],
            limit: 500,
            args: (arg, t) => [
                // tokenID: UInt64, price: UFix64
                arg(nftFlowId.toString(), t.UInt64),
            ],
        })
            .catch((e) => {
                console.log(e)
                bloctoConfirmed = false
            })

        if (!bloctoConfirmed) {
            setLoading(false)
            return
        }

        stores.snackbars.showProgressSnackbar('Waiting for the transaction to be sealed')

        fcl.tx(transactionId).onceSealed()
            .then((res) => {
                handleCloseCancellingConfirmDialog()
                console.log(res)
                stores.snackbars.showSuccessSnackbar(`Your lot will be cancelled within 5 minutes!`)
                setIsCancelled(true)
            })
            .catch((error) => {
                console.error(error.data)
                stores.snackbars.showErrorSnackbar('Something went wrong')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleCancelButtonClick = async (): Promise<void> => {
        // авторизован ли юзер
        if (!stores.appBar.isAuthorized) {
            stores.snackbars.showErrorSnackbar('Unauthorized')
            await authInBlocto()
        } else {
            setIsCancellingConfirmShown(true)
        }
    }

    const handleCloseCancellingConfirmDialog = () => {
        setIsCancellingConfirmShown(false)
    }

    return (
        <>
            <LoadingButton
                variant={'outlined'}
                onClick={(): void => {
                    if (!isCancelled) void handleCancelButtonClick()
                }}
                loading={loading}
                sx={{
                    color: 'white',
                    borderColor: 'white',
                    borderRadius: 1,
                    width: '80%',
                    textTransform: 'none',
                    cursor: isCancelled ? 'default' : 'pointer',
                    fontFamily: '"Raleway", sans-serif',
                    '& .MuiCircularProgress-root': {
                        color: 'white',
                    },
                    '&.Mui-disabled': {
                        borderColor: '#d5d4d4',
                    },
                    ':hover': {
                        borderColor: '#d5d4d4',
                    },
                }}
            >
                {isCancelled ? '-' : 'CANCEL'}
            </LoadingButton>
            {
                isCancellingConfirmShown &&
                <GGConfirmation
                    open={isCancellingConfirmShown}
                    title={'Confirm Cancellation'}
                    message={'Are you sure you want to cancel your lot?'}
                    onClose={handleCloseCancellingConfirmDialog}
                    onConfirm={(): void => void handleCancel()}
                />
            }
        </>
    )
}

export default CancelBtn