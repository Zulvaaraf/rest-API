const mapDBTtoModelSongs = ({ id, title, year, genre, performer, duration, albumId, created_at, updated_at }) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  created_at,
  updated_at,
});

module.exports = { mapDBTtoModelSongs };
