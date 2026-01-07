export declare class User {
    cedula: string;
    name: string;
    username: string;
    password: string;
    email: string;
    id_user: number;
    token?: string;
    created_at: Date;
    constructor(id_user: number, cedula: string, name: string, email: string, username: string, password: string, created_at: Date);
    static fromJson(json: any): User;
    static fromJsonArray(json: any[]): User[];
}
