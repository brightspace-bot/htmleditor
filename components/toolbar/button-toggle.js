import { css, html, LitElement } from 'lit-element/lit-element.js';

class ButtonToggle extends LitElement {

	static get properties() {
		return {
			active: { type: Boolean },
			cmd: { type: String },
			disabled: { type: Boolean },
			text: { type: String }
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
		this._active = false;
	}

	async firstUpdated() {
		super.firstUpdated();
		if (!this.cmd) return;
		const editor = await this.getRootNode().host.getEditor();
		editor.on('NodeChange', () => {
			this.active = !!editor.queryCommandState(this.cmd);
		});
	}

	render() {
		return html`<button @click="${this._handleClick}" ?disabled="${this.disabled}">${this.text} ${this.active}</button>`;
	}

	async _handleClick() {
		if (!this.cmd) return;
		const editor = await this.getRootNode().host.getEditor();
		editor.execCommand(this.cmd);
	}

}

customElements.define('d2l-htmleditor-button-toggle', ButtonToggle);
