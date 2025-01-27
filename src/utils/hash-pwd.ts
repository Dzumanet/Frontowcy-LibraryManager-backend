import * as crypto from 'crypto';
import * as process from 'process';

export const hashPwd = (p: string): string => {
    const hmac = crypto.createHmac('sha512', process.env.SAlT_PWD_KEY);
    hmac.update(p);
    return hmac.digest('hex');
};
