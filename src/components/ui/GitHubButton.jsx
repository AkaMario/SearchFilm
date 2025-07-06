import { Github } from "lucide-react";

export default function GitHubButton() {
  return (
    <a
      href="https://github.com/tu-usuario/tu-repositorio"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 border border-white text-white bg-transparent rounded-md hover:bg-white hover:text-black transition font-medium"
    >
      <Github className="w-5 h-5" />
      GitHub
    </a>
  );
}
