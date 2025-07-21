export enum ErrorMethods {
    NotFoundException = 'nfe',
    Error = 'e',
    BadRequestException = 'bre',
    UnauthorizedException = 'ue',
    TokenExpiredError = 'TokenExpiredError',
    JsonWebTokenError = 'JsonWebTokenError',

}

export enum MessageError {
    error = 'Error',
    errorDB = 'Error con DB',
    errorInsertandoRegistro = 'Error Insertando Registro',
    userNotRegistered = 'User not registered',
    errorUpdatePassword = 'Error updating password',
    userAlreadyRegistered = 'User already registered',
    incorrectOldPassword = 'Incorrect old password.'
}