// >> 이렇게 코드 작성하면 영화 목록을 불러올 때 마다
// 주소 하나하나 따로 함수를 만들거나 fetch 할 필요가 없음. << //

// 1. 영화 DB의 기본 주소
const BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
// 2. API 요청을 위한 객체 생성
const api = {
  // 3. GET 요청을 처리하는 비동기 함수
  get: async (path: string, params: Record<string, any> = {}) => {
    // 4. URL 쿼리 파라미터 생성
    const queryParams = new URLSearchParams({
      api_key: API_KEY!,
      language: "ko-KR",
      ...params,
    })
    // 5. 최종 요청 URL 생성, 위 1+3+4번을 합친 결과물.
    const url = `${BASE_URL}${path}?${queryParams}`
    console.log("url::", url)
    // 6. 에러 관리를 위한 try catch
    try {
      const response = await fetch(url)
      if (!response.ok) {
        // 에러 발생 시 콘솔에 출력
        const errorData = await response.json()
        console.error("TMDB API 에러 응답:", errorData)
        throw new Error(`API call failed with status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Fetch API Error:", error)
      return { results: [] }
    }
  },
}

export default api

// 요청 객체의 구조를 path와 params로 분리하여 명확하게 정의
export const requests = {
  fetchTrending: { path: "/trending/all/week" },
  fetchTopRated: { path: "/movie/top_rated" },
  fetchSearch: { path: "/search/movie" },

  // 파라미터가 필요한 요청들
  fetchNetflixOriginals: {
    path: "/discover/tv",
    params: { with_networks: 213 },
  },
  fetchActionMovies: {
    path: "/discover/movie",
    params: { with_genres: 28 },
  },
  fetchComedyMovies: {
    path: "/discover/movie",
    params: { with_genres: 35 },
  },
  fetchHorrorMovies: {
    path: "/discover/movie",
    params: { with_genres: 27 },
  },
  fetchRomanceMovies: {
    path: "/discover/movie",
    params: { with_genres: 10749 },
  },
  fetchDocumentaries: {
    path: "/discover/movie",
    params: { with_genres: 99 },
  },
  fetchAnimation: {
    path: "/discover/movie",
    params: { with_genres: 16 },
  },
}
