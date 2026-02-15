import { mount } from 'svelte';
import './stores/theme.store.js'; // Ensure theme is initialized
import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
