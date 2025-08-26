"use client"

import { useState, useEffect } from "react"
// axios 대신 새로 만든 api 모듈을 import 합니다.
import api from "@/commons/settings/api"
import styles from "./Banner.module.css"

type Props = {
  fetchRequest: {
    path: string
    params: {
      with_networks: number
    }
  }
  // 기존에 정의된 props가 있다면 여기에 작성
}
type Movie = {
  backdrop_path: string
  name?: string
  title?: string
  original_name?: string
  overview: string
}

const Banner = ({ fetchRequest }: Props) => {
  const [movie, setMovie] = useState<Movie | null>(null)

  useEffect(() => {
    async function fetchData() {
      // api.get 호출 시 path와 params를 명확하게 전달
      const responseData = await api.get(fetchRequest.path, fetchRequest.params)
      const movies = responseData.results
      const randomMovie = movies[Math.floor(Math.random() * movies.length)]
      setMovie(randomMovie)
    }
    fetchData()
  }, [fetchRequest]) // 의존성 배열을 fetchRequest 객체로 변경

  function truncate(str: string | undefined, n: number) {
    return str && str.length > n ? str.substr(0, n - 1) + "..." : str
  }

  return (
    <header
      className={styles.banner}
      style={{
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className={styles.banner_contents}>
        <h1 className={styles.banner_title}>{movie?.title || movie?.name || movie?.original_name}</h1>
        <div className={styles.banner_buttons}>
          <button className={styles.banner_button}>Play</button>
          <button className={styles.banner_button}>My List</button>
        </div>
        <h1 className={styles.banner_description}>{truncate(movie?.overview, 150)}</h1>
      </div>
      <div className={styles.banner_fadeBottom} />
    </header>
  )
}

export default Banner
