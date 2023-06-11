const mapDBToModelAlbums = ({ id, name, year, created_at, updated_at }) => ({
  id,
  name,
  year,
  created_at: created_at,
  updated_at: updated_at,
});

module.exports = { mapDBToModelAlbums };
