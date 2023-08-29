import { LitElement, html, PropertyDeclaration, css } from 'lit';
import { customElement } from 'lit/decorators';
import { createRef, ref, Ref } from 'lit/directives/ref';
import { borderBox, footerReset, host } from '../css';
import { Input } from './input';
import './input';
import './pattern';
import './result';
import './redos-error';
import './redos-safe';
import './redos-unsafe';
import './error';
import './loading';
import './title';
import './version';
import './description';
import './gh-link';
import './more-results-msg';
import { Result as ResultEl } from './result';
import { setsEqual } from '../set';
import { aborted, calculate, CalculateHandle } from '../calculate';
import { ResultOrError } from '../calculate-worker';
import { BacktrackCount } from 'redos-detector';

type ResultErrorLoading = ResultOrError | { type: 'loading' };

const resultsLimit = 20;

function backtrackCountToNumber(backtrackCount: BacktrackCount): number {
  return backtrackCount.infinite ? Infinity : backtrackCount.value;
}

@customElement('my-root')
export class Root extends LitElement {
  static properties: Record<string, PropertyDeclaration> = {
    pattern: { type: String, noAccessor: true },
    unicode: { type: Boolean, noAccessor: true },
    _highlightA: { state: true },
    _highlightB: { state: true },
    _included: { state: true },
    _result: { state: true },
    _version: { state: true },
  };

  static styles = [
    borderBox,
    host,
    footerReset,
    css`
      :host {
        --source-color: #f0f0f0;
        --a-side-color: #ff0000;
        --b-side-color: #ffa000;
        --font-family: Arial;
      }

      .root {
        min-height: 100%;
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
      }

      .body {
        flex-grow: 1;
      }

      .footer {
        flex-shrink: 0;
        text-align: right;
      }

      .version {
        display: inline-block;
      }

      .header {
        position: sticky;
        background-color: #ffffff;
        top: 0;
        z-index: 1;
        margin-bottom: 1rem;
      }

      .header .fade {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        height: 1rem;
        background-image: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 1) 10%,
          rgba(255, 255, 255, 0) 100%
        );
      }

      .heading {
        display: flex;
        gap: 0.8em;
        flex-wrap: wrap;
        justify-content: center;
      }

      .description,
      .pattern,
      .messages,
      .input {
        margin-top: 0.4rem;
      }

      .loading {
        padding-top: 0.5rem;
      }

      .pattern,
      .results {
        text-align: center;
      }

      .results {
        margin-top: -1rem;
      }

      .result {
        display: inline-block;
        margin: 1rem;
        text-align: center;
        vertical-align: top;
      }
    `,
  ];

  private _calculateHandle: CalculateHandle | null;
  private _version: string | null;
  private _highlightA: Set<number>;
  private _highlightB: Set<number>;
  private _result: ResultErrorLoading;
  private _inputRef: Ref<Input> = createRef();

  private _pattern: string | null = null;
  get pattern(): string {
    return this._pattern || '';
  }
  set pattern(value: string) {
    const old = this._pattern;
    if (old === value) return;

    this._pattern = value;

    this._runCalculation();

    this.requestUpdate('pattern', old);
    if (old !== null) this._dispatchChange();
  }

  private _unicode: boolean | null = null;
  get unicode(): boolean {
    return !!this._unicode;
  }
  set unicode(value: boolean) {
    const old = this._unicode;
    if (old === value) return;

    this._unicode = value;

    this._runCalculation();

    this.requestUpdate('unicode', old);
    if (old !== null) this._dispatchChange();
  }

  constructor() {
    super();
    this._calculateHandle = null;
    this._version = null;
    this._highlightA = new Set();
    this._highlightB = new Set();
    this._result = {
      type: 'loading',
    };
  }

