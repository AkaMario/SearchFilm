import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getMovieDetails = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
      const data = await res.json();
      setMovie(data);
    };

    const getMovieTrailer = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
      const data = await res.json();
      const trailer = data.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (trailer) setTrailerKey(trailer.key);
    };

    const getCast = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`);
      const data = await res.json();
      setCast(data.cast.slice(0, 10)); // primeros 10 actores
    };

    const getReviews = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}`);
      const data = await res.json();
      setReviews(data.results.slice(0, 5)); // primeras 5 reseñas
    };

    getMovieDetails();
    getMovieTrailer();
    getCast();
    getReviews();
  }, [id]);

  const handleBack = () => navigate('/');

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#042940] text-white">
        Cargando detalles...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#042940] text-white px-4 sm:px-8 py-6">
      <div className="flex justify-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center bg-[#DBF227] hover:bg-[#042940] hover:border-[#DBF227] hover:text-[#DBF227] text-[#042940] px-4 py-2 sm:px-6 rounded-md font-medium transition border border-transparent hover:border-[#DBF227] text-sm sm:text-base w-[65%] sm:w-auto max-w-full justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-[#005C53] p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg w-full max-w-xs mx-auto lg:mx-0"
          />

          <div className="flex-1 space-y-4">
            <p>
              <strong className="text-[#DBF227]">Fecha de estreno:</strong> {movie.release_date}
            </p>
            <p>
              <strong className="text-[#DBF227]">Resumen:</strong> {movie.overview}
            </p>
            <p>
              <strong className="text-[#DBF227]">Géneros:</strong>{' '}
              {movie.genres?.map((g) => g.name).join(', ')}
            </p>
            <p>
              <strong className="text-[#DBF227]">Rating:</strong> {movie.vote_average} / 10
            </p>

            {trailerKey && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2 text-[#DBF227]">🎞️ Trailer</h3>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-[#fffff]">Elenco principal</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="bg-[#042940] p-3 rounded-lg text-center">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : 'https://via.placeholder.com/185x278?text=Sin+foto'
                    }
                    alt={actor.name}
                    className="w-full h-auto rounded mb-2"
                  />
                  <p className="text-sm font-bold">{actor.name}</p>
                  <p className="text-xs text-gray-300"> {actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-[#ffffff]">Reseñas</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#042940] p-4 rounded-lg border border-[#DBF227]/20"
                >
                  <p className="text-sm text-gray-300 mb-1">
                    <strong className="text-[#DBF227]">{review.author}</strong> • puntuación:{' '}
                    {review.author_details?.rating ?? 'N/A'}
                  </p>
                  <p className="text-sm">{review.content.slice(0, 300)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
