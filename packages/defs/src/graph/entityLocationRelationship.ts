import {z} from 'zod'
import { nodesRelationshipSchema } from './graphBaseRelationship'

export type EntityLocationRelationship = z.infer<typeof nodesRelationshipSchema>