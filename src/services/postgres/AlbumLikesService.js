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
      await this._cacheService.delete(`likes:${albumId}`);
      return insertResult.rows;
    }
  }

  async deleteLikeAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const deleteResult = await this._pool.query(query);
    if (!deleteResult.rowCount) {
      throw new InvariantError('Gagal menghapus album yang disukai');
    }
    await this._cacheService.delete(`likes:${albumId}`);
    return deleteResult.rows;
  }

  async getLikeAlbum(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return {
        likes: JSON.parse(result),
        isCache: 1,
      };
    } catch (error) {
      const query = {
        text: 'SELECT user_id FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result.rowCount));
      return { likes: result.rowCount };
    }
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
}

module.exports = AlbumLikeService;
