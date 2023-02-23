"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.UserActions = void 0;
exports.UserActions = {
    ENTITY_CREATED: 'ENTITY_CREATED',
    ENTITY_UPDATED: 'ENTITY_UPDATED',
};
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["OPERATOR"] = "OPERATOR";
    Role["CI"] = "CI";
    Role["DEV"] = "DEV";
})(Role = exports.Role || (exports.Role = {}));
