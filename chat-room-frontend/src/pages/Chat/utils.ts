import { User } from "./types";

export function getUserInfo(): User {
    return JSON.parse(localStorage.getItem('userInfo')!);
}
