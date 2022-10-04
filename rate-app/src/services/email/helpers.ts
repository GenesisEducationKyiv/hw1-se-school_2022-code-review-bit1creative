export const parseEmails = (emails: string) => {
    return emails.split(',').filter((email) => !!email);
};