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
    const element: React.ReactElement<IHubAgenceProps> = React.createElement(HubAgence, {
      context: this.context,
      siteUrl: this.context.pageContext.web.absoluteUrl,
      siteId: this.context.pageContext.site.id.toString(),
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
