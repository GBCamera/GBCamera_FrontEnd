import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Home Page</h1>
        <p>메인 화면입니다.</p>
        <button
            onClick={() => navigate('/selectFrame')}
            style={{
            padding: '10px 20px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: 'pointer',
            }}
        >
            프레임 선택으로 이동
        </button>
        </div>
    )
}
