import { mount } from 'svelte';
import { initCore } from '@yph/core';
import './stores/theme.store.js';
import App from './App.svelte';

// Initialize Core Services
initCore();

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
