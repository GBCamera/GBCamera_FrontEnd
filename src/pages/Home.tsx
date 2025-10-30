import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function Home() {
    const navigate = useNavigate()
    const reset = useAppStore((s) => s.reset)


    //여기서 start 버튼을 누르면 api 통신해서 암호화된 사용자 정보 받기 =>setIndex
    return (
        <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            position: 'relative', // ✅ 버튼 위치 고정을 위해 추가
        }}
        >
        {/* ⚙️ 설정 버튼 */}
        <button
            onClick={(e) => {
            e.stopPropagation() // ✅ 부모 버튼 클릭 방지
            navigate('/setting')
            }}
            style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '36px', // ✅ 더 크게
            }}
        >
            ⚙️
        </button>

        {/* 시작 버튼 */}
        <button
            onClick={() => {
            reset()
            navigate('/selectFrame')
            }}
            style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            fontWeight: 600,
            textAlign: 'center',
            }}
        >
            <p style={{ margin: 0, lineHeight: 1.2, color: 'black' }}>인생네컷</p>
            <p
            style={{
                marginTop: '40px',
                fontSize: '20px',
                opacity: 0.8,
                color: 'black',
            }}
            >
            시작하기
            </p>
        </button>
        </div>
    )
}
