import React, { FC, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { PurchaseNftFusd } from '../../cadence/transactions/market'
import stores from '../../stores/Stores'
import { authInBlocto, checkFlowAccount, isAuthorizedInBlocto, isGgAccountSetUp } from '../../services/flowService'
import { LoadingButton } from '@mui/lab'
import GGConfirmation from '../GGConfirmation'
import * as fcl from '@onflow/fcl'


interface BuyBtnProps {
    nftFlowId: string
    sellerAddress: string
    price: number
    playId: string
}


const BuyBtn: FC<BuyBtnProps> = ({ sellerAddress, price, nftFlowId, playId }) => {

    const [loading, setLoading] = useState(false)
    const [isBought, setIsBought] = useState(false)
    const [isBuyingConfirmShown, setIsBuyingConfirmShown] = useState(false)
    const [isAccountSetUpConfirm, setIsAccountSetUpConfirm] = useState<boolean>(false)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const handleBuy = async () => {
        setLoading(true)
        let bloctoConfirmed = true

        const transactionId = await fcl.mutate({
            cadence: PurchaseNftFusd,
            args: (arg, t) => [
                // sellerAddress: Address, tokenID: UInt64, purchaseAmount: UFix64
                arg(sellerAddress, t.Address),
                arg(nftFlowId.toString(), t.UInt64),
                arg(price.toFixed(8), t.UFix64),
            ],
            proposer: fcl.currentUser,
            payer: fcl.currentUser,
            authorizations: [fcl.currentUser],
            limit: 500,
        })
            .catch((e) => {
                console.log(e)
                bloctoConfirmed = false
            })

        if (!bloctoConfirmed) {
            setLoading(false)
            return
        }

        stores.snackbars.showProgressSnackbar('Waiting for the transaction to be sealed.')

        fcl.tx(transactionId).onceSealed()
            .then(() => {
                handleCloseBuyingConfirmDialog()
                stores.snackbars.showSuccessSnackbar('You will get your nft within 5 minutes!')
                void queryClient.invalidateQueries('lots-' + playId)
                stores.appBar.refetchBalance = !stores.appBar.refetchBalance
                setIsBought(true)
                setLoading(false)
            })
            .catch((err) => {
                stores.snackbars.showErrorSnackbar(err)
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleBuyButtonClick = async (): Promise<void> => {
        // авторизован ли юзер
        if (!stores.appBar.isAuthorized) {
            stores.snackbars.showErrorSnackbar('Unauthorized')
            await authInBlocto()
        } else {
            // авторизован ли в блокто
            if (await isAuthorizedInBlocto()) {
                // настроен ли его аккаунт
                if (!(await isGgAccountSetUp())) {
                    setIsAccountSetUpConfirm(true)
                } else {
                    setIsBuyingConfirmShown(true)
                }
            } else {
                stores.snackbars.showErrorSnackbar('Connect your wallet!')
            }
        }
    }

    const handleSetupGgAccount = async (): Promise<void> => {
        setLoading(true)
        await checkFlowAccount()
        handleCloseAccountSetUpConfirmDialog()
        setLoading(false)
    }

    const handleCloseAccountSetUpConfirmDialog = () => {
        setIsAccountSetUpConfirm(false)
    }

    const handleCloseBuyingConfirmDialog = () => {
        setIsBuyingConfirmShown(false)
    }

    return (
        <>
            <LoadingButton
                variant={'outlined'}
                onClick={(): void => {
                    if (!isBought) void handleBuyButtonClick()
                }}
                loading={loading}
                sx={{
                    color: 'white',
                    background: '#554ADA',
                    borderRadius: 1,
                    width: '80%',
                    textTransform: 'none',
                    cursor: isBought ? 'default' : 'pointer',
                    fontFamily: '"Raleway", sans-serif',
                    '& .MuiCircularProgress-root': {
                        color: 'white',
                    },
                    '&.Mui-disabled': {
                        background: 'rgba(85,74,218,0.35)',
                    },
                    ':hover': {
                        background: '#5d53d9',
                    },
                }}
            >
                {isBought ? '-' : 'BUY'}
            </LoadingButton>
            {
                isBuyingConfirmShown &&
                <GGConfirmation
                    open={isBuyingConfirmShown}
                    isLoading={loading}
                    title={'Lot Purchase'}
                    message={'You are going to commit a lot purchase. Approve your action to proceed.'}
                    onClose={handleCloseBuyingConfirmDialog}
                    onConfirm={(): void => void handleBuy()}
                />
            }
            {
                isAccountSetUpConfirm &&
                <GGConfirmation
                    open={isAccountSetUpConfirm}
                    title={'Account configuration'}
                    message={'We need to configure your Flow account to store GG NFT. Do you want to proceed?'}
                    onClose={handleCloseAccountSetUpConfirmDialog}
                    onConfirm={(): void => void handleSetupGgAccount()}
                    isLoading={loading}
                />
            }
        </>
    )
}

export default BuyBtn