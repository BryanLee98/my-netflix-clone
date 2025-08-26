"use client"

import { useState, useEffect } from "react"
import api from "@/commons/settings/api"
import styles from "./Row.module.css"
import { Movie } from "@/app/page"

type Props = {
  title: string
  fetchPath?: string
  fetchParams?: Record<string, any>
  movies?: Movie[]
  isLargeRow?: boolean
  // 부모로부터 클릭 핸들러 함수를 받기 위한 prop 추가
  onMovieClick: (movie: Movie) => void
}
const base_url = "https://image.tmdb.org/t/p/original/"

const Row = ({ title, fetchPath, fetchParams, movies: initialMovies, isLargeRow = false, onMovieClick }: Props) => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies || [])

  useEffect(() => {
    // fetchPath가 없으면 API를 호출하지 않습니다.
    if (!fetchPath) return

    async function fetchData() {
      // api.get 호출 시 path와 params를 명확하게 전달합니다.
      const responseData = await api.get(fetchPath as string, fetchParams)
      setMovies(responseData.results)
    }
    fetchData()
    // fetchPath가 변경될 때마다 effect를 재실행합니다.
  }, [fetchPath])

  useEffect(() => {
    if (initialMovies) {
      setMovies(initialMovies)
    }
  }, [initialMovies])

  return (
    <div className={styles.row}>
      <h2>{title}</h2>
      <div className={styles.row_posters}>
        {movies.map(
          (movie) =>
            movie.poster_path &&
            movie.backdrop_path && (
              <img
                key={movie.id}
                className={`${styles.row_poster} ${isLargeRow && styles.row_posterLarge}`}
                src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                alt={movie.name || movie.title}
                onClick={() => onMovieClick(movie)}
              />
            )
        )}
      </div>
    </div>
  )
}

export default Row
