import { css, html, LitElement } from 'lit-element/lit-element.js';

export function registerButtonToggle(editor, key, {action, command = key, active, enabled} = {}) {
	const elem = editor.getElement().getRootNode().querySelector(`[data-key="${key}"]`);
	if (!elem) return;
	if (action) elem.addEventListener('click', () => action());
	else if (command) elem.addEventListener('click', () => editor.execCommand(command));
	editor.on('NodeChange', () => {
		if (active) elem.active = active();
		else elem.active = !!editor.queryCommandState(command);
		if (enabled) elem.disabled = !enabled();
	});
}

class ButtonToggle extends LitElement {

	static get properties() {
		return {
			active: { type: Boolean },
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

	render() {
		return html`<button ?disabled="${this.disabled}">${this.text} ${this.active}</button>`;
	}

}

customElements.define('d2l-htmleditor-button-toggle', ButtonToggle);
