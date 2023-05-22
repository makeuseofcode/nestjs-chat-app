import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const res: any = exception.getResponse();
        if (!res.message) {
            response.status(status).json({
                error: true,
                msg: res,
            });
        } else if (!Array.isArray(res.message)) {
            response.status(status).json({
                error: true,
                msg: res.message,
            });
        } else {
            response.status(status).json({
                error: true,
                msg: res.message[0],
            });
        }
    }
}
