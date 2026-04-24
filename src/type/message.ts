export type Message = {
    role: Role;
    text: string;
}

type Role = "user" | "assistant";