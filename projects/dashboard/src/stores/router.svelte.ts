interface RouteState {
    path: string;
    fullPath: string;
    params: Record<string, string>;
}

function createRouter() {
    let hash = $state(window.location.hash || "#/");

    window.addEventListener("hashchange", () => {
        hash = window.location.hash || "#/";
    });

    const route = $derived.by<RouteState>(() => {
        const path = hash.slice(1) || "/";
        const parts = path.split("/");
        let params: Record<string, string> = {};
        let activePath = path;

        if (path.startsWith("/edit/")) {
            params.id = parts[2];
            activePath = "/edit/:id";
        }

        return { path: activePath, fullPath: path, params };
    });

    return {
        get path() { return route.path; },
        get fullPath() { return route.fullPath; },
        get params() { return route.params; },
        push: (path: string) => {
            window.location.hash = path.startsWith("/") ? path : `/${path}`;
        }
    };
}

export const router = createRouter();
