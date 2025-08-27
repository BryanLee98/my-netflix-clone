// 발급받은 API 읽기 액세스 토큰을 사용합니다.
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OTdmZTdmMWZjZjY2NzI2ZWVmYWUzNmM3Njc1YmM1YyIsIm5iZiI6MTc1NjE4MTY1MC4wODgsInN1YiI6IjY4YWQzNDkyYTA0ZjZiM2M4NDc4MjI1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hg-DcHW36Gt6Q7z-cVyTodcXU4ReemTs7YI4IrJACt0", // 여기에 발급받은 액세스 토큰을 붙여넣으세요.
  },
}

// 인기 영화 목록을 가져오는 함수
async function fetchPopularMovies() {
  try {
    const response = await fetch("https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1", options)
    const data = await response.json()
    console.log(data.results) // 영화 목록 출력
  } catch (error) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다:", error)
  }
}

fetchPopularMovies()
