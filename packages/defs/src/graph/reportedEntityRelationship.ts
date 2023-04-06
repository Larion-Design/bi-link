import { z } from 'zod'
import { nodesRelationshipSchema } from "./graphBaseRelationship";

export type ReportedEntityRelationship = z.infer<typeof nodesRelationshipSchema>