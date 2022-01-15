import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { aReset, borderBox, host } from '../css';

@customElement('my-version')
export class Version extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {
    version: { type: String },
  };

  public version = '';

  static styles = [
    borderBox,
    host,
    aReset,
    css`
      .version {
        font-size: 0.8rem;
        font-family: var(--font-family);
      }
    `,
  ];

  render() {
    return html`<div class="version">
      <a
        class="link"
        href="https://github.com/tjenkinson/redos-detector"
        target="_blank"
        rel="noopener"
        >${this.version}</a
      >
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-version': Version;
  }
}
