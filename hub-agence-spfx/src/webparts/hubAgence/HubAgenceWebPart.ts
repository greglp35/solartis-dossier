import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import HubAgence from './components/HubAgence';
import { IHubAgenceProps } from './components/HubAgence';

export interface IHubAgenceWebPartProps {
  // No configurable properties required for V1
}

export default class HubAgenceWebPart extends BaseClientSideWebPart<IHubAgenceWebPartProps> {
  public render(): void {
    // Build the compound site ID required by Graph API: {hostname},{spSiteId},{spWebId}
    const hostname = new URL(this.context.pageContext.web.absoluteUrl).hostname;
    const spSiteId = this.context.pageContext.site.id.toString();
    const spWebId = this.context.pageContext.web.id.toString();
    const graphSiteId = `${hostname},${spSiteId},${spWebId}`;

    const element: React.ReactElement<IHubAgenceProps> = React.createElement(HubAgence, {
      context: this.context,
      siteUrl: this.context.pageContext.web.absoluteUrl,
      siteId: graphSiteId,
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
