import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { borderBox, host } from '../css';

@customElement('my-loading')
export class Loading extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {};

  static styles = [
    borderBox,
    host,
    // https://loading.io/css/
    css`
      .loading {
        text-align: center;
      }

      .lds-ellipsis {
        display: inline-block;
        position: relative;
        width: 5rem;
        height: 1rem;
      }
      .lds-ellipsis div {
        position: absolute;
        width: 1rem;
        height: 1rem;
        background: #d0d0d0;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
      }
      .lds-ellipsis div:nth-child(1) {
        left: 0;
        animation: lds-ellipsis1 0.6s infinite;
      }
      .lds-ellipsis div:nth-child(2) {
        left: 0;
        animation: lds-ellipsis2 0.6s infinite;
      }
      .lds-ellipsis div:nth-child(3) {
        left: 2rem;
        animation: lds-ellipsis2 0.6s infinite;
      }
      .lds-ellipsis div:nth-child(4) {
        left: 4rem;
        animation: lds-ellipsis3 0.6s infinite;
      }
      @keyframes lds-ellipsis1 {
        0% {
          transform: scale(0);
        }
        100% {
          transform: scale(1);
        }
      }
      @keyframes lds-ellipsis3 {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(0);
        }
      }
      @keyframes lds-ellipsis2 {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(2rem, 0);
        }
      }
    `,
  ];

  render() {
    return html`<div class="loading">
      <div class="lds-ellipsis" aria-label="Loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-loading': Loading;
  }
}
