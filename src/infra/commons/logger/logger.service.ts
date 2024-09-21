import { Inject, Injectable, Scope, Logger } from '@nestjs/common';
import { ContextService } from '../context/context.service';

@Injectable({ scope: Scope.DEFAULT })
export class LoggerService {
  private logByContext: Record<string, any> = {};
  private readonly logger = new Logger(LoggerService.name);

  constructor(
    @Inject('CONTEXT_STORAGE_SERVICE_KEY')
    private readonly contextService: ContextService,
  ) {}

  private getLog() {
    const contextId = this.contextService.getContextId();
    this.logByContext[contextId] ??= { requests: [], responses: [], errors: [] };
    return this.logByContext[contextId];
  }

  addRequest(data: any) {
    const log = this.getLog();
    log.requests.push(data);
  }

  addResponse(data: any) {
    const log = this.getLog();
    log.responses.push(data);
  }

  addInternalError(error: any) {
    const log = this.getLog();
    log.errors.push(error);
    this.logToStdout(error, 'error');
  }

  finish() {
    const contextId = this.contextService.getContextId();
    const log = this.getLog();
    this.logToStdout({ contextId, log });
    this.logByContext[contextId] = null;
  }

  private logToStdout(data: any, level: 'log' | 'error' = 'log') {
    const output = JSON.stringify(data);
    if (level === 'error') {
      console.error(output); // Loga como erro
    } else {
      console.log(output); // Loga como informação
    }
  }
}
