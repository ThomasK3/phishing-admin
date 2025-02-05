// backend/src/config/brevo.ts

import * as SibApi from '@sendinblue/client';

if (!process.env.BREVO_API_KEY) {
  throw new Error('BREVO_API_KEY is not defined in environment variables');
}

const apiInstance = new SibApi.TransactionalEmailsApi();
apiInstance.setApiKey(SibApi.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

export const emailApi = apiInstance;