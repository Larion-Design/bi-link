import { Injectable } from '@nestjs/common'
import { Person } from 'defs'
import { formatDate } from 'tools'
import { CacheService } from '@app/cache/cacheService'

@Injectable()
export class PersonCacheService {
  private readonly key = 'cachedPersons'

  constructor(private readonly cacheService: CacheService) {}

  getCachedPersonId = async (personInfo: string) =>
    this.cacheService.getHashKey(this.key, personInfo)

  getPersonNameAndBirthdateCacheKey = (
    firstName: string,
    lastName: string,
    birthdate: Date | string,
  ) => `${firstName}${lastName}${formatDate(birthdate)}`

  cachePersonId = async (person: Person) => {
    const {
      firstName: { value: firstName },
      lastName: { value: lastName },
      cnp: { value: cnp },
      birthdate: { value: birthdate },
      metadata: {
        trustworthiness: { source },
      },
      contactDetails,
      documents,
    } = person

    const personId = String(person._id)
    const map = new Map<string, string>()

    if (cnp.length) {
      map.set(cnp, personId)
    }
    if (source.length) {
      map.set(source, personId)
    }

    contactDetails.forEach(({ fieldValue }) => {
      if (fieldValue.length) {
        map.set(fieldValue, personId)
      }
    })

    documents.forEach(({ documentNumber }) => {
      if (documentNumber.length) {
        map.set(documentNumber, personId)
      }
    })

    if (firstName.length && lastName.length && birthdate) {
      map.set(this.getPersonNameAndBirthdateCacheKey(firstName, lastName, birthdate), personId)
    }

    if (map.size) {
      return this.cacheService.setHashKeys(this.key, Object.fromEntries(map))
    }
  }
}
