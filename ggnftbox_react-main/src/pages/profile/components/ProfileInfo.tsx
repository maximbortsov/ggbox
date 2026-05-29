import { Avatar, Box, Button, Stack, SvgIcon, Typography } from '@mui/material'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import blocto from '../../../assets/icons/companiesLogos/blocto.svg'
import { observer } from 'mobx-react-lite'
import { DataGrid, GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid'
import { ApiSource, AssetsPath } from '../../../utils/api'
import { User } from '../../../entities/User'
import { plainToInstance } from 'class-transformer'
import { useQuery, useQueryClient } from 'react-query'
import { http } from '../../../utils/http'
import ImageDialog from './ImageDialog'
import EditIcon from '@mui/icons-material/Edit'
import * as fcl from '@onflow/fcl'
import { authInBlocto, fetchFUSDBalance, isGgAccountSetUp, setupGgAccount } from '../../../services/flowService'
import { UserTransaction } from '../../../entities/UserTransaction'
import { prettyDate } from '../../../utils/date'
import { TransactionType } from '../../../utils/enums'
import DoneIcon from '@mui/icons-material/Done'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import stores from '../../../stores/Stores'


const columns: GridColDef[] = [
    // {
    //     field: 'id',
    //     headerName: '№',
    //     flex: 1,
    //     align: 'center',
    //     headerAlign: 'center',
    //     sortable: true,
    //     renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
    //         <Typography
    //             fontSize={12}
    //             fontWeight={600}
    //             fontFamily={'Raleway'}
    //         >
    //             {params.colDef.headerName}
    //         </Typography>
    //     ),
    //     renderCell: (params: GridRenderCellParams): JSX.Element => (
    //         <Typography fontSize={12}>
    //             {params.value}
    //         </Typography>
    //     ),
    // },
    {
        field: 'type',
        headerName: 'Type',
        flex: 7,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                fontSize={12}
                fontWeight={600}
                fontFamily={'Raleway'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
        renderCell: (params: GridRenderCellParams): JSX.Element => (
            <Typography fontSize={12}>
                {params.value === TransactionType.BUY_BOX && 'box'}
                {params.value === TransactionType.BUY_LOT && 'lot'}
            </Typography>
        ),
    },
    {
        field: 'amount',
        headerName: 'Amount',
        type: 'string',
        flex: 7,
        align: 'center',
        headerAlign: 'center',
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                fontSize={12}
                fontWeight={600}
                fontFamily={'Raleway'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
        renderCell: (params: GridRenderCellParams): JSX.Element => (
            <Typography fontSize={12}>
                {`$ ${Number(params.value).toFixed(2)}`}
            </Typography>
        ),
    },
    {
        field: 'date',
        headerName: 'Date',
        type: 'Date',
        flex: 7,
        align: 'center',
        headerAlign: 'center',
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                fontSize={12}
                fontWeight={600}
                fontFamily={'Raleway'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
        renderCell: (params: GridRenderCellParams): JSX.Element => (
            <Typography fontSize={12}>
                {prettyDate(params.value)}
            </Typography>
        ),
    },
]

const ProfileInfo: React.FC = () => {

    const queryClient = useQueryClient()

    const userProfile = queryClient.getQueryData('currentUser') as User

    // История транзакций пользователя
    const fetchUserTransactions = async (): Promise<UserTransaction[]> => {
        const user = queryClient.getQueryData('currentUser') as User
        if (!user.id) return Promise.reject()
        return http.get(ApiSource + 'user/all-transactions')
            .then((res) => res.data)
            .then((res) => plainToInstance(UserTransaction, res as any[]))
    }
    const userTransactions = useQuery('userTransactions', fetchUserTransactions)

    // Открытие диалога загрузки фото
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
    const handleImageDialog = useCallback(() => {
        setIsImageDialogOpen(!isImageDialogOpen)
    }, [isImageDialogOpen])

    // Авторизованный юзер из Блокто
    const [bloctoUser, setBloctoUser] = useState<any>(null)
    const [balance, setBalance] = useState<number>(0)
    const [accountSetUp, setAccountSetUp] = useState<boolean>(false)

    // Получение залогиненного юзера (flow) и subscribe
    useEffect(() => {
        fcl.currentUser.subscribe(setBloctoUser)
    }, [])

    // Авторизоваться / разлогиниться в блокто
    const handleConnectBlocto = async (): Promise<void> => {
        if (bloctoUser?.loggedIn) {
            fcl.currentUser.unauthenticate()
        } else {
            await authInBlocto()
        }
    }

    // обновить баланс после логина / изменения юзера
    useEffect(() => {
        isGgAccountSetUp()
            .then((res) => setAccountSetUp(res))
            .catch((e) => console.error(e))

        fetchFUSDBalance()
            .then((res) => setBalance(res))
            .catch((e) => console.error(e))
    }, [bloctoUser])

    // handle click on top up button
    const handleTopUpTestFusd = (): void => {
        console.log(bloctoUser.addr)
        // void navigator.clipboard.writeText(bloctoUser.addr)
        window.open('https://testnet-faucet.onflow.org/fund-account', '_self')
    }

    return (
        <>
            <Stack spacing={2}>
                <Stack
                    alignItems={'center'}
                    spacing={1}
                    sx={{
                        px: 3,
                        py: 6,
                        background: '#080E24',
                        borderRadius: 2,
                        boxShadow: '31px 31px 62px #050816, -31px -31px 62px #0b1432;',
                    }}
                >
                    {/* Avatar */}
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                opacity: 0.6,
                            },
                        }}
                    >
                        <Avatar
                            src={AssetsPath + (userProfile?.avatar ?? '')}
                            alt={'User\'s avatar'}
                            sx={{ width: 104, height: 104 }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                color: '#FFFFFF',
                                width: 1,
                                height: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                opacity: 0.0,
                                '&:hover': {
                                    opacity: 0.6,
                                },
                                cursor: 'pointer',
                            }}
                            onClick={handleImageDialog}
                        >
                            <EditIcon fontSize={'large'}/>
                        </Box>
                    </Box>
                    {/* Username */}
                    <Typography
                        variant={'button'}
                        fontSize={20}
                        fontWeight={'bold'}
                        color={'#554ADA'}
                    >
                        {userProfile?.username}
                    </Typography>
                    {/* Wallet */}
                    {
                        bloctoUser?.loggedIn &&
                        <Box>
                            <Typography variant={'body2'}>
                                {`Wallet: ${String(bloctoUser?.addr)}`}
                            </Typography>
                            <Typography variant={'body2'} mt={0.5}>
                                {`Balance: ${balance.toFixed(3)} FUSD`}
                            </Typography>
                        </Box>
                    }
                    {/* Configuration */}
                    {
                        bloctoUser?.loggedIn &&
                        <Stack direction={'row'} alignItems={'start'} spacing={0.5}>
                            {
                                accountSetUp ?
                                    <DoneIcon sx={{ fontSize: 20, color: 'green' }}/>
                                    :
                                    <PriorityHighIcon sx={{ fontSize: 20, color: 'red' }}/>
                            }
                            {
                                accountSetUp ?
                                    <Typography variant={'body1'}>
                                        account configured
                                    </Typography>
                                    :
                                    <Typography
                                        variant={'body1'}
                                        onClick={(): void => {
                                            setupGgAccount()
                                                .then(() => {
                                                    setAccountSetUp(true)
                                                    stores.snackbars.showSuccessSnackbar('Your account is configured to store GGNFT')
                                                })
                                                .catch((e) => stores.snackbars.showErrorSnackbar(e))
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        configure account
                                    </Typography>
                            }
                        </Stack>
                    }
                    {/* Top up testnet FUSD*/}
                    {
                        bloctoUser?.loggedIn &&
                        <Button
                            variant={'contained'}
                            disableElevation
                            onClick={handleTopUpTestFusd}
                            sx={{
                                background: '#554ADA',
                                borderRadius: 1,
                                mx: 'auto',
                                mt: 2,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                fontFamily: '"Raleway", sans-serif',
                                ':hover': {
                                    background: '#5d53d9',
                                },
                            }}
                        >
                            <Typography variant={'body2'} fontWeight={'bold'}>
                                Top up testnet FUSD
                            </Typography>
                        </Button>
                    }
                    <Button
                        variant={'contained'}
                        disableElevation
                        onClick={(): void => void handleConnectBlocto()}
                        sx={{
                            background: '#554ADA',
                            borderRadius: 1,
                            mx: 'auto',
                            mt: 2,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            fontFamily: '"Raleway", sans-serif',
                            ':hover': {
                                background: '#5d53d9',
                            },
                        }}
                    >
                        <SvgIcon component={blocto}/>
                        <Typography variant={'body2'} fontWeight={'bold'}>
                            {bloctoUser?.loggedIn ? 'LOG OUT' : 'CONNECT BLOCTO'}
                        </Typography>
                    </Button>
                </Stack>

                <Box height={350}>
                    {
                        userTransactions.isSuccess &&
                        <DataGrid
                            // Жалуется, что с бэка не приходит поле id
                            rows={userTransactions.data.map((transaction, index) => {
                                    transaction.id = index.toString()
                                    return transaction
                                },
                            )}
                            columns={columns}
                            rowHeight={48}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableColumnMenu
                            disableColumnFilter
                            disableSelectionOnClick
                            components={{
                                NoRowsOverlay: () =>
                                    <Stack height={'100%'} alignItems={'center'} justifyContent={'center'}>
                                        <Typography
                                            variant={'body1'}
                                            textAlign={'center'}
                                        >
                                            Your transaction history is currently empty.
                                        </Typography>
                                        <Typography
                                            mt={1}
                                            variant={'body2'}
                                            textAlign={'center'}
                                        >
                                            Box and moment purchasing records are displayed here.
                                        </Typography>
                                    </Stack>,
                            }}
                            sx={{
                                background: '#080E24',
                                borderRadius: 2,
                                boxShadow: '20px 20px 62px #050816, -20px -20px 62px #0b1432;',
                                border: 'none',
                                '& .MuiDataGrid-menuIcon': {
                                    display: 'none',
                                },
                                '& .MuiIconButton-root': {
                                    color: 'white',
                                },
                                '& .MuiIconButton-root.Mui-disabled': {
                                    color: 'white',
                                },
                                '& .aboba': {
                                    borderBottom: 'none',
                                },
                                '& .MuiTablePagination-select': {
                                    color: 'white',
                                },
                                '& .MuiSelect-icon': {
                                    color: 'white',
                                },
                                '.MuiDataGrid-cell:focus': {
                                    outline: 'none',
                                },
                                '& .MuiDataGrid-columnSeparator--sideRight': {
                                    visibility: 'hidden',
                                },
                                '& .MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-iconButtonContainer': {
                                    position: 'absolute',
                                    right: -5,
                                },
                            }}
                        />
                    }
                </Box>
            </Stack>
            {
                isImageDialogOpen && <ImageDialog open={isImageDialogOpen} onClose={handleImageDialog}/>
            }
        </>
    )
}

export default observer(ProfileInfo)