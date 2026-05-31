import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface SPUser {
  id: string;
  displayName: string;
  email: string;
}

export function getCurrentUser(context: WebPartContext): SPUser {
  return {
    id: context.pageContext.user.loginName,
    displayName: context.pageContext.user.displayName,
    email: context.pageContext.user.email,
  };
}

export function getSPHttpClient(context: WebPartContext): SPHttpClient {
  return context.spHttpClient;
}
