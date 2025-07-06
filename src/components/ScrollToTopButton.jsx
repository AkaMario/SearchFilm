import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react'; // o cualquier ícono

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-[#DBF227] hover:bg-[#9FC131] text-[#042940] p-3 rounded-full shadow-lg transition transform hover:scale-110"
        title="Volver arriba"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    )
  );
}
