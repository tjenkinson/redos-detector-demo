import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { aReset, borderBox, host } from '../css';

@customElement('my-gh-link')
export class GhLink extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {};

  static styles = [
    borderBox,
    host,
    aReset,
    css`
      .logo {
        width: 3rem;
        height: 3rem;
      }
    `,
  ];

  render() {
    return html`<a
      href="https://github.com/tjenkinson/redos-detector"
      target="_blank"
      rel="noopener"
      ><img
        class="logo"
        alt="GitHub Logo"
        src="${new URL('../assets/GitHub-Mark-120px-plus.png', import.meta.url)
          .href}"
    /></a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-gh-link': GhLink;
  }
}
