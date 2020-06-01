import { css, html, LitElement } from 'lit-element/lit-element.js';

export function registerSelect(editor, key, {command = key} = {}) {
	const elem = editor.getElement().getRootNode().querySelector(`[data-key="${key}"]`);
	if (!elem) return;
	elem.addEventListener('change', (e) => editor.execCommand(command, false, e.target.value));
	editor.on('NodeChange', () => {
		elem.value = editor.queryCommandValue(command);
	});
}

class Select extends LitElement {

	static get properties() {
		return {
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

	render() {
		const value = (this.options.findIndex((o) => o.value === this.value) > -1)
			? this.value : (this.options.length > 0 ? this.options[0].value : '');
		return html`<select aria-label="${this.text}" title="${this.text}" @change="${this._handleChange}" .value="${value}">
			${this.options.map((o) => html`<option value="${o.value}">${o.text}</option>`)}
		</select>`;
		//return html`<select title="${this.text}" @change="${this._handleChange}" .value="${value}"></select><slot></slot>`;
	}

	_handleChange(e) {
		this.value = e.target.value;
		this.dispatchEvent(new CustomEvent('change', {bubbles: true}));
	}

}

customElements.define('d2l-htmleditor-select', Select);
