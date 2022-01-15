import { RedosDetectorError } from 'redos-detector';
import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { borderBox, host, pReset } from '../css';

const errorToMessage: Record<RedosDetectorError, string> = {
  hitMaxResults:
    'Hit max results limit, so there are more results than shown here.',
  hitMaxSteps:
    'Hit maximum number of steps so there may be more results than shown here.',
  stackOverflow: 'Stack overflow occurred. Regex may have too much branching.',
  timedOut: 'Timed out so there may be more results than shown here.',
};

@customElement('my-redos-error')
export class RedosError extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {
    error: { type: String },
  };

  public error!: RedosDetectorError;

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
      <span class="icon">⚠</span>${errorToMessage[this.error]}
    </p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-redos-error': RedosError;
  }
}
