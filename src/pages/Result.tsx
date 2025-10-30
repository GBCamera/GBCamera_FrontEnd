// src/pages/Result.tsx
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { printDataURL } from '../lib/printer'

export default function Result() {
  const navigate = useNavigate()
  const { resultImage } = useAppStore()

  // 해당 페이지가 result/${index}로 접속하게 되면 해당 index를 서버로 보내고, resultImg를 받아서 보여줌
  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      {!resultImage ? (
        <p>
          결과 이미지가 없습니다.{' '}
          <button onClick={() => navigate('/selectImage')}>이미지 합성하러 가기</button>
        </p>
      ) : (
        <>
          <img
            src={resultImage}
            alt="result"
            style={{
              maxWidth: '90%',
              border: '2px solid #ccc',
              borderRadius: 8,
              marginTop: 20,
            }}
          />

          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '10px 20px',
                fontSize: '18px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              돌아가기
            </button>

            {/* 프린트 버튼: Electron 환경에서 즉시 인쇄 */}
            <button
              onClick={() => {
                if (resultImage) {
                  void printDataURL(resultImage) // copies 값 필요하면 두 번째 인자에 숫자 전달
                }
              }}
              style={{
                marginLeft: 12,
                padding: '10px 20px',
                fontSize: '18px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              프린트
            </button>
          </div>
        </>
      )}
    </div>
  )
}
