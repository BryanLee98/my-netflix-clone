"use client"

import { useState, useEffect } from "react"

// 디바운스 커스텀 훅
// value: 디바운스 대상 값 (예: 검색어)
// delay: 지연 시간 (밀리초)
export const useDebounce = <T>(value: T, delay: number): T => {
  // 디바운스된 값을 저장하기 위한 상태
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // 'value'가 변경될 때마다 새로운 타이머를 설정합니다.
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 이 useEffect가 다시 실행되기 전(즉, value가 바뀌기 전)에
    // 이전 타이머를 제거합니다. 이것이 디바운싱의 핵심입니다.
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // value나 delay가 변경될 때만 effect를 재실행합니다.

  return debouncedValue
}
