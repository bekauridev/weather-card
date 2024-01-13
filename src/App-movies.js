import { useEffect, useState } from "react";

export default function App() {
  const [movie, setMovie] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("interstelar");

  const KEY = `64b41325`;

  // useEffect(function () {
  //   async function fetchMovies() {
  //     try {
  //       setIsLoading(true)
  //       setError('')
  //       const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`)

  //       if (!res.ok) throw new Error('Something went wrong with fetching movies')

  //       const data = await res.json()
  //       if (data.Response === 'False') throw new Error('Movie not found')

  //       setMovie(data.Search)

  //     } catch (err) {
  //       setError(err.message)
  //       console.error(err)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   fetchMovies()

  //   if (query.length < 3) {
  //     setMovie([])
  //     setIsLoading(false)

  //   }

  // }, [query, KEY, error])
  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovie(data.Search);
        } catch (err) {
          console.error(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovie([]);
        setError("");
        return;
      }

      fetchMovies();
    },
    [query, KEY, error]
  );

  return (
    <>
      <Search onSetQuery={setQuery} query={query} />
      <Main>
        <Box>
          {isLoading && !error ? (
            <Loading />
          ) : (
            <MovieList movie={movie} onSetSelectedId={setSelectedId} />
          )}
          {error && <Error message={error} />}
        </Box>

        <Box>
          {selectedId && <SelectedMovie selectedId={selectedId} KEY={KEY} />}
        </Box>
      </Main>
    </>
  );
}

function Search({ onSetQuery, query }) {
  return (
    <nav className="nav-bar">
      <p className="logo">logo</p>
      <input
        className="search"
        type="text"
        value={query}
        onChange={(e) => onSetQuery(e.target.value)}
      />
      <p className="searhResults">Found X results</p>
    </nav>
  );
}

function Loading() {
  return <p className="loading"> Loading...</p>;
}
function Error({ message }) {
  return (
    <p className="errorMessage">
      <span>❗</span> {message}
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  return <div className="box">{children}</div>;
}

function MovieList({ movie, onSetSelectedId }) {
  return (
    <ul className="movieList">
      {movie?.map((el) => (
        <Movie movie={el} key={el.imdbID} onSetSelectedId={onSetSelectedId} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSetSelectedId }) {
  return (
    <li className="movie" onClick={(e) => onSetSelectedId(movie.imdbID)}>
      <img
        className="movie__img"
        src={movie.Poster}
        alt={`movie ${movie.Title} poster`}
      />
      <div className="movie_details">
        <p>{movie.Title}</p>
        <p>{movie.Year}</p>
      </div>
    </li>
  );
}

function SelectedMovie({ selectedId, KEY }) {
  const [clickedMovie, setClickedMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function fetchMoviesById() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );

          const data = await res.json();
          setClickedMovie(data);
          setIsLoading(false);
          console.log(data);
        } catch (err) {
          console.error(err);
        }
      }
      fetchMoviesById();
    },
    [selectedId, KEY]
  );

  const {
    Title: title,
    // Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = clickedMovie;

  return (
    <div className="details">
      {isLoading ? (
        <p>loader</p>
      ) : (
        <>
          <header>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
