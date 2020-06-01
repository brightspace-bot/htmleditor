import { css, html, LitElement } from 'lit-element/lit-element.js';

export function registerButton(editor, key, {action, command = key, enabled} = {}) {
	const elem = editor.getElement().getRootNode().querySelector(`[data-key="${key}"]`);
	if (!elem) return;
	if (action) elem.addEventListener('click', () => action());
	else if (command) elem.addEventListener('click', () => editor.execCommand(command));
	if (enabled) {
		editor.on('NodeChange', () => {
			elem.disabled = !enabled();
		});
	}
}

class Button extends LitElement {

	static get properties() {
		return {
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

	render() {
		return html`<button ?disabled="${this.disabled}">${this.text}</button>`;
	}

}

customElements.define('d2l-htmleditor-button', Button);
