import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from '@app/definitions/user'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: GqlExecutionContext & { req: { user } }) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    GqlExecutionContext.create(context).getContext<ExecutionContext & { req: { user } }>().req
      .user as User,
)
