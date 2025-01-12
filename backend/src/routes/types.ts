
interface ErrorResponse {
    message: string
    error: any
    data?: undefined
}

interface SuccessResponse<B = any> {
    data: B
    message?: undefined
    error?: undefined 
}

export type ResponseBody<B = any> = ErrorResponse | SuccessResponse<B>