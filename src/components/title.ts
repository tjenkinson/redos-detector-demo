import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { borderBox, h1Reset, host } from '../css';

@customElement('my-title')
export class Title extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {};

  static styles = [
    borderBox,
    host,
    h1Reset,
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
    return html`<h1 class="title">ReDoS Detector</h1>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-title': Title;
  }
}
