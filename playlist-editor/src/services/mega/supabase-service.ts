import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

class SupabaseService {
  private client: SupabaseClient | null = null;
  private channel: RealtimeChannel | null = null;

  constructor() {
    this.init();
  }

  async init() {
    const url = await window.fetchObject("supabase_url", SUPABASE_URL);
    const key = await window.fetchObject("supabase_key", SUPABASE_ANON_KEY);

    if (url && key) {
      this.client = createClient(url, key);
    }
  }

  get isConfigured(): boolean {
    return !!this.client;
  }

  async signInWithGoogle() {
    if (!this.client) throw new Error('Supabase is not configured');
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    if (!this.client) return;
    await this.client.auth.signOut();
  }

  async getUser() {
    if (!this.client) return null;
    const { data: { user } } = await this.client.auth.getUser();
    return user;
  }

  async syncPlaylists(playlists: any[]) {
    if (!this.client) return;
    const user = await this.getUser();
    if (!user) return;

    const { error } = await this.client
      .from('playlists')
      .upsert(playlists.map(p => ({
        user_id: user.id,
        playlist_id: p.id,
        data: p,
        updated_at: new Date()
      })), { onConflict: 'user_id, playlist_id' });

    if (error) throw error;
  }

  async fetchRemotePlaylists() {
    if (!this.client) return [];
    const user = await this.getUser();
    if (!user) return [];

    const { data, error } = await this.client
      .from('playlists')
      .select('data')
      .eq('user_id', user.id);

    if (error) throw error;
    return data.map(item => item.data);
  }

  subscribeToChanges(callback: (payload: any) => void) {
      if (!this.client) return;

      this.channel = this.client
          .channel('schema-db-changes')
          .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'playlists' },
              (payload) => {
                  console.log('Change received!', payload);
                  callback(payload);
              }
          )
          .subscribe();
  }

  unsubscribe() {
      if (this.channel) {
          this.channel.unsubscribe();
      }
  }
}

export const supabaseService = new SupabaseService();
