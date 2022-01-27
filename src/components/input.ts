import { LitElement, css, html, PropertyDeclaration } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref';
import { borderBox, host } from '../css';

@customElement('my-input')
export class Input extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {
    value: { type: String },
    unicode: { type: Boolean },
  };

  private _inputRef: Ref<HTMLInputElement> = createRef();
  private _checkboxRef: Ref<HTMLInputElement> = createRef();

  value = '';
  unicode = false;

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
      .unicode,
      .input {
        font-size: 1.5rem;
        font-family: Arial;
      }

      .unicode .checkbox {
        margin-right: 0.4em;
        width: 1rem;
        height: 1rem;
      }
    `,
  ];

  private _onChange = () => {
    this.value = this._inputRef.value!.value;
    this.unicode = this._checkboxRef.value!.checked;
    const event = new CustomEvent('my-change', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  };

  render() {
    return html`<div class="container">
    <div class="slash">/</div>
      <input
        ${ref(this._inputRef)}
        class="input"
        type="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        .value=${this.value}
        @input=${this._onChange}
        placeholder="Enter RegEx pattern..."
      />
      <div class="slash">/</div>
        <div class="unicode">
          <input
            ${ref(this._checkboxRef)}
            id="unicode"
            class="checkbox"
            type="checkbox"
            ?checked=${this.unicode}
            @input=${this._onChange}
          /><label for="unicode">Unicode</label>
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
