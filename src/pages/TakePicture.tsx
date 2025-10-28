import { useNavigate } from 'react-router-dom'

export default function TakePicture() {
    const navigate = useNavigate()

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>사진 촬영 페이지</h1>
        <p>여기서 사진을 찍습니다.</p>
        <button
            onClick={() => navigate('/selectImage')}
            style={{
            padding: '10px 20px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: 'pointer',
            }}
        >
            이미지 선택으로 이동
        </button>
        </div>
    )
}
