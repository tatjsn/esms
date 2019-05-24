import { LitElement, html } from 'lit-element';

function tooSimpleShallowEqual(a, b) {
  return a.reduce((prev, curr, i) => prev && (curr === b[i]), true);
}

export default function connect(tagName, mapper) {
  function getKeys() {
    return Object.keys(mapper);
  }
  function getValues(state) {
    return Object.values(mapper).map(sel => sel(state));
  }
  return class extends LitElement {
    connectedCallback() {
      super.connectedCallback();
      // Find store provider
      let curr = this.parentNode;
      while(curr !== document) {
        if (curr.store) {
          this.store = curr.store;
        }
        curr = curr.parentNode;
      }
      if (this.store) {
        const state = this.store.getState();
        this.prevValues = getValues(state);
        this.unsubscribe = this.store.subscribe(() => {
          const values = getValues(this.store.getState());
          const isEqual = tooSimpleShallowEqual(this.prevValues, values);
          this.prevValues = values;
          if (!isEqual) this.requestUpdate();
        });
      }
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }
    render() {
      if (!this.store) {
        return html`<div>No store!</div>`;
      }
      const state = this.store.getState();
      const [key, ...keys] = getKeys();
      const values = getValues(state);
      return html([`<${tagName} ${key}=`, ...keys.map(k => ` ${k}=`), `></${tagName}>`], ...values);
    }
  }
}
