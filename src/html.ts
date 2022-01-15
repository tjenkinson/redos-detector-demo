import { unsafeHTML } from 'lit/directives/unsafe-html';
import { html, TemplateResult } from 'lit';

export function toNBSP(input: string): TemplateResult {
  return html`${input.split('').map((character) => {
    return character === ' ' ? unsafeHTML('&nbsp') : character;
  })}`;
}

export function toBr(input: string): TemplateResult {
  return html`${input.split('').map((character) => {
    return character === '\n' ? unsafeHTML('<br />') : character;
  })}`;
}
