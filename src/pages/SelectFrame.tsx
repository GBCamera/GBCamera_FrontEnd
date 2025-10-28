import { useNavigate } from 'react-router-dom'

export default function SelectFrame() {
    const navigate = useNavigate()

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>프레임 선택 페이지</h1>
        <p>여기서 프레임을 선택할 수 있습니다.</p>
        <button
            onClick={() => navigate('/takePicture')}
            style={{
            padding: '10px 20px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: 'pointer',
            }}
        >
            사진 찍기 화면으로 이동
        </button>
        </div>
    )
}
