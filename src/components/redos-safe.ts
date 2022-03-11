import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { borderBox, host, pReset } from '../css';

@customElement('my-redos-safe')
export class RedosSafe extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {
    backtrackCount: { type: Number },
  };

  public backtrackCount!: number;

  static styles = [
    borderBox,
    host,
    pReset,
    css`
      .message {
        font-size: 1rem;
        font-family: var(--font-family);
        padding: 0.2rem 0.5rem;
        background-color: #6be96b;
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
      <span class="icon">✔</span>This pattern is safe from ReDoS
      attacks.${this.backtrackCount
        ? ` There may be ${
            this.backtrackCount === Infinity
              ? 'infinite'
              : `at most ${this.backtrackCount}`
          } backtrack${this.backtrackCount !== 1 ? 's' : ''} possible.`
        : ''}
      🎉
    </p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-redos-safe': RedosSafe;
  }
}
