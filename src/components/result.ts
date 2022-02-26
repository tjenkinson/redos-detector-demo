import {
  RedosDetectorTrail,
  RedosDetectorTrailEntrySide,
} from 'redos-detector';
import { LitElement, css, html, PropertyDeclaration } from 'lit';
import { customElement } from 'lit/decorators';
import { borderBox, host, tableReset } from '../css';
import { toNBSP } from '../html';
import { sequence } from '../sequence';
import { setsEqual } from '../set';

@customElement('my-result')
export class Result extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {
    trail: { type: Object },
  };

  static styles = [
    borderBox,
    host,
    tableReset,
    css`
      .table {
        font-family: var(--font-family);
        text-align: center;
        font-size: 1rem;
        color: #000000;
      }

      .table th {
        font-weight: bold;
      }

      .table td,
      .table th {
        border: 1px solid #999;
        padding: 0.5rem;
        vertical-align: middle;
        position: relative;
      }

      .table td {
        font-family: monospace;
      }

      .table tr {
        background-color: #ffffff;

        transition: background-color 0.2s;
      }

      .table .result-row {
        cursor: default;
      }

      .table .result-row:hover {
        background-color: #ddddff;
      }

      .source {
        background-color: var(--source-color);
      }

      .table .option-1,
      .table .option-2 {
        border-bottom-width: 2px;
      }

      .table .option-1 {
        border-bottom-color: var(--a-side-color);
      }

      .table .option-2 {
        border-bottom-color: var(--b-side-color);
      }
    `,
  ];

  public trail!: RedosDetectorTrail;
  public highlightedA: Set<number> = new Set();
  public highlightedB: Set<number> = new Set();

  updated() {
    this._updateOffsets();
  }

  private _updateOffsets(): void {
    const el = this.shadowRoot!.querySelector<HTMLTableRowElement>(
      'tr.result-row:hover'
    );
    let aOffsets: Set<number> = new Set();
    let bOffsets: Set<number> = new Set();
    if (el) {
      const index = parseInt(el.dataset.index!, 10);
      const entry = this.trail.trail[index];

      const getOffsets = (
        entrySide: RedosDetectorTrailEntrySide
      ): Set<number> => {
        const sideOffsets: Set<number> = new Set();
        sequence(
          entrySide.node.start.offset,
          entrySide.node.end.offset
        ).forEach((offset) => sideOffsets.add(offset));
        entrySide.backreferenceStack.forEach((backreference) => {
          sequence(
            backreference.node.start.offset,
            backreference.node.end.offset
          ).forEach((offset) => sideOffsets.add(offset));
        });
        return sideOffsets;
      };
      aOffsets = getOffsets(entry.a);
      bOffsets = getOffsets(entry.b);
    }

    if (
      setsEqual(this.highlightedA, aOffsets) &&
      setsEqual(this.highlightedB, bOffsets)
    ) {
      return;
    }

    this.highlightedA = aOffsets;
    this.highlightedB = bOffsets;

    const event = new CustomEvent('my-result-change', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`<div>
      <table class="table">
        <tbody>
          <tr>
            <th colspan="2" class="option-1">Option 1</th>
            <th colspan="2" class="option-2">Option 2</th>
          </tr>
          <tr>
            <th>Offset</th>
            <th>Character</th>
            <th>Character</th>
            <th>Offset</th>
          </tr>

          ${this.trail.trail.map((entry, i) => {
            return html`
              <tr
                class="result-row"
                data-index=${i}
                @mouseenter=${this._updateOffsets}
                @mouseleave=${this._updateOffsets}
              >
                <td>${entry.a.node.start.offset}</td>
                <td>
                  <span class="source">${toNBSP(entry.a.node.source)}</span>
                </td>
                <td>
                  <span class="source">${toNBSP(entry.b.node.source)}</span>
                </td>
                <td>${entry.b.node.start.offset}</td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-result': Result;
  }
}
