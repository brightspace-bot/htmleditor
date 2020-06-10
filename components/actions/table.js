import '@brightspace-ui/core/components/colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

// TODO: add keyboard support and announce
// TODO: add row x column footer

class TableSizeSelector extends LitElement {

	static get properties() {
		return {
			selectedColumns: { type: Number },
			selectedRows: { type: Number }
		};
	}

	static get styles() {
		return [css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-htmleditor-table-size-row {
				line-height: 0;
				margin-top: -1px;
			}
			.d2l-htmleditor-table-size-row > div {
				border: 1px solid black;
				border-left-color: transparent;
				border-top-color: transparent;
				box-sizing: border-box;
				display: inline-block;
				height: 30px;
				margin-left: -1px;
				width: 30px;
			}
			.d2l-htmleditor-table-size-row:first-child {
				margin-top: 0;
			}
			.d2l-htmleditor-table-size-row:first-child > div {
				border-top-color: black;
			}
			.d2l-htmleditor-table-size-row > div:first-child {
				margin-left: 0;
				border-left-color: black;
			}
			.d2l-htmleditor-table-size-row > div[data-selected] {
				background-color: var(--d2l-color-celestine-plus-2);
				border-color: var(--d2l-color-celestine);
			}
		`];
	}

	constructor() {
		super();
		this.selectedColumns = 0;
		this.selectedRows = 0;
	}

	render() {
		const renderCells = (rowIndex) => {
			const cells = [];
			for (let columnIndex = 0; columnIndex < 10; columnIndex++) {
				cells.push(html`<div @click="${this._handleClick}" @mouseenter="${this._handleMouseEnter}" data-row="${rowIndex}" data-column="${columnIndex}" ?data-selected="${rowIndex < this.selectedRows && columnIndex < this.selectedColumns}"></div>`);
			}
			return cells;
		};

		const rows = [];
		for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
			rows.push(html`<div class="d2l-htmleditor-table-size-row">${renderCells(rowIndex)}</div>`);
		}
		return rows;
	}

	_handleClick() {
		this.dispatchEvent(new CustomEvent(
			'd2l-htmleditor-table-size-selected', {
				bubbles: true,
				detail: { rows: this.selectedRows, columns: this.selectedColumns }
			}
		));
	}

	_handleMouseEnter(e) {
		this.selectedRows = Number.parseInt(e.target.getAttribute('data-row'), 10) + 1;
		this.selectedColumns = Number.parseInt(e.target.getAttribute('data-column'), 10) + 1;
	}

}

customElements.define('d2l-htmleditor-table-size-selector', TableSizeSelector);
