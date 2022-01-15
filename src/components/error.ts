import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { borderBox, host, pReset } from '../css';
import { toBr } from '../html';

@customElement('my-error')
export class Error extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {
    message: { type: String },
  };

  public message = '';

  static styles = [
    borderBox,
    host,
    pReset,
    css`
      .message {
        font-size: 1rem;
        font-family: var(--font-family);
        padding: 0.2rem 0.5rem;
        background-color: #ffff00;
        color: #000000;
      }

      .icon {
        display: inline-block;
        width: 1.3rem;
      }
    `,
  ];

  render() {
    return html`<p class="message">
      <span class="icon">⚠</span>${toBr(this.message)}
    </p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-error': Error;
  }
}
