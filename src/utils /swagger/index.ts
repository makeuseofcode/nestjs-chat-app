import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
    SWAGGER_API_ROOT,
    SWAGGER_API_NAME,
    SWAGGER_API_DESCRIPTION,
    SWAGGER_API_CURRENT_VERSION,
    SWAGGER_API_AUTH_NAME,
    SWAGGER_API_AUTH_LOCATION,
} from './constants';
import { SwaggerDocumentOptions } from './option.type';

/**
 * @export
 * @param {INestApplication} app
 * @returns {void}
 * @description Setup swagger for the application
 * @see {@link https://docs.nestjs.com/controllers#swagger-documentation}
 */

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle(SWAGGER_API_NAME)
        .setDescription(SWAGGER_API_DESCRIPTION)
        .setVersion(SWAGGER_API_CURRENT_VERSION)
        .setContact('SATURN', 'https://saturn.com', 'saturn@gmail.com')
        .addBearerAuth()

        .build();

    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
            methodKey,
    };
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup(SWAGGER_API_ROOT, app, document);
}
