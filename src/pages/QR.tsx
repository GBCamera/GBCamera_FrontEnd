// src/pages/Result.tsx
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'


//여기서는 result/${index}로 이동 가능한 qr 코드 보여주기.
export default function QR() {
    const navigate = useNavigate()
    const { resultImage } = useAppStore()

    return (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
        {!resultImage ? (
            <p>결과 이미지가 없습니다. <button onClick={() => navigate('/selectImage')}>이미지 합성하러 가기</button></p>
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
            </>
        )}
        </div>
    )
}
