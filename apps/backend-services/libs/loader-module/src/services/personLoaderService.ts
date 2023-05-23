import { Injectable } from '@nestjs/common'
import { PersonAPIInput, UpdateSource } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'

@Injectable()
export class PersonLoaderService {
  constructor(private readonly ingressService: IngressService) {}

  findPerson = async (firstName: string, lastName: string, birthdate?: Date, dataSource?: string) =>
    this.ingressService.findPersonId(firstName, lastName, birthdate, dataSource)

  createPerson = async (personInfo: PersonAPIInput, author: UpdateSource) =>
    this.ingressService.createEntity('PERSON', personInfo, author)
}
