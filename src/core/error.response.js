
const StatusCode = {
    FORBIDDEN:403,
    CONFLICT:409
}
const ReasonStatusCode={
    FORBIDDEN:'Bad request error',
    CONFLICT:'Conflict error'
}

class ErorResponse extends Error
{
    constructor(message,status)
    {
        super(message)
        this.status=status
    }
}

class ConflictRequestError extends ErorResponse{
    constructor(message = ReasonStatusCode.CONFLICT,statusCode=StatusCode.FORBIDDEN)
    {
        super(message,statusCode)
    }
}

class BadRequest extends ErorResponse{
    constructor(message = ReasonStatusCode.FORBIDDEN,statusCode=StatusCode.FORBIDDEN)
    {
        super(message,statusCode)
    }
}
module.exports={
    ConflictRequestError,
    BadRequest
}