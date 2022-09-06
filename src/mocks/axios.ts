import { AxiosError } from 'axios';

type MockAxiosErrorProps = {
    name: string;
    message: string;
    status: string;
};

export const mockAxiosError = ({
    name,
    message,
    status,
}: MockAxiosErrorProps) => {
    const err: AxiosError = {
        config: {},
        isAxiosError: true,
        toJSON: () => ({}),
        name,
        message,
        status,
    };

    return err;
};
