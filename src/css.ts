import { css } from 'lit';

export const borderBox = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

export const host = css`
  :host {
    display: block;
  }
`;

export const tableReset = css`
  table,
  tbody,
  th,
  tr,
  td {
    all: unset;
  }

  table {
    display: table;
    border-collapse: collapse;
  }

  tbody {
    display: table-row-group;
  }

  tr {
    display: table-row;
  }

  th,
  td {
    display: table-cell;
  }
`;

export const pReset = css`
  p {
    all: unset;
    display: block;
  }
`;

export const h1Reset = css`
  h1 {
    all: unset;
    display: block;
  }
`;

export const aReset = css`
  a {
    all: unset;
    cursor: pointer;
  }
`;

export const footerReset = css`
  footer {
    all: unset;
    display: block;
  }
`;
