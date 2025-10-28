import { useNavigate } from 'react-router-dom'

export default function Result() {
    const navigate = useNavigate()

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>결과 페이지</h1>
        <p>결과를 확인하고, 다시 홈으로 돌아갈 수 있습니다.</p>
        <button
            onClick={() => navigate('/')}
            style={{
            padding: '10px 20px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: 'pointer',
            }}
        >
            홈으로 돌아가기
        </button>
        </div>
    )
}
