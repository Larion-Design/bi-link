import { ingressInterfaceSchema } from '@app/rpc/microservices/ingress'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { ZodFunction, ZodTuple, ZodTypeAny } from 'zod'

@Injectable()
export class RPCValidator implements NestInterceptor {
  intercept<T = unknown>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const schema: ZodFunction<ZodTuple<any, any>, ZodTypeAny> = ingressInterfaceSchema.shape[
      context.getHandler().name
    ]

    if (schema) {
      schema.parameters().parse(context.getArgs())
      return next.handle().pipe(tap((data: T) => (schema.returnType().parse(data) as T) ?? data))
    }
    return next.handle()
  }
}
