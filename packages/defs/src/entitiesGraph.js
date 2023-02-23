"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityLabel = exports.RelationshipLabel = void 0;
var RelationshipLabel;
(function (RelationshipLabel) {
    RelationshipLabel["RELATED"] = "RELATED";
    RelationshipLabel["BORN_IN"] = "BORN_IN";
    RelationshipLabel["LIVES_AT"] = "LIVES_AT";
    RelationshipLabel["ASSOCIATE"] = "ASSOCIATE";
    RelationshipLabel["OWNER"] = "OWNER";
    RelationshipLabel["PARTY_INVOLVED"] = "PARTY_INVOLVED";
    RelationshipLabel["HAS_ATTACHMENT"] = "HAS_ATTACHMENT";
    RelationshipLabel["HQ_AT"] = "HQ_AT";
    RelationshipLabel["BRANCH_AT"] = "BRANCH_AT";
    RelationshipLabel["OCCURED_AT"] = "OCCURED_AT";
    RelationshipLabel["LOCATED_AT"] = "LOCATED_AT";
})(RelationshipLabel = exports.RelationshipLabel || (exports.RelationshipLabel = {}));
var EntityLabel;
(function (EntityLabel) {
    EntityLabel["PERSON"] = "PERSON";
    EntityLabel["COMPANY"] = "COMPANY";
    EntityLabel["EVENT"] = "EVENT";
    EntityLabel["FILE"] = "FILE";
    EntityLabel["PROPERTY"] = "PROPERTY";
    EntityLabel["LOCATION"] = "LOCATION";
})(EntityLabel = exports.EntityLabel || (exports.EntityLabel = {}));
