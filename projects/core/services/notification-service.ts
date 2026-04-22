export interface NotificationProvider {
    error: (message: string) => void;
    success: (message: string) => void;
    info: (message: string) => void;
}

let provider: NotificationProvider | null = null;

export const notificationService = {
    setProvider(p: NotificationProvider) {
        provider = p;
    },
    error(message: string) {
        if (provider) {
            provider.error(message);
        } else {
            console.error("Error:", message);
        }
    },
    success(message: string) {
        if (provider) {
            provider.success(message);
        } else {
            console.log("Success:", message);
        }
    },
    info(message: string) {
        if (provider) {
            provider.info(message);
        } else {
            console.info("Info:", message);
        }
    }
};
