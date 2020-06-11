import { css, html, LitElement } from 'lit-element/lit-element.js';

class Button extends LitElement {

	static get properties() {
		return {
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

	async firstUpdated() {
		super.firstUpdated();
		if (!this.cmd) return;
		if (this.cmd !== 'undo' && this.cmd !== 'redo') return;
		const editor = await this.getRootNode().host.getEditor();
		editor.on('NodeChange', () => {
			if (this.cmd === 'undo') this.disabled = !editor.undoManager.hasUndo();
			else if (this.cmd === 'redo') this.disabled = !editor.undoManager.hasRedo();
		});
	}

	render() {
		return html`<button @click="${this._handleClick}" ?disabled="${this.disabled}">${this.text}</button>`;
	}

	async _handleClick() {
		if (!this.cmd) return;
		const editor = await this.getRootNode().host.getEditor();
		editor.execCommand(this.cmd);
	}

}

customElements.define('d2l-htmleditor-button', Button);
