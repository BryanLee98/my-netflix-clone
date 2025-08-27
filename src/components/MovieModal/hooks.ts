"use client"
import { useState, useEffect } from "react"
import { Movie } from "@/app/page"
import api from "@/commons/settings/api"

type Props = {
  movie: Movie // 모달을 처음 열 때 사용할 영화 정보
  onClose: () => void
}

// 상세 정보 타입 확장
export interface MovieDetails extends Movie {
  runtime?: number
  episode_run_time?: number[]
  genres?: { id: number; name: string }[]
  tagline?: string
  vote_average?: number
  seasons?: Season[] // TV 시리즈의 시즌 정보
}

// 시즌 및 에피소드 타입 정의
export interface Episode {
  id: number
  name: string
  overview: string
  still_path: string | null
  episode_number: number
}

export interface Season {
  id: number
  name: string
  season_number: number
  episode_count: number
  episodes?: Episode[] // 시즌 상세 정보에 포함될 에피소드 목록
}

export const USE_MOVIE_MODAL = (props: Props) => {
  const [currentMovie, setCurrentMovie] = useState(props.movie)
  const [details, setDetails] = useState<MovieDetails | null>(null)
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  // 시즌별 상세 정보를 저장할 상태 추가
  const [seasonDetails, setSeasonDetails] = useState<Season[]>([])
  const [isClosing, setIsClosing] = useState(false)
  // '더보기' 상태를 관리하는 새로운 state
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      props.onClose()
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

  useEffect(() => {
    if (!currentMovie) return

    setDetails(null)
    setSeasonDetails([]) // 새 콘텐츠를 불러올 때 시즌 정보 초기화
    setIsExpanded(false)

    const mediaType = currentMovie.title ? "movie" : "tv"

    const fetchData = async () => {
      try {
        const detailsData = await api.get(`/${mediaType}/${currentMovie.id}`)
        setDetails(detailsData)

        // TV 시리즈인 경우, 모든 시즌의 상세 정보를 병렬로 가져옵니다.
        if (mediaType === "tv" && detailsData.seasons) {
          const seasonPromises = detailsData.seasons
            // "특별편" 같은 시즌 0은 제외
            .filter((season: Season) => season.season_number > 0)
            .map((season: Season) => api.get(`/tv/${currentMovie.id}/season/${season.season_number}`))

          const seasonsData = await Promise.all(seasonPromises)
          setSeasonDetails(seasonsData)
        }

        const recommendationsData = await api.get(`/${mediaType}/${currentMovie.id}/recommendations`)
        setRecommendations(recommendationsData.results.slice(0, 10))
      } catch (error) {
        console.error("Failed to fetch details or recommendations:", error)
      }
    }

    fetchData()
  }, [currentMovie])

  const runtime = details?.runtime || (details?.episode_run_time && details.episode_run_time[0])
  const overviewText = details?.overview || ""
  const OVERVIEW_CHAR_LIMIT = 100 // 약 2줄에 해당하는 글자 수 제한

  return {
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
  }
}
