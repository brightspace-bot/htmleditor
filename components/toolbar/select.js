import { css, html, LitElement } from 'lit-element/lit-element.js';

class Select extends LitElement {

	static get properties() {
		return {
			cmd: { type: String },
			options: { type: Array },
			text: { type: String },
			value: { type: String }
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
		`;
	}

	constructor() {
		super();
		this.options = {};
		this.value = '';
	}

	async firstUpdated() {
		super.firstUpdated();
		if (!this.cmd) return;
		const editor = await this.getRootNode().host.getEditor();
		editor.on('NodeChange', () => {
			this.value = editor.queryCommandValue(this.cmd);
		});
	}

	render() {
		const value = (this.options.findIndex((o) => o.value === this.value) > -1)
			? this.value : (this.options.length > 0 ? this.options[0].value : '');
		return html`<select aria-label="${this.text}" title="${this.text}" @change="${this._handleChange}" .value="${value}">
			${this.options.map((o) => html`<option value="${o.value}">${o.text}</option>`)}
		</select>`;
	}

	async _handleChange(e) {
		this.value = e.target.value;
		this.dispatchEvent(new CustomEvent('change', {bubbles: true}));
		if (!this.cmd) return;
		const editor = await this.getRootNode().host.getEditor();
		editor.execCommand(this.cmd, false, e.target.value);
	}

}

customElements.define('d2l-htmleditor-select', Select);
