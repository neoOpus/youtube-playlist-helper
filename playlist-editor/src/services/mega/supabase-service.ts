import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { storage } from '../core/storage-service';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

class SupabaseService {
  public client: SupabaseClient | null = null;
  private channel: RealtimeChannel | null = null;
  private presenceChannel: RealtimeChannel | null = null;

  constructor() {
    this.init();
  }

  async init() {
    const url = await storage.get("supabase_url", SUPABASE_URL);
    const key = await storage.get("supabase_key", SUPABASE_ANON_KEY);

    if (url && key) {
      this.client = createClient(url, key);
    }
  }

  get isConfigured(): boolean {
    return !!this.client;
  }

  async healthCheck() {
    if (!this.client) return { error: 'Not configured' };
    return await this.client.from("playlists").select("id", { count: "exact", head: true });
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

  // Live Presence for Collaborators
  joinWorkspace(playlistId: string, onPresenceUpdate: (presences: any) => void) {
      if (!this.client) return;
      const user = this.getUser(); // Async but presence uses sync state often

      this.presenceChannel = this.client.channel(`playlist:${playlistId}`, {
          config: { presence: { key: playlistId } }
      });

      this.presenceChannel
          .on('presence', { event: 'sync' }, () => {
              const state = this.presenceChannel?.presenceState();
              onPresenceUpdate(state);
          })
          .subscribe(async (status) => {
              if (status === 'SUBSCRIBED') {
                  const u = await this.getUser();
                  await this.presenceChannel?.track({
                      user: u?.email || 'Anonymous',
                      online_at: new Date().toISOString(),
                  });
              }
          });
  }

  leaveWorkspace() {
      if (this.presenceChannel) {
          this.presenceChannel.unsubscribe();
      }
  }

  subscribeToChanges(callback: (payload: any) => void) {
      if (!this.client) return;

      this.channel = this.client
          .channel('schema-db-changes')
          .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'playlists' },
              (payload) => {
                  callback(payload);
              }
          )
          .subscribe();
  }

  unsubscribe() {
      if (this.channel) this.channel.unsubscribe();
  }
}

export const supabaseService = new SupabaseService();
