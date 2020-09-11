import '../htmleditor.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-htmleditor', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-htmleditor></d2l-htmleditor>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-htmleditor');
		});
	});

});
