import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { aReset, borderBox, h1Reset, host } from '../css';

@customElement('my-title')
export class Title extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {};

  static styles = [
    borderBox,
    host,
    h1Reset,
    aReset,
    css`
      .title {
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        font-family: var(--font-family);
        color: #000000;
      }
    `,
  ];

  render() {
    return html`<h1 class="title">
      <a
        href="https://github.com/tjenkinson/redos-detector"
        target="_blank"
        rel="noopener"
        >ReDoS Detector</a
      >
    </h1>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-title': Title;
  }
}
