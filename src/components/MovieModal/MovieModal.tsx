"use client"

import { useState, useEffect } from "react"
import styles from "./MovieModal.module.css"
import api from "@/commons/settings/api"
import { Movie } from "@/app/page"

type Props = {
  movie: Movie // 모달을 처음 열 때 사용할 영화 정보
  onClose: () => void
}

interface MovieDetails extends Movie {
  runtime?: number
  episode_run_time?: number[]
  genres?: { id: number; name: string }[]
  tagline?: string
  vote_average?: number
}

const base_url = "https://image.tmdb.org/t/p/original/"
const MovieModal = ({ movie, onClose }: Props) => {
  const [currentMovie, setCurrentMovie] = useState(movie)
  const [details, setDetails] = useState<MovieDetails | null>(null)
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [isClosing, setIsClosing] = useState(false)
  // '더보기' 상태를 관리하는 새로운 state
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!currentMovie) return
    setDetails(null)
    // 다른 영화로 전환될 때 '더보기' 상태를 초기화합니다.
    setIsExpanded(false)

    const mediaType = currentMovie.title ? "movie" : "tv"

    const fetchData = async () => {
      try {
        const detailsData = await api.get(`/${mediaType}/${currentMovie.id}`)
        setDetails(detailsData)
        const recommendationsData = await api.get(`/${mediaType}/${currentMovie.id}/recommendations`)
        setRecommendations(recommendationsData.results.slice(0, 10))
      } catch (error) {
        console.error("Failed to fetch details or recommendations:", error)
      }
    }

    fetchData()
  }, [currentMovie])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleRecommendationClick = (recMovie: Movie) => {
    setCurrentMovie(recMovie)
  }

  const renderLoading = () => (
    <div className={styles.loading_container}>
      <p>Loading...</p>
    </div>
  )

  const runtime = details?.runtime || (details?.episode_run_time && details.episode_run_time[0])
  const overviewText = details?.overview || ""
  const OVERVIEW_CHAR_LIMIT = 100 // 약 2줄에 해당하는 글자 수 제한

  return (
    <div className={`${styles.backdrop} ${isClosing ? styles.backdrop_closing : ""}`} onClick={handleBackdropClick}>
      <div className={`${styles.modal} ${isClosing ? styles.modal_closing : ""}`}>
        <button className={styles.close_button} onClick={handleClose}>
          &times;
        </button>

        {details ? (
          <>
            <div
              className={styles.modal_banner}
              style={{ backgroundImage: `url(${base_url}${details.backdrop_path})` }}
            >
              <div className={styles.banner_fade} />
            </div>
            <div className={styles.modal_content}>
              <h1 className={styles.title}>{details.title || details.name}</h1>
              <div className={styles.metadata}>
                <span className={styles.rating}>평점: {details.vote_average?.toFixed(1)}</span>
                <span>{runtime ? `${runtime}분` : ""}</span>
                <span>{details.genres?.map((g) => g.name).join(" / ")}</span>
              </div>
              <p className={styles.tagline}>{details.tagline}</p>

              {/* 줄거리(overview) 렌더링 로직 */}
              <p className={styles.overview}>
                {overviewText.length > OVERVIEW_CHAR_LIMIT && !isExpanded ? (
                  <>
                    {`${overviewText.substring(0, OVERVIEW_CHAR_LIMIT)}... `}
                    <span className={styles.toggle_button} onClick={() => setIsExpanded(true)}>
                      더보기
                    </span>
                  </>
                ) : (
                  <>
                    {overviewText}
                    {overviewText.length > OVERVIEW_CHAR_LIMIT && (
                      <span className={styles.toggle_button} onClick={() => setIsExpanded(false)}>
                        접기
                      </span>
                    )}
                  </>
                )}
              </p>

              {recommendations.length > 0 && (
                <div className={styles.recommendations}>
                  <h2>비슷한 콘텐츠</h2>

                  <div className={styles.rec_grid}>
                    {recommendations.map(
                      (rec) =>
                        rec.backdrop_path && (
                          <div key={rec.id} className={styles.rec_card} onClick={() => handleRecommendationClick(rec)}>
                            <img src={`${base_url}${rec.backdrop_path}`} alt={rec.title || rec.name} />
                            {rec.name}
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          renderLoading()
        )}
      </div>
    </div>
  )
}

export default MovieModal
