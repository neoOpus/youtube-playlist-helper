import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { notificationService } from "@yph/core";
import { Notyf } from "notyf";

// Initialize Pro Notification System
if (typeof document !== 'undefined') {
    const notyf = new Notyf({
        duration: 5000,
        dismissible: true,
        types: [
            {
                type: 'info',
                background: '#007bff',
                icon: false
            }
        ]
    });

    notificationService.setProvider({
        error: (msg) => notyf.error(msg),
        success: (msg) => notyf.success(msg),
        info: (msg) => notyf.open({ type: 'info', message: msg })
    });
}

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
