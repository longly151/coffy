import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from "@nestjs/common";
import * as _ from "lodash";
/**
 * Handle Error (After getting error from vaidation.pipe)
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    // Handle isNotEmpty Error
    if (
      exceptionResponse.statusCode === 400 &&
      _.isArray(exceptionResponse.message)
    ) {
      const newMessage = await exceptionResponse.message.map((element: any) => {
        if (_.includes(element, " should not be empty")) {
          const currentObjectName = _.replace(
            element,
            " should not be empty",
            ""
          );
          return {
            constraints: {
              isNotEmpty: element,
            },
            property: currentObjectName,
          };
        }
        return element;
      });
      exceptionResponse.message = newMessage;
    }

    // response.status(statusCode).json({
    //   statusCode,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // });

    // console.log('http-exception.filter', exception.getResponse());

    // Get Custom Message
    const customMessage = exceptionResponse.error
      ? exceptionResponse.message
      : "";

    switch (statusCode) {
      case 401:
        response.status(statusCode).json({
          statusCode,
          message: customMessage || "Missing authentication",
          error: "Unauthorized",
        });
        break;
      case 403:
        response.status(statusCode).json({
          statusCode,
          message: customMessage || "Forbidden resource",
          error: "Forbidden",
        });
        break;
      case 500:
        response.status(statusCode).json({
          statusCode,
          message: customMessage || "An internal server error occurred",
          error: "Internal Server Error",
        });
        break;
      default:
        response.status(statusCode).json(exception.getResponse());
        break;
    }
  }
}
