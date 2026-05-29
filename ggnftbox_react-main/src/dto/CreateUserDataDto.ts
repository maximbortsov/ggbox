export class CreateUserDataDto {
    email: string
    password: string
    roles: string[] = ['user']
    username: string
}