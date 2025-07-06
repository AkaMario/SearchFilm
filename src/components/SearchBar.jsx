import { useState } from "react";
import SplitText from "./ui/SplitText";
import { Search } from "lucide-react";
import GitHubButton from "./ui/GitHubButton";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleAnimationComplete = () => {
        console.log("All letters have animated!");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() !== "") {
            onSearch(query);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full mb-6 sm:mb-8 justify-center items-center sm:flex-row"
        >
            <a href="/"> 
            <SplitText
                text={
                    <>
                        <span className="text-[#fffff]">SEARCH</span>
                        <span className="text-[#9FC131]">FILM</span>
                    </>
                }
                className="text-2xl sm:text-3xl font-semibold text-center"
                delay={50}
                duration={0.3}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleAnimationComplete}
            />
            </a>
            
            <div className="relative w-full max-w-xs sm:max-w-none sm:w-1/2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Buscar película..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#DBF227] focus:border-transparent transition hover:border-[#DBF227] text-sm sm:text-base"
                />
            </div>
            <div className="flex justify-center items-center gap-1 w-full sm:w-auto max-w-xs sm:max-w-none sm:max-w-[50%]">
                <button
                    type="submit"
                    className="bg-[#DBF227] hover:bg-[#042940] hover:border-[#DBF227] hover:text-[#DBF227] text-[#042940] px-4 py-2 sm:px-6 rounded-md font-medium transition border border-transparent hover:border-[#DBF227] text-sm sm:text-base w-[65%] sm:w-auto max-w-full"
                >
                    Buscar
                </button>
                <div className="w-[35%] sm:w-[150px] flex justify-center max-w-full">
                    <GitHubButton />
                </div>
            </div>
        </form>
    );
}
