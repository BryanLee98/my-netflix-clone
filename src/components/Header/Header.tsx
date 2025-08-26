"use client"

import { useState, useEffect } from "react"
import styles from "./Header.module.css"

// 부모 컴포넌트(page.tsx)로부터 검색어 상태와 상태 변경 함수를 props로 받습니다.
type Props = {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

const Header = ({ searchTerm, setSearchTerm }: Props) => {
  // 스크롤 위치에 따라 헤더 배경을 어둡게 만들기 위한 상태
  const [showBackground, setShowBackground] = useState(false)

  // 스크롤 이벤트를 감지하는 useEffect
  useEffect(() => {
    const handleScroll = () => {
      // 100px 이상 스크롤되면 true로 설정
      setShowBackground(window.scrollY > 100)
    }
    // 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll)
    // 컴포넌트가 사라질 때 이벤트 리스너를 제거하여 메모리 누수 방지
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    // showBackground 상태에 따라 header_black 클래스를 동적으로 적용
    <header className={`${styles.header} ${showBackground && styles.header_black}`}>
      <div className={styles.header_contents}>
        {/* 넷플릭스 로고: 클릭하면 검색어를 초기화하여 홈 화면으로 돌아갑니다. */}
        <img
          className={styles.header_logo}
          src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
          alt="Netflix Logo"
          onClick={() => setSearchTerm("")}
        />

        {/* 검색창과 아바타를 묶는 새로운 div */}
        <div className={styles.header_right}>
          <div className={styles.search_container}>
            <input
              type="text"
              className={styles.search_input}
              placeholder="제목, 사람, 장르"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <img
            className={styles.header_avatar}
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
            alt="User Avatar"
          />
        </div>
      </div>
    </header>
  )
}

export default Header
