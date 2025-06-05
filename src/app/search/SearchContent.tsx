"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CustomRow from "../components/CustomRow";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { fetchSearchMovies } from "../actions/actions";
import LoadingLight from "../components/Loading/LoadingLight";
export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetchSearchMovies(query)
        .then((res) => {
          setSearchResults(res?.results || []);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="w-full h-full rounded-[25px] px-10 pt-6 py-10 bg-[#171a21]">
      <Link
        href="/"
        className="text-[13px] hover:underline w-[120px] items-center hover:text-[#fff] gap-x-1 text-[#ccc] flex mb-2"
      >
        <BsArrowLeft /> Back to Home
      </Link>
      <h1 className="text-2xl text-white mb-5">Search Results for "{query}"</h1>
      {loading ? (
        <LoadingLight />
      ) : searchResults.length > 0 ? (
        <CustomRow
          title="Search Results"
          data={searchResults}
          listClassName=""
        />
      ) : (
        <div className="text-[#b8b8b8] text-center py-10">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}
