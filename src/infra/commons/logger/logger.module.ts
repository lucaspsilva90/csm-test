import { Global, Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LoggerService } from './logger.service';


@Global()
@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule implements OnModuleInit {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly loggerService: LoggerService,
    ) { }

    // private shouldIgnoreRoute(url: string) {
    //     const healthcheckPath = this.configService.get<string>('plugins.healthcheck.route');
    //     const swaggerPath = this.configService.get<string>('plugins.swagger.route');

    //     const ignoredPaths = [
    //         new RegExp(`^${healthcheckPath}`),
    //         new RegExp(`^${swaggerPath}`),
    //     ];

    //     return ignoredPaths.some((regex) => regex.test(url));
    // }

    onModuleInit() {
        const app = this.httpAdapterHost.httpAdapter.getInstance();

        app.addHook('onRequest', async (request: FastifyRequest) => {
            // if (this.shouldIgnoreRoute(request.url)) return;

            this.loggerService.addRequest({
                params: request.params,
                query: request.query,
                headers: request.headers,
                url: request.url,
                method: request.method,
                body: request.body || {},
            });
        });

        app.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply, payload: string) => {
            // if (this.shouldIgnoreRoute(request.url)) return payload;

            const { headers, statusCode } = reply;
            let body: any;

            try {
                body = JSON.parse(payload);
            } catch (error) {
                return payload;
            }

            this.loggerService.addResponse({ headers, statusCode, body });
            this.loggerService.finish();

            return JSON.stringify(body);
        });

        app.addHook('onError', async (request: FastifyRequest, _reply: FastifyReply, error: any) => {
            // if (this.shouldIgnoreRoute(request.url)) return;

            this.loggerService.addInternalError(error);
        });
    }
}
