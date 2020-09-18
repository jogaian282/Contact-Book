export const SESSION_KEY = 'contact-book';
export const SESSION_USER_KEY = 'chat-user';

export function isPresent(obj: any): boolean {
    return obj !== undefined && obj !== null && obj !== '';
}
