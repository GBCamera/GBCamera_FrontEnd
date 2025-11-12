import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const API_BASE = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL ?? 'http://3.36.86.11');

export default function Result() {
  const { index } = useParams()
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false) // 404 처리

  useEffect(() => {
    // 루트("/") 접근 시 API 호출 안 함
    if (!index) {
      setImage(null)
      setError(null)
      setNotFound(true)
      return
    }

    const fetchResult = async () => {
      setLoading(true)
      setError(null)
      setNotFound(false)
      try {
        const res = await fetch(`${API_BASE}/find`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index }),
        })

        // 404면 에러 대신 "사진이 조회되지 않습니다."를 보여주기
        if (res.status === 404) {
          setImage(null)
          setNotFound(true)
          return
        }

        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`)
        }

        const data: Record<string, unknown> = await res.json()

        const raw =
          (typeof data.base64 === 'string' && data.base64) ||
          (typeof data.result === 'string' && data.result) ||
          (typeof data.image === 'string' && data.image) ||
          ''

        if (!raw) {
          // 데이터가 없어도 동일 문구 노출
          setNotFound(true)
          setImage(null)
          return
        }

        const dataURL = raw.startsWith('data:image/')
          ? raw
          : `data:image/png;base64,${raw}`

        setImage(dataURL)
      } catch (e: unknown) {
        // 개발 환경에서만 에러를 콘솔에 출력
        if (!import.meta.env.PROD) {
          console.error(e)
        }
        // 네트워크 오류 등은 에러 문구 표시
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError('이미지 불러오기 실패')
        }
      } finally {
        setLoading(false)
      }
    }

    void fetchResult()
  }, [index])

  const handleDownload = () => {
    if (!image) return
    const link = document.createElement('a')
    link.href = image
    link.download = `result_${index}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const isRoot = !index

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      {/* 루트("/")이거나, 404/데이터없음일 때 */}
      {(isRoot || notFound) && <p>사진이 조회되지 않습니다.</p>}

      {loading && <p>이미지를 불러오는 중...</p>}

      {/* notFound 상태에서는 에러 문구를 숨김 */}
      {!notFound && error && <p style={{ color: 'crimson' }}>{error}</p>}

      {image && !loading && !notFound && (
        <>
          <img
            src={image}
            alt="결과 이미지"
            style={{
              maxWidth: '90%',
              border: '2px solid #ccc',
              borderRadius: 8,
              marginTop: 20,
            }}
          />

          <div style={{ marginTop: 24 }}>
            <button
              onClick={handleDownload}
              style={{
                padding: '10px 24px',
                fontSize: '18px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                transition: 'background-color 0.2s ease-in-out',
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor = '#0056b3')
              }
              onMouseOut={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor = '#007bff')
              }
            >
              다운로드
            </button>
          </div>
        </>
      )}
    </div>
  )
}
