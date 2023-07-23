const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikeService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLike(albumId, userId) {
    const getLikeAlbum = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    const getResult = await this._pool.query(getLikeAlbum);

    if (!getResult.rowCount) {
      const id = `likes-${nanoid(16)}`;
      const insertLikeAlbum = {
        text: 'INSERT INTO user_album_likes (id, album_id, user_id) VALUES($1, $2, $3) RETURNING id',
        values: [id, albumId, userId],
      };
      const insertResult = await this._pool.query(insertLikeAlbum);
      if (!insertResult.rowCount) {
        throw new InvariantError('Gagal menambahkan album yang disukai');
      }
      return insertResult.rows;
    } else {
      const deleteLikeAlbum = {
        text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
        values: [albumId, userId],
      };

      const deleteResult = await this._pool.query(deleteLikeAlbum);
      if (!deleteResult.rowCount) {
        throw new InvariantError('Gagal menghapus album yang disukai');
      }
    }
    await this._cacheService.delete(`likes:${albumId}`);
  }

  async checkLike(albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('Gagal menambahkan album yang disukai');
    }
  }

  async getLikeAlbum() {}
}

module.exports = AlbumLikeService;
