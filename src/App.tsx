import { Routes, Route } from 'react-router-dom'
import Result from './pages/Result'
import backgroundImg from './image/background.jpg'

// 배포(프로덕션) 환경에서 콘솔 전부 비활성화 (Vite)
// if (import.meta.env.PROD) {
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   console.log = () => {}
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   console.warn = () => {}
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   console.error = () => {}
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   console.info = () => {}
// }

export default function App() {
  return (
    <div
      style={{
        position: 'fixed',           // ✅ 화면 전체 덮기
        inset: 0,                    // top, right, bottom, left = 0
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',     // ✅ 화면 비율에 맞게 꽉 채우기
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '90vw',                    // ✅ 화면 너비의 90%
          height: '85vh',                   // ✅ 화면 높이의 85%
          backgroundColor: 'rgba(255, 255, 255, 0.0)', // ✅ 완전 투명
          borderRadius: '20px',
          border: '2px solid rgba(0, 0, 0, 0.8)',       // ✅ 검정색 외곽선
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',   // 살짝 그림자 (입체감 유지)
          padding: '24px',
          overflowY: 'auto',
        }}
      >
        <Routes>
          <Route path="/" element={<Result />} />
          <Route path="/:index" element={<Result />} />
        </Routes>
      </div>
    </div>
  )
}
