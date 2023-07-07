const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModelPlaylistSongs } = require('../../utils/indexPlaylistSongs');

class PlaylistsSongService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = `playlistSong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Songs gagal ditambahkan ke playlists');
    }

    return result.rows[0].id;
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
      JOIN playlist_songs ON songs.id = playlist_songs.song_id
      JOIN playlists ON playlist_songs.playlist_id = playlists.id
      WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelPlaylistSongs);
  }
}

module.exports = PlaylistsSongService;
