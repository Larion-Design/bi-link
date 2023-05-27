import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { ZodFunction, ZodTuple, ZodTypeAny } from 'zod'

@Injectable()
export class RPCValidator implements NestInterceptor {
  constructor(private readonly schema: ZodFunction<ZodTuple<any, any>, ZodTypeAny>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    this.schema.parameters().parse(context.getArgs())
    return next
      .handle()
      .pipe(tap((data: unknown) => this.schema.returnType().parse(data) as unknown))
  }
}
