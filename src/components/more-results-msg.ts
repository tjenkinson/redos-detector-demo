import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { borderBox, host, pReset } from '../css';

@customElement('my-more-results-msg')
export class MoreResultsMsg extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {};

  static styles = [
    borderBox,
    host,
    pReset,
    css`
      .message {
        font-size: 1rem;
        font-family: var(--font-family);
        padding: 0.2rem 0.5rem;
        text-align: center;
      }
    `,
  ];

  render() {
    return html`<p class="message">There are more results than shown here.</p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-more-results-msg': MoreResultsMsg;
  }
}
