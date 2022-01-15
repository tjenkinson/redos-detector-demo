import { LitElement, css, html, PropertyDeclaration } from 'lit';
import { customElement } from 'lit/decorators';
import { borderBox, host } from '../css';
import { toNBSP } from '../html';

@customElement('my-pattern')
export class Pattern extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {
    highlightA: { type: Array },
    highlightB: { type: Array },
    included: { type: Array },
    pattern: { type: String },
  };

  public highlightA: number[] = [];
  public highlightB: number[] = [];
  public included: number[] = [];
  public pattern = '';

  static styles = [
    borderBox,
    host,
    css`
      .character {
        font-family: monospace;
        display: inline-block;
        font-size: 1.5rem;
        border-bottom-color: transparent;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        color: #808080;
        transition: border-bottom-color 0.2s;
        background-color: var(--source-color);
      }

      .included {
        color: #000000;
      }

      .highlight-a {
        border-bottom-color: var(--a-side-color);
      }

      .highlight-b {
        border-bottom-color: var(--b-side-color);
      }
    `,
  ];

  render() {
    return html`<div>
      ${this.pattern.split('').map((character, i) => {
        const classes = [
          'character',
          this.included.includes(i) && 'included',
          this.highlightA.includes(i) && 'highlight-a',
          this.highlightB.includes(i) && 'highlight-b',
        ]
          .filter(Boolean)
          .join(' ');
        return html`<span class="${classes}">${toNBSP(character)}</span>`;
      })}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-pattern': Pattern;
  }
}
