import { IngressService } from '@app/rpc/microservices/ingress'
import { Injectable } from '@nestjs/common'
import { PersonAPIInput, UpdateSource } from 'defs'

@Injectable()
export class PersonLoaderService {
  constructor(private readonly ingressService: IngressService) {}

  findPerson = async (firstName: string, lastName: string, birthdate?: Date) =>
    this.ingressService.findPersonId(firstName, lastName, birthdate)

  createPerson = async (personInfo: PersonAPIInput, author: UpdateSource) =>
    this.ingressService.createEntity('PERSON', personInfo, author)
}
