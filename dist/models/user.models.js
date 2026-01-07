"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id_user, cedula, name, email, username, password, created_at) {
        this.id_user = id_user;
        this.cedula = cedula;
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.created_at = created_at;
    }
    static fromJson(json) {
        const login = new User(json.id_user, json.cedula, json.name, json.email, json.username, json.password, json.created_at);
        return login;
    }
    static fromJsonArray(json) {
        return json.map(User.fromJson);
    }
}
exports.User = User;
//# sourceMappingURL=user.models.js.map