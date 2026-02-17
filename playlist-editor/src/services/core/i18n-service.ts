import { storage } from './storage-service';
import { writable, derived } from "svelte/store";

const translations: Record<string, Record<string, string>> = {
  en: {
    "nav.new": "New Playlist",
    "nav.saved": "Saved Playlists",
    "nav.omni": "Omni View",
    "nav.orchestrator": "Multi-Orchestrator",
    "nav.settings": "Settings",
    "manage.title": "System Management",
    "manage.project_config": "Project Configuration",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.restore": "Restore"
  },
  fr: {
    "nav.new": "Nouvelle Playlist",
    "nav.saved": "Playlists Enregistrées",
    "nav.omni": "Vue Omni",
    "nav.orchestrator": "Multi-Orchestrateur",
    "nav.settings": "Paramètres",
    "manage.title": "Gestion du Système",
    "manage.project_config": "Configuration du Projet",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.restore": "Restaurer"
  }
};

export const locale = writable("en");

export const t = derived(locale, ($l) => (key: string) => {
  return translations[$l]?.[key] || translations["en"]?.[key] || key;
});

export const i18nService = {
    async init() {
        const saved = await storage.get("locale", "en");
        locale.set(saved);
    },
    setLocale(newLocale: string) {
        locale.set(newLocale);
        storage.set("locale", newLocale);
    }
};
