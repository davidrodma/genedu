import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost
    UnauthorizedException
    const ctx = host.switchToHttp()

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const path = httpAdapter.getRequestUrl(ctx.getRequest())
    console.log('exception', exception)
    const message = exception instanceof Error ? exception.message : exception
    console.log('message_error', message)
    let message_error = message
    let messages = [message_error]
    if (httpStatus >= 500) {
      message_error =
        typeof message_error == 'string' && message_error.includes('violate the required relation')
          ? 'There are records dependent on this item(s).'
          : 'Internal Server Error'
      messages = [message_error]
    } else if (
      (exception instanceof BadRequestException || exception instanceof UnauthorizedException) &&
      (exception?.getResponse() as any)?.message
    ) {
      try {
        console.log('entrou')
        messages = (exception?.getResponse() as any)?.message
        message_error = Array.isArray(messages) ? messages.join('; ') : messages
      } catch (err: Error | any) {
        message_error = `Error Undefined ${err.message | err}`
        messages = [message_error]
      }
    } else if (exception instanceof HttpException) {
      message_error = (exception.getResponse() as any)?.error
    }
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      error: message_error,
      messages: messages,
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
