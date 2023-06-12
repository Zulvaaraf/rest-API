const mapDBToModelSongs = ({ title, year, genre, performer, duration, albumId, created_at, updated_at }) => ({
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModelSongs };
