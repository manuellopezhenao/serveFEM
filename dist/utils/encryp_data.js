"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareData = exports.encryptData = void 0;
const bcrypt = require("bcryptjs");
const encryptData = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
exports.encryptData = encryptData;
const compareData = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};
exports.compareData = compareData;
//# sourceMappingURL=encryp_data.js.map