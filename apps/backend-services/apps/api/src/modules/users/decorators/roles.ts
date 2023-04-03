import { SetMetadata } from '@nestjs/common'
import { UserRole } from 'defs'

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles)
