function Search({ search, onSetSearch }) {
  return (
    <input
      className="App__input"
      placeholder="Search"
      aria-label="Search"
      type="text"
      required
      value={search}
      onChange={(e) => onSetSearch(e.target.value)}
    />
  );
}

export default Search;
