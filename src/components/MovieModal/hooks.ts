"use client"
import { useState, useEffect } from "react"
import { MovieDetails } from "./MovieModal"
import { Movie } from "@/app/page"

type Props = {
  movie: Movie // 모달을 처음 열 때 사용할 영화 정보
  onClose: () => void
}

export const USE_MOVIE_MODAL = (props: Props) => {
  const [currentMovie, setCurrentMovie] = useState(props.movie)
  const [details, setDetails] = useState<MovieDetails | null>(null)
  const [recommendations, setRecommendations] = useState<Movie[]>([])
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
  }
}
