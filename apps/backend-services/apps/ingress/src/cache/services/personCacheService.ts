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

    const set = new Set<string>()

    if (cnp.length) {
      set.add(cnp)
    }
    if (source.length) {
      set.add(source)
    }

    contactDetails.forEach(({ fieldValue }) => {
      if (fieldValue.length) {
        set.add(fieldValue)
      }
    })

    documents.forEach(({ documentNumber }) => {
      if (documentNumber.length) {
        set.add(documentNumber)
      }
    })

    if (firstName.length && lastName.length && birthdate) {
      set.add(this.getPersonNameAndBirthdateCacheKey(firstName, lastName, birthdate))
    }

    if (set.size) {
      const personId = String(person._id)
      const map: Record<string, string> = {}
      set.forEach((cacheKey) => (map[cacheKey] = personId))
      return this.cacheService.setHashKeys(this.key, map)
    }
  }
}
