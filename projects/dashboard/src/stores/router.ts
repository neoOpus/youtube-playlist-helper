import { writable, derived } from "svelte/store";

function createRouter() {
    const hash = writable(window.location.hash || "#/");

    window.addEventListener("hashchange", () => {
        hash.set(window.location.hash || "#/");
    });

    const route = derived(hash, ($hash) => {
        const path = $hash.slice(1) || "/";
        const parts = path.split("/");

        // Simple regex-like param extraction
        let params: Record<string, string> = {};
        let activePath = path;

        if (path.startsWith("/edit/")) {
            params.id = parts[2];
            activePath = "/edit/:id";
        }

        return { path: activePath, fullPath: path, params };
    });

    return {
        subscribe: route.subscribe,
        push: (path: string) => {
            window.location.hash = path.startsWith("/") ? path : `/${path}`;
        }
    };
}

export const router = createRouter();