  private _dispatchChange(): void {
    const event = new CustomEvent('my-change', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _runCalculation(): void {
    this._result = {
      type: 'loading',
    };

    this._calculateHandle?.abort();
    this._calculateHandle = calculate(this.pattern, this.unicode);
    this._calculateHandle.result
      .then(async (result) => {
        this._result = result;
      })
      .catch((e) => {
        if (e === aborted) return;
        throw e;
      });
  }

  connectedCallback(): void {
    super.connectedCallback();
    import('../redos-detector-version').then(({ version }) => {
      this._version = version;
    });
  }

  private _onPatternChange(): void {
    this.pattern = this._inputRef.value!.value;
    this.unicode = this._inputRef.value!.unicode;
  }

  private _onSelectionChange(): void {
    this._updateHighlighted();
  }

  private _updateHighlighted() {
    const els = this.shadowRoot!.querySelectorAll<ResultEl>('my-result');
    const highlightA: Set<number> = new Set();
    const highlightB: Set<number> = new Set();
    els.forEach((el) => {
      el.highlightedA.forEach((offset) => highlightA.add(offset));
      el.highlightedB.forEach((offset) => highlightB.add(offset));
    });
    if (!setsEqual(this._highlightA, highlightA)) {
      this._highlightA = highlightA;
    }
    if (!setsEqual(this._highlightB, highlightB)) {
      this._highlightB = highlightB;
    }
  }

  updated() {
    this._updateHighlighted();
  }

  render() {
    const result: ResultErrorLoading | null =
      this._result?.type === 'result' ? this._result : null;
    const errorMessage: string | null =
      this._result?.type === 'error' ? this._result.message : null;
    return html`
      <div class="root">
        <div class="body">
          <div class="heading">
            <my-title class="title"></my-title>
            <my-gh-link class="link"></my-gh-link>
          </div>
          <my-description class="description"></my-description>
          <my-input
            class="input"
            data-nosnippet
            ${ref(this._inputRef)}
            .value=${this.pattern}
            .unicode=${this.unicode}
            @my-change=${this._onPatternChange}
          ></my-input>

          <div class="header">
            <div class="fade"></div>
            <div class="messages">
              ${this._result.type === 'loading'
                ? html`<div class="loading">
                    <my-loading></my-loading>
                  </div>`
                : ''}
              ${result?.result.safe
                ? html`<div>
                    <my-redos-safe
                      .backtrackCount=${backtrackCountToNumber(
                        result.result.worstCaseBacktrackCount,
                      )}
                    ></my-redos-safe>
                  </div>`
                : ''}
              ${result && !result.result.safe
                ? html`
                    <div>
                      <my-redos-unsafe
                        .maybe=${result.result.trails.length === 0}
                        .backtrackCount=${backtrackCountToNumber(
                          result.result.worstCaseBacktrackCount,
                        )}
                      ></my-redos-unsafe>
                    </div>
                  `
                : ''}
              ${result?.result.error
                ? html`<div>
                    <my-redos-error
                      .error="${result.result.error}"
                    ></my-redos-error>
                  </div>`
                : ''}
              ${errorMessage
                ? html`<div>
                    <my-error .message=${errorMessage}></my-error>
                  </div>`
                : ''}
            </div>
            ${result && result.result.trails.length
              ? html`
                  <div class="pattern">
                    <my-pattern
                      .pattern=${result.result.pattern}
                      .highlightA=${[...this._highlightA]}
                      .highlightB=${[...this._highlightB]}
                      .included=${[...result.included]}
                    ></my-pattern>
                  </div>
                `
              : ''}
          </div>
          ${result?.result.trails.length
            ? html`
                <div class="results">
                  ${result.result.trails.slice(0, resultsLimit).map(
                    (trail) =>
                      html`<div class="result">
                        <my-result
                          .trail=${trail}
                          @my-result-change=${this._onSelectionChange}
                        ></my-result>
                      </div>`,
                  )}
                </div>
              `
            : ''}
          ${result && result.result.trails.length > resultsLimit
            ? html`<my-more-results-msg></my-more-results-msg>`
            : ''}
        </div>
        <footer class="footer">
          <div class="version">
            <my-version version="${this._version || ''}"></my-version>
          </div>
        </footer>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-root': Root;
  }
}
