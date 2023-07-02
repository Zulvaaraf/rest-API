const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlists-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlists gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      INNER JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  // async verifyPlaylistOwner(id, owner) {
  //   const query = {
  //     text: 'SELECT * FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
  //     values: [id, owner],
  //   };

  //   const result = await this._pool.query(query);
  //   if (!result.rows.length) {
  //     throw new NotFoundError('Playlist tidak ditemukan');
  //   }

  //   const playlist = result.rows[0];
  //   if (playlist.owner !== owner) {
  //     throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  //   }
  // }
}

module.exports = PlaylistsService;
