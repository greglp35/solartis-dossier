import { MSGraphClientV3 } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface GraphUser {
  id: string;
  displayName: string;
  userPrincipalName: string;
}

/**
 * Returns an MSGraphClientV3 instance using the SPFx context.
 */
export async function getGraphClient(context: WebPartContext): Promise<MSGraphClientV3> {
  const client = await context.msGraphClientFactory.getClient('3');
  return client;
}

/**
 * Retrieves the current authenticated user's profile from Microsoft Graph.
 */
export async function getCurrentUser(client: MSGraphClientV3): Promise<GraphUser> {
  const response = await client
    .api('/me')
    .select('id,displayName,userPrincipalName')
    .get();

  return {
    id: response.id as string,
    displayName: response.displayName as string,
    userPrincipalName: response.userPrincipalName as string,
  };
}
