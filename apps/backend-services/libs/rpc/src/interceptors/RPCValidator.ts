import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { ZodFunction, ZodTuple, ZodTypeAny } from 'zod'

@Injectable()
export class RPCValidator implements NestInterceptor {
  private schema: ZodFunction<ZodTuple<any, any>, ZodTypeAny>

  setSchema(schema: ZodFunction<ZodTuple<any, any>, ZodTypeAny>) {
    this.schema = schema
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const schema = this.schema

    if (schema) {
      schema.parameters().parse(context.getArgs())
      return next
        .handle()
        .pipe(tap((data: unknown) => (schema.returnType().parse(data) as unknown) ?? data))
    }
    return next.handle()
  }
}
