const mapDBTtoModelSongs = ({ title, year, genre, performer, duration, album_id, created_at, updated_at }) => ({
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
});

module.exports = { mapDBTtoModelSongs };
