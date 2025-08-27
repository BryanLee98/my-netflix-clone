"use client"

import { useState } from "react"
import styles from "./MovieModal.module.css"
import { Movie } from "@/app/page"
import { USE_MOVIE_MODAL } from "./hooks"

type Props = {
  movie: Movie // 모달을 처음 열 때 사용할 영화 정보
  onClose: () => void
}

// details 찍어서 안에 뭐있는지 보거나, api docs에 뭐들어있는지 친절히 알려줌.
// 쓰고 싶은 것만 가져오면 됨.
// export interface MovieDetails extends Movie {
//   runtime?: number
//   episode_run_time?: number[]
//   genres?: { id: number; name: string }[]
//   tagline?: string
//   vote_average?: number
//   last_episode_to_air?: { name: string; still_path: string }
// }

const base_url = "https://image.tmdb.org/t/p/original/"
const MovieModal = ({ movie, onClose }: Props) => {
  const {
    currentMovie,
    setCurrentMovie,
    details,
    setDetails,
    recommendations,
    setRecommendations,
    isClosing,
    setIsClosing,
    isExpanded,
    setIsExpanded,
    handleClose,
    handleBackdropClick,
    handleRecommendationClick,
    runtime,
    overviewText,
    OVERVIEW_CHAR_LIMIT,
    seasonDetails,
  } = USE_MOVIE_MODAL({
    movie,
    onClose,
  })
  console.log(details)
  // 현재 선택된 시즌 번호를 관리하는 상태
  const [selectedSeason, setSelectedSeason] = useState<number>(1)

  const renderLoading = () => (
    <div className={styles.loading_container}>
      <p>Loading...</p>
    </div>
  )

  const mediaType = currentMovie.title ? "movie" : "tv"
  // 선택된 시즌의 상세 정보를 찾습니다.
  const currentSeasonData = seasonDetails.find((s) => s.season_number === selectedSeason)

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

              {/* TV 시리즈인 경우 시즌 및 에피소드 섹션 보이기 */}
              {mediaType === "tv" && seasonDetails.length > 0 && (
                <div className={styles.episodes_section}>
                  <div className={styles.season_selector_wrapper}>
                    <select
                      className={styles.season_selector}
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    >
                      {seasonDetails.map((season) => (
                        <option key={season.id} value={season.season_number}>
                          {season.name} ({season.episodes?.length || 0} Episodes)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.episodes_list}>
                    {currentSeasonData?.episodes?.map((episode) => (
                      <div key={episode.id} className={styles.episode_card}>
                        <div className={styles.episode_thumbnail}>
                          <img
                            src={episode.still_path ? `${base_url}${episode.still_path}` : "/placeholder.png"}
                            alt={episode.name}
                          />
                        </div>
                        <div className={styles.episode_info}>
                          <h4>
                            {episode.episode_number}. {episode.name}
                          </h4>
                          <p>{episode.overview}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
