import 'tinymce/tinymce.js';
import { css, LitElement } from 'lit-element/lit-element.js';
import { getComposedActiveElement } from '@brightspace-ui/core/helpers/focus.js';
import { icons } from '../icons.js';
import { RequesterMixin } from '@brightspace-ui/core/mixins/provider-mixin.js';

// TODO: localize the tooltip

tinymce.PluginManager.add('d2l-quicklink', function(editor) {

	// bail if no LMS context
	if (!D2L.LP) return;

	editor.ui.registry.addIcon('d2l-quicklink', icons['link']);

	editor.ui.registry.addButton('d2l-quicklink', {
		tooltip: 'Insert QuickLink',
		icon: 'd2l-quicklink',
		onAction: () => {
			const root = editor.getElement().getRootNode();

			let dialog = root.querySelector('d2l-htmleditor-quicklink-dialog');
			if (!dialog) dialog = root.appendChild(document.createElement('d2l-htmleditor-quicklink-dialog'));

			const contextNode = (editor.selection ? editor.selection.getNode() : null);

			if (contextNode && contextNode.tagName === 'A') {
				dialog.quicklink = {
					href: contextNode.getAttribute('href'),
					target: contextNode.getAttribute('target'),
					text: contextNode.innerText
				};
			} else {
				dialog.text = tinymce.DOM.decode(editor.selection.getContent());
			}

			dialog.opened = true;
			dialog.addEventListener('d2l-htmleditor-quicklink-dialog-close', (e) => {
				const html = e.detail.html;
				if (html) {
					if (contextNode && contextNode.tagName === 'A') {
						// expand selection if necessary to replace current link
						editor.selection.select(contextNode);
					}
					editor.execCommand('mceInsertContent', false, html);
				}
			}, { once: true });

		}
	});

});

class QuicklinkDialog extends RequesterMixin(LitElement) {

	static get properties() {
		return {
			opened: { type: Boolean, reflect: true },
			quicklink: { type: Object },
			text: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.opened = false;
		this.text = '';
	}

	connectedCallback() {
		super.connectedCallback();
		this._orgUnitId = this.requestInstance('orgUnitId');
	}

	render() {
	}

	async updated(changedProperties) {
		super.updated(changedProperties);

		if (!changedProperties.has('opened')) return;

		if (this.opened) {
			const result = await (new Promise((resolve) => {

				let selectUrl = new D2L.LP.Web.Http.UrlLocation(`/d2l/lp/quicklinks/manage/${this._orgUnitId}/createdialog
					?typeKey=
					&initialViewType=Default
					&outputFormat=html
					&selectedText=${this.text}
					&parentModuleId=0
					&canChangeType=true
					&showCancelButton=true
					&urlShowTarget=true
					&urlShowCancelButtonInline=false
					&contextId=
				`);

				if (this.quicklink) selectUrl = selectUrl.WithQueryString(
					'itemData',
					new D2L.LP.QuickLinks.Web.Desktop.Controls.QuickLinkSelector.ItemData(
						'',
						null,
						this.quicklink.href,
						this.quicklink.text,
						[{ name: 'target', value: (this.quicklink.target === '_top' ? 'WholeWindow' : (this.quicklink.target === '_blank' ? 'NewWindow' : 'SameFrame')) }],
						'html'
					)
				);

				const selectResult = D2L.LP.Web.UI.Desktop.MasterPages.Dialog.Open(
					getComposedActiveElement(),
					selectUrl
				);

				selectResult.AddReleaseListener(resolve);
				selectResult.AddListener(quicklinks => {

					if (!quicklinks || quicklinks.length === 0) {
						resolve();
						return;
					}

					const createResult = D2L.LP.Web.UI.Rpc.ConnectObject(
						'POST',
						new D2L.LP.Web.Http.UrlLocation(`/d2l/lp/quicklinks/manage/${this._orgUnitId}/createmultiple`),
						{ 'items': quicklinks }
					);

					createResult.AddReleaseListener(resolve);
					createResult.AddListener(quicklinks => {

						if (!quicklinks || quicklinks.length === 0) {
							resolve();
							return;
						}

						resolve(quicklinks.reduce((acc, cur) => {
							return acc += cur.html;
						}, ''));

					});
				});

			}));

			this.opened = false;

			this.dispatchEvent(new CustomEvent(
				'd2l-htmleditor-quicklink-dialog-close', {
					bubbles: true,
					detail: { html: result }
				}
			));

		}

	}

}
customElements.define('d2l-htmleditor-quicklink-dialog', QuicklinkDialog);
