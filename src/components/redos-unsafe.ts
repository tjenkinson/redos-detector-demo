import { RedosDetectorError } from 'redos-detector';
import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { borderBox, host, pReset } from '../css';

@customElement('my-redos-unsafe')
export class RedosUnsafe extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {
    error: { type: String },
    maybe: { type: Boolean },
    score: { type: Number },
  };

  public error!: RedosDetectorError;
  public score!: number;
  public maybe: boolean;

  constructor() {
    super();
    this.maybe = false;
  }

  static styles = [
    borderBox,
    host,
    pReset,
    css`
      .message {
        font-size: 1rem;
        font-family: var(--font-family);
        padding: 0.2rem 0.5rem;
        background-color: #ff8181;
        color: #000000;
      }

      .icon {
        display: inline-block;
        width: 1.3rem;
      }
    `,
  ];

  render() {
    return html`<p class="message" data-test="redos-unsafe">
      <span class="icon">❌</span>This pattern
      ${this.maybe ? 'might not be' : 'is not'} safe from ReDoS attacks.
      ${this.score === Infinity
        ? `There may be infinite backtracks possible.`
        : `Score: ${this.score}`}
    </p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-redos-unsafe': RedosUnsafe;
  }
}
