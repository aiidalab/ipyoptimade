import { SelectionView, SelectionModel } from 'https://cdn.jsdelivr.net/npm/@jupyter-widgets/controls@5.0.8/+esm'

class ExtendedDropdownModel extends SelectionModel {
  /** @return {Backbone.ObjectHash} */
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'DropdownModel',
      _view_name: 'DropdownView',
      button_style: '',
    };
  }
}

class ExtendedDropdownView extends SelectionView {
    /**
     * Update the contents of this view
     */
    /** @param {{options?: { updated_view?: DropdownView }}} */
    /** @return {void} */
    update(options){
      // Debounce set calls from ourselves:
      if (options?.updated_view !== this) {
        const optsChanged = this.model.hasChanged('_options_labels');
        if (optsChanged) {
          // Need to update options:
          this._updateOptions();
        }
      }
      // Select the correct element
      const index = this.model.get('index');
      this.listbox.selectedIndex = index === null ? -1 : index;
      return super.update();
    }

    /** @return {void} */
    _updateOptions() {
      this.listbox.textContent = '';
      const items = this.model.get('_options_labels');
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const option = document.createElement('option');
        option.textContent = item.replace(/ /g, '\xa0'); // space -> &nbsp;
        option.setAttribute('data-value', encodeURIComponent(item));
        option.value = item;
        this.listbox.appendChild(option);
      }
    }

    /** @return {{ [key: string]: string }} */
    events() {
      return {
        'change select': '_handle_change',
      };
    }

    /**
     * Handle when a new value is selected.
     */
    /** @return {void} */
    _handle_change() {
      this.model.set(
        'index',
        this.listbox.selectedIndex === -1 ? null : this.listbox.selectedIndex,
        { updated_view: this }
      );
      this.touch();
    }

    /**
     * Handle message sent to the front end.
     */
    /** @param {any} p1 */
    /** @return {void} */
    handle_message(content) {
      if (content.do === 'focus') {
        this.listbox.focus();
      } else if (content.do === 'blur') {
        this.listbox.blur();
      }
    }
}

/** @param {{ model: DOMWidgetModel, el: HTMLElement }} context */
function render({ model, el }) {

}

export default { render }