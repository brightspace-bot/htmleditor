import '../toolbar/button.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

// TODO: localize
// TODO: decide whether we use tinymce's dialog or consumer report in our own dialog
// TODO: skin tinymce accessibility checker dialog

class A11yButton extends LitElement {

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
		return html`<d2l-htmleditor-button @click="${this._handleClick}" text="Accessibility"></d2l-htmleditor-button>`;
	}

	async _handleClick() {
		const editor = await this.getRootNode().host.getEditor();
		editor.plugins.a11ychecker.toggleaudit();
		//console.log(editor.plugins.a11ychecker.getReport());
	}

}

customElements.define('d2l-htmleditor-button-a11y', A11yButton);
