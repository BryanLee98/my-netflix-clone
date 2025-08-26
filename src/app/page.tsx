"use client"

import { useState, useEffect } from "react"
import styles from "./page.module.css"
import Header from "@/components/Header/Header"
import Banner from "@/components/Banner/Banner"
import Row from "@/components/Row/Row"
import api, { requests } from "@/commons/settings/api"
import { useDebounce } from "@/components/hooks/useDebounce"
import InfiniteScroll from "react-infinite-scroll-component"
import MovieModal from "@/components/MovieModal/MovieModal"

export type Movie = {
  id: number
  poster_path: string
  backdrop_path: string
  name: string // TV 쇼 제목
  title: string // 영화 제목
  overview: string
  media_type?: "movie" | "tv" // 영화/TV 구분자 (선택적)
}
const Home = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  // 현재 페이지 번호를 추적하는 상태
  const [page, setPage] = useState(1)
  // 더 불러올 데이터가 있는지 여부를 추적하는 상태
  const [hasMore, setHasMore] = useState(true)
  // 모달에 띄울 영화를 저장하는 상태
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // 영화 클릭 시 호출될 핸들러
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
  }

  // 모달을 닫는 핸들러
  const closeModal = () => {
    setSelectedMovie(null)
  }
  // 검색어가 변경될 때 실행되는 useEffect
  useEffect(() => {
    if (debouncedSearchTerm) {
      // 새로운 검색이 시작되면 기존 결과와 페이지 번호를 초기화합니다.
      setSearchResults([])
      setPage(1)
      setHasMore(true)
      setIsSearching(true)

      fetchSearchData(1) // 첫 페이지 데이터를 불러옵니다.
    } else {
      setSearchResults([])
    }
  }, [debouncedSearchTerm])

  // 검색 데이터를 불러오는 함수
  const fetchSearchData = async (currentPage: number) => {
    try {
      const responseData = await api.get(requests.fetchSearch.path, {
        query: debouncedSearchTerm,
        page: currentPage, // 페이지 번호를 파라미터로 전달
      })

      // 기존 결과에 새로운 결과를 이어 붙입니다.
      setSearchResults((prevResults) => [...prevResults, ...responseData.results])

      // TMDB API는 마지막 페이지보다 더 요청하면 빈 배열을 줍니다.
      // 받아온 결과가 없거나, 전체 페이지 수에 도달하면 더 이상 요청하지 않습니다.
      if (responseData.results.length === 0 || responseData.page >= responseData.total_pages) {
        setHasMore(false)
      }
    } catch (error) {
      console.error("검색 결과를 가져오는 데 실패했습니다:", error)
      setHasMore(false) // 에러 발생 시 더 이상 시도하지 않음
    } finally {
      setIsSearching(false)
    }
  }

  // 스크롤이 끝에 닿았을 때 호출될 함수
  const fetchMoreData = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchSearchData(nextPage)
  }

  const renderSearchResults = () => {
    const base_url = "https://image.tmdb.org/t/p/original/"

    // 초기 검색 시 로딩 화면
    if (isSearching && page === 1) {
      return (
        <main className={styles.search_results_container}>
          <h2 className={styles.message_text}>검색 중...</h2>
        </main>
      )
    }

    // 검색 결과가 없을 때
    if (!searchResults.length) {
      return (
        <main className={styles.search_results_container}>
          <h2 className={styles.message_text}>검색 결과가 없습니다.</h2>
        </main>
      )
    }

    return (
      <main className={styles.search_results_container}>
        <h2 style={{ marginBottom: "20px" }}>'{debouncedSearchTerm}' 검색 결과</h2>
        <InfiniteScroll
          dataLength={searchResults.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4 className={styles.message_text}>불러오는 중...</h4>}
          endMessage={
            <p className={styles.message_text}>
              <b>모든 결과를 보셨습니다.</b>
            </p>
          }
        >
          <div className={styles.search_grid}>
            {searchResults.map((movie) =>
              movie.poster_path ? (
                <div
                  key={`${movie.id}-${Math.random()}`}
                  className={styles.movie_card}
                  onClick={() => handleMovieClick(movie)}
                >
                  <img
                    className={styles.movie_poster}
                    src={`${base_url}${movie.poster_path}`}
                    alt={movie.title || movie.name}
                  />
                </div>
              ) : null
            )}
          </div>
        </InfiniteScroll>
      </main>
    )
  }

  const renderMainContent = () => (
    <>
      <Banner fetchRequest={requests.fetchNetflixOriginals} />
      <Row
        title="NETFLIX ORIGINALS"
        fetchPath={requests.fetchNetflixOriginals.path}
        fetchParams={requests.fetchNetflixOriginals.params}
        onMovieClick={handleMovieClick}
        isLargeRow
      />
      <Row title="Trending Now" fetchPath={requests.fetchTrending.path} onMovieClick={handleMovieClick} />
      <Row
        title="Action"
        fetchPath={requests.fetchActionMovies.path}
        fetchParams={requests.fetchActionMovies.params}
        onMovieClick={handleMovieClick}
      />
      <Row
        title="Comedy"
        fetchPath={requests.fetchComedyMovies.path}
        fetchParams={requests.fetchComedyMovies.params}
        onMovieClick={handleMovieClick}
      />
      <Row
        title="Horror"
        fetchPath={requests.fetchHorrorMovies.path}
        fetchParams={requests.fetchHorrorMovies.params}
        onMovieClick={handleMovieClick}
      />
      <Row
        title="Romance"
        fetchPath={requests.fetchRomanceMovies.path}
        fetchParams={requests.fetchRomanceMovies.params}
        onMovieClick={handleMovieClick}
      />
      <Row
        title="Documentaries"
        fetchPath={requests.fetchDocumentaries.path}
        fetchParams={requests.fetchDocumentaries.params}
        onMovieClick={handleMovieClick}
      />
      <Row
        title="Animation"
        fetchPath={requests.fetchAnimation.path}
        fetchParams={requests.fetchAnimation.params}
        onMovieClick={handleMovieClick}
      />
    </>
  )

  return (
    <div className={styles.app}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {debouncedSearchTerm ? renderSearchResults() : renderMainContent()}

      {/* 선택한 영화의 이미지의 상세보기 */}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </div>
  )
}

export default Home
