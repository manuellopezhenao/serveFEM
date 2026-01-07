export declare class Login {
    username: string;
    password: string;
    constructor(username: string, password: string);
    static fromJson(json: any): Login;
    static fromJsonArray(json: any[]): Login[];
}
