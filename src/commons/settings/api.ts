const BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

const api = {
  get: async (path: string, params: Record<string, any> = {}) => {
    const queryParams = new URLSearchParams({
      api_key: API_KEY!,
      language: "ko-KR",
      ...params,
    })

    const url = `${BASE_URL}${path}?${queryParams}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        // 에러 발생 시 더 자세한 정보를 콘솔에 출력합니다.
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

// 요청 객체의 구조를 path와 params로 분리하여 명확하게 정의합니다.
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
