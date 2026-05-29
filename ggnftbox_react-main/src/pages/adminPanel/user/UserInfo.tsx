import React, { FC } from 'react'
import { User } from '../../../entities/User'
import { Box } from '@mui/material'
import DBField from '../components/DBField'
import { prettyDateTime } from '../../../utils/date'


const UserInfo: FC<{ user: User | null }> = ({ user }) => (
    <>
        {
            user !== null &&
            <Box>
                <DBField label={'ID'} field={user.id}/>
                <DBField label={'Login'} field={user.username}/>
                <DBField label={'Email'} field={user.email}/>
                <DBField label={'Email confirmed'} field={user.isEmailConfirmed ? 'true' : 'false'}/>
                <DBField label={'Balance'} field={'$' + user.balance.toString()}/>
                <DBField label={'Registered at'} field={prettyDateTime(user.createdAt)}/>
                <DBField label={'Last update at'} field={prettyDateTime(user.updatedAt)}/>
            </Box>
        }
    </>
)

export default UserInfo