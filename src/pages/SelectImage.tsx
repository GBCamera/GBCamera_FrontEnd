import { useNavigate } from 'react-router-dom'

export default function SelectImage() {
    const navigate = useNavigate()

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>이미지 선택 페이지</h1>
        <p>촬영한 이미지나 저장된 사진을 선택합니다.</p>
        <button
            onClick={() => navigate('/result')}
            style={{
            padding: '10px 20px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: 'pointer',
            }}
        >
            결과 페이지로 이동
        </button>
        </div>
    )
}
