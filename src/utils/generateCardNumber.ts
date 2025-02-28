import { v4 as uuidv4 } from 'uuid';

export const generateCardNumber = (): string => {
    // const today = new Date();
    //
    // const day = today.getDate();
    // const month = today.getMonth() + 1;
    // const year = today.getFullYear();
    //
    // const formattedDate = `${day.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${year}`;

    // return `LIB-${formattedDate.slice(-6)}-${uuidv4().slice(0, 8).toUpperCase()}`;
    return `LIB-${uuidv4().slice(0, 6).toUpperCase()}`;
};
