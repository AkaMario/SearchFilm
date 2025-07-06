import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './components/SearchBar';
import ScrollToTopButton from './components/ScrollToTopButton';


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_API_URL || 'https://api.themoviedb.org/3';

const sections = {
  popular: 'Populares',
  top_rated: 'Mejores valoradas',
  now_playing: 'En cartelera',
  upcoming: 'Próximamente',
};

function App() {
  const [movies, setMovies] = useState([]);
  const [currentSection, setCurrentSection] = useState('popular');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Cargar películas según sección y página
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/movie/${currentSection}?api_key=${API_KEY}&page=${page}`);
      const data = await res.json();

      setMovies((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
      setLoading(false);
    };

    fetchMovies();
  }, [currentSection, page]);

  // Reiniciar cuando se cambia la sección
  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [currentSection]);

  // Scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  // Búsqueda personalizada (sobrescribe películas)
  const searchMovies = async (query) => {
    setLoading(true);
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    const data = await res.json();
    setMovies(data.results);
    setPage(1);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#042940] text-gray-50 p-4 sm:p-8 max-w-full mx-auto">
      <SearchBar onSearch={searchMovies} />

      {/* Botones de sección */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {Object.entries(sections).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCurrentSection(key)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              currentSection === key
                ? 'bg-[#DBF227] text-[#042940]'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista de películas animada */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection + page} // asegura que reanime al cambiar sección o página 1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="hover:scale-105 transition duration-300"
              style={{ display: 'block' }}
            >
              <div className="bg-[#005C53] rounded-lg shadow-md overflow-hidden hover:shadow-[0_4px_24px_0_#DBF227] transition-shadow duration-300">
              {movie.poster_path ? (
                <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto"
                />
              ) : (
                <div className="h-72 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600">Sin imagen</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-20">{movie.title}</h3>
                <p className="text-sm text-gray-10">{movie.release_date}</p>
                <p className="text-sm text-gray-300 mt-2">{movie.overview.slice(0, 100)}...</p>
                <p className="text-sm text-[#D6D58E] mt-1">
                  Calificación: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10
                </p>
              </div>
              </div>
            </Link>
            ))}
          </motion.div>
          </AnimatePresence>

          {/* Indicador de carga */}
      {loading && (
        <div className="text-center mt-6 text-sm text-gray-300 animate-pulse">
          Cargando más películas...
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
}

export default App;
