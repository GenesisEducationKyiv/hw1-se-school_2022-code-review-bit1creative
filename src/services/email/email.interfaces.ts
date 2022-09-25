
export type GetEmailsFromDB = {
    error: null | string;
    email: string;
};

export interface IEmailsDBRepository {
    addEmailToDB(email: string): Promise<GetEmailsFromDB>;
    getEmailsFromDB(): Promise<string>;
}
