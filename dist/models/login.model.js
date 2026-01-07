"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
class Login {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    static fromJson(json) {
        const login = new Login(json.username, json.password);
        return login;
    }
    static fromJsonArray(json) {
        return json.map(Login.fromJson);
    }
}
exports.Login = Login;
//# sourceMappingURL=login.model.js.map