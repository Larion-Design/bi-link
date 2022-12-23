import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class FirebaseAuthGuard extends AuthGuard('firebase') {
  getRequest = (context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const req = ctx.getContext().req
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    req.body = ctx.getArgs()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return req
  }
}
