import { BeforeApplicationShutdown, Injectable } from '@nestjs/common'
import { Driver, ManagedTransaction, driver, auth, EagerResult, RecordShape } from 'neo4j-driver'
import { ConfigService } from '@nestjs/config'

export type TransactionHandler<T = unknown> = (
  transaction: ManagedTransaction,
) => Promise<T | never>

@Injectable()
export class MemgraphService implements BeforeApplicationShutdown {
  private readonly connection: Driver

  constructor(configService: ConfigService) {
    this.connection = driver(
      configService.getOrThrow<string>('NEO4J_ENDPOINT'),
      auth.basic(
        configService.getOrThrow<string>('NEO4J_USER'),
        configService.getOrThrow<string>('NEO4J_PASSWORD'),
      ),
      {
        maxTransactionRetryTime: 30000,
      },
    )
  }

  async mutate<T = void>(handler: TransactionHandler<T>): Promise<T | never> {
    const session = this.connection.session()
    const result = await session.executeWrite(handler)
    await session.close()
    return result
  }

  async query<P = Record<string, unknown>>(
    query: string,
    params?: P,
  ): Promise<EagerResult<RecordShape>> {
    const result = await this.connection.executeQuery(query, params)
    return result.records as unknown as EagerResult
  }

  async beforeApplicationShutdown() {
    await this.connection.close()
  }
}
