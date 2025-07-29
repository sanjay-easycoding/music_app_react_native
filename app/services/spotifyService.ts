// Spotify API Service
// Note: In production, you would need to register your app with Spotify and get proper credentials

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
    release_date: string;
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyApiResponse {
  tracks: SpotifyTrack[];
}

export class SpotifyService {
  private static readonly CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'; // Replace with your actual client ID
  private static readonly CLIENT_SECRET = 'YOUR_SPOTIFY_CLIENT_SECRET'; // Replace with your actual client secret
  private static accessToken: string | null = null;
  private static tokenExpiry: number = 0;

  // Get access token for Spotify API
  private static async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`)
        },
        body: 'grant_type=client_credentials'
      });

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw new Error('Failed to authenticate with Spotify');
    }
  }

  // Fetch track information from Spotify API
  static async getTrackInfo(trackId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const track: SpotifyTrack = await response.json();
      
      return {
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        albumArt: track.album.images[0]?.url || null,
        releaseYear: new Date(track.album.release_date).getFullYear(),
        albumName: track.album.name,
        duration: track.duration_ms,
        spotifyUrl: track.external_urls.spotify,
        // For demo purposes, we'll use a demo audio URL
        // In production, you'd need Spotify Premium and proper licensing for audio playback
        audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${Math.abs(trackId.length) % 9 + 1}.mp3`
      };
    } catch (error) {
      console.error('Error fetching track from Spotify API:', error);
      throw error;
    }
  }

  // Fetch multiple tracks (useful for playlists)
  static async getTracksInfo(trackIds: string[]): Promise<any[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://api.spotify.com/v1/tracks?ids=${trackIds.join(',')}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data: SpotifyApiResponse = await response.json();
      
      return data.tracks.map(track => ({
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        albumArt: track.album.images[0]?.url || null,
        releaseYear: new Date(track.album.release_date).getFullYear(),
        albumName: track.album.name,
        duration: track.duration_ms,
        spotifyUrl: track.external_urls.spotify,
        audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${Math.abs(track.id.length) % 9 + 1}.mp3`
      }));
    } catch (error) {
      console.error('Error fetching tracks from Spotify API:', error);
      throw error;
    }
  }

  // Search for tracks (useful for fallback)
  static async searchTracks(query: string, limit: number = 5): Promise<any[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.tracks.items.map((track: SpotifyTrack) => ({
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        albumArt: track.album.images[0]?.url || null,
        releaseYear: new Date(track.album.release_date).getFullYear(),
        albumName: track.album.name,
        duration: track.duration_ms,
        spotifyUrl: track.external_urls.spotify,
        audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${Math.abs(track.id.length) % 9 + 1}.mp3`
      }));
    } catch (error) {
      console.error('Error searching tracks from Spotify API:', error);
      throw error;
    }
  }
}

// Default export to fix the warning
export default SpotifyService; 