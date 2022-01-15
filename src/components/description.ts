import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { borderBox, host, pReset } from '../css';

@customElement('my-description')
export class Description extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {};

  static styles = [
    borderBox,
    host,
    pReset,
    css`
      .description {
        font-size: 1rem;
        text-align: center;
        font-family: var(--font-family);
        color: #000000;
      }
    `,
  ];

  render() {
    return html`<p class="description">
      A tool that tests with certainty if a regex pattern is safe from ReDoS
      attacks.
    </p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-description': Description;
  }
}
