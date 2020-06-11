import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dropdown/dropdown.js';
import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
import '../toolbar/button.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

// TODO: add keyboard support and announce
// TODO: add row x column footer
// TODO: localize, RTL

class TableButton extends LitElement {

	static get properties() {
		return {
			_selectedColumns: { type: Number },
			_selectedRows: { type: Number }
		};
	}

	static get styles() {
		return css`
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
				border: 1px solid var(--d2l-color-ferrite);
				border-left-color: transparent;
				border-top-color: transparent;
				box-sizing: border-box;
				display: inline-block;
				height: 24px;
				margin-left: -1px;
				width: 24px;
			}
			.d2l-htmleditor-table-size-row:first-child {
				margin-top: 0;
			}
			.d2l-htmleditor-table-size-row:first-child > div {
				border-top-color: var(--d2l-color-ferrite);
			}
			.d2l-htmleditor-table-size-row > div:first-child {
				margin-left: 0;
				border-left-color: var(--d2l-color-ferrite);
			}
			.d2l-htmleditor-table-size-row > div[data-selected] {
				background-color: var(--d2l-color-celestine-plus-2);
				border-color: var(--d2l-color-celestine);
			}
		`;
	}

	constructor() {
		super();
		this._selectedColumns = 0;
		this._selectedRows = 0;
	}

	render() {

		const renderCells = (rowIndex) => {
			const cells = [];
			for (let columnIndex = 0; columnIndex < 10; columnIndex++) {
				cells.push(html`<div @click="${this._handleClick}" @mouseenter="${this._handleMouseEnter}" data-row="${rowIndex}" data-column="${columnIndex}" ?data-selected="${rowIndex < this._selectedRows && columnIndex < this._selectedColumns}"></div>`);
			}
			return cells;
		};

		const rows = [];
		for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
			rows.push(html`<div class="d2l-htmleditor-table-size-row">${renderCells(rowIndex)}</div>`);
		}

		return html`
			<d2l-dropdown>
				<d2l-htmleditor-button class="d2l-dropdown-opener" text="Insert Table"></d2l-htmleditor-button>
				<d2l-dropdown-content @d2l-dropdown-open="${this._handleDropdownOpen}">
					${rows}
				</d2l-dropdown-content>
			</d2l-dropdown>
		`;
	}

	async _handleClick() {
		const editor = await this.getRootNode().host.getEditor();
		this.shadowRoot.querySelector('d2l-dropdown-content').close();
		const html = `<table><tbody>\n${`<tr>${'<td></td>'.repeat(this._selectedColumns)}</tr>\n`.repeat(this._selectedRows)}</tbody></table>`;
		editor.execCommand('mceInsertContent', false, html);
	}

	_handleDropdownOpen() {
		this._selectedRows = 0;
		this._selectedColumns = 0;
	}

	_handleMouseEnter(e) {
		this._selectedRows = Number.parseInt(e.target.getAttribute('data-row'), 10) + 1;
		this._selectedColumns = Number.parseInt(e.target.getAttribute('data-column'), 10) + 1;
	}

}

customElements.define('d2l-htmleditor-button-table', TableButton);
