import { Controller } from '@nestjs/common'
import { OsintTermeneServiceConfig } from '@app/rpc/microservices/osint/termene'

type Params = Parameters<OsintTermeneServiceConfig['searchProceedings']>[0]
type Result = ReturnType<OsintTermeneServiceConfig['searchProceedings']> | undefined

@Controller()
export class SearchProceedings {}
