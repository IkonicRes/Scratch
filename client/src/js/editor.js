import { getDb, putDb } from './database';
import { header } from './header';

export default class Editor {
  constructor() {
    this.initializeEditor();
    this.loadContent();
    this.setupEventListeners();
  }

  initializeEditor() {
    if (typeof CodeMirror === 'undefined') {
      console.error('CodeMirror is not loaded');
      return;
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });
  }

  loadContent() {
    getDb().then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      const content = data || localStorage.getItem('content') || header;
      this.editor.setValue(content);
    });
  }

  setupEventListeners() {
    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      const content = this.editor.getValue();
      putDb(content); // Store the content in IndexedDB
    });
  }
}
