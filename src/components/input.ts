import { LitElement, css, html, PropertyDeclaration } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref';
import { live } from 'lit/directives/live';
import { borderBox, host } from '../css';

export type Flag = 'i' | 'u' | '';

@customElement('my-input')
export class Input extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {
    value: { type: String },
    flag: { type: String },
  };

  public value: string;
  public flag: Flag;

  constructor() {
    super();
    this.value = '';
    this.flag = '';
  }

  static styles = [
    borderBox,
    host,
    css`
      .container {
        display: grid;
        grid-template-columns: max-content 1fr max-content max-content;
        width: 100%;
        align-items: center;
        grid-gap: 0.25em;
      }

      .input {
        display: block;
        width: 100%;
        padding: 0.4rem 0.5rem;
      }

      .slash,
      .flags,
      .input {
        font-size: 1.5rem;
        font-family: Arial;
      }

      .flags {
        display: flex;
        gap: 0.5rem;
      }

      .flags .checkbox {
        margin-right: 0.4em;
        width: 1rem;
        height: 1rem;
      }
    `,
  ];

  private _onCheckboxClick = (flag: Flag) => {
    if (this.flag === flag) {
      this.flag = '';
    } else {
      this.flag = flag;
    }

    this.dispatchEvent(
      new CustomEvent('my-change', {
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _onChange = (event: Event) => {
    this.value = (event.target as HTMLInputElement).value;
    this.dispatchEvent(
      new CustomEvent('my-change', {
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return html`<div class="container">
      <div class="slash">/</div>
      <input
        data-test="pattern-input"
        class="input"
        type="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        .value=${live(this.value)}
        @input=${this._onChange}
        placeholder="Enter RegEx pattern..."
      />
      <div class="slash">/</div>
      <div class="flags">
        <div>
          <input
            data-test="case-insensitive"
            id="case-insensitive"
            class="checkbox"
            type="checkbox"
            .checked=${live(this.flag === 'i')}
            @click=${() => this._onCheckboxClick('i')}
          /><label for="case-insensitive">i</label>
        </div>
        <div>
          <input
            data-test="unicode"
            id="unicode"
            class="checkbox"
            type="checkbox"
            .checked=${live(this.flag === 'u')}
            @click=${() => this._onCheckboxClick('u')}
          /><label for="unicode">u</label>
        </div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-input': Input;
  }
}
