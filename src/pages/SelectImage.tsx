// src/pages/SelectImage.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

type Slot = { x: number; y: number; w: number; h: number }

// ✅ 프레임 원본 비율(1181 × 1772)
const FRAME_W = 1181
const FRAME_H = 1772
const FRAME_ASPECT = FRAME_W / FRAME_H // ≈ 0.6667


//finish 버튼을 누르면 서버로 resultImg와 index 보내기.
export default function SelectImage() {
    const navigate = useNavigate()
    const { images, frame, setResultImage } = useAppStore()

    const leftPaneRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const frameImgRef = useRef<HTMLImageElement | null>(null)

    const [isReady, setIsReady] = useState(false)      // 프레임 로드 완료
    const [placed, setPlaced] = useState<number[]>([]) // 클릭된 이미지 인덱스(최대 4)
    const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map())

    const framePath = frame ? `/src/image/${frame}.png` : null

    // 슬롯(좌상→우상→좌하→우하) — 비율 좌표
    const layout: Slot[] = useMemo(() => {
        const table: Record<string, Slot[]> = {
        '1': [
            { x: 0.085, y: 0.145, w: 0.33, h: 0.31 },
            { x: 0.395, y: 0.145, w: 0.33, h: 0.31 },
            { x: 0.085, y: 0.535, w: 0.33, h: 0.31 },
            { x: 0.395, y: 0.535, w: 0.33, h: 0.31 },
        ],
        '2': [
            { x: 0.085, y: 0.20, w: 0.28, h: 0.36 },
            { x: 0.59,  y: 0.20, w: 0.28, h: 0.36 },
            { x: 0.085, y: 0.87, w: 0.28, h: 0.36 },
            { x: 0.59,  y: 0.87, w: 0.28, h: 0.36 },
        ],
        }
        return table[frame || '1'] || table['1']
    }, [frame])

    // 유틸
    const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
        })

    const blobToDataURL = (blob: Blob): Promise<string> =>
        new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(String(reader.result))
        reader.onerror = reject
        reader.readAsDataURL(blob)
        })

    // ✅ 캔버스 크기를 왼쪽 패널에 맞추되, 프레임 비율(1181×1772)을 유지해 최대 크기로 맞춤
    const sizeCanvasToContainer = () => {
        const canvas = canvasRef.current
        const host = leftPaneRef.current
        if (!canvas || !host) return { cssW: 0, cssH: 0 }

        const availW = host.clientWidth
        const availH = host.clientHeight

        // 세로에 우선 맞추고, 가로가 넘치면 가로 기준으로 재계산
        let cssH = availH
        let cssW = Math.round(cssH * FRAME_ASPECT)
        if (cssW > availW) {
        cssW = availW
        cssH = Math.round(cssW / FRAME_ASPECT)
        }

        const dpr = Math.max(1, window.devicePixelRatio || 1)

        canvas.width  = Math.max(1, Math.floor(cssW * dpr))
        canvas.height = Math.max(1, Math.floor(cssH * dpr))
        canvas.style.width  = `${cssW}px`
        canvas.style.height = `${cssH}px`

        const ctx = canvas.getContext('2d')
        if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.imageSmoothingEnabled = true
        }
        return { cssW, cssH }
    }

    // 전체 리드로우(선택 이미지들 → 프레임)
    const redraw = async () => {
        const canvas = canvasRef.current
        const frameImg = frameImgRef.current
        if (!canvas || !frameImg) return

        const { cssW, cssH } = sizeCanvasToContainer()
        if (!cssW || !cssH) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, cssW, cssH)
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, cssW, cssH)

        for (let i = 0; i < Math.min(placed.length, 4); i++) {
        const idx = placed[i]
        const src = images[idx]
        if (!src) continue

        let imgEl = imageCacheRef.current.get(idx)
        if (!imgEl) {
            try {
            imgEl = await loadImage(src)
            imageCacheRef.current.set(idx, imgEl)
            } catch {
            continue
            }
        }

        const slot = layout[i]
        const dx = Math.round(cssW * slot.x)
        const dy = Math.round(cssH * slot.y)
        const dw = Math.round(cssW * slot.w)
        const dh = Math.round(cssH * slot.h)

        // cover 크롭
        const sRatio = imgEl.width / imgEl.height
        const dRatio = dw / dh
        let sx = 0, sy = 0, sw = imgEl.width, sh = imgEl.height
        if (sRatio > dRatio) {
            sh = imgEl.height
            sw = Math.floor(sh * dRatio)
            sx = Math.floor((imgEl.width - sw) / 2)
            sy = 0
        } else {
            sw = imgEl.width
            sh = Math.floor(sw / dRatio)
            sx = 0
            sy = Math.floor((imgEl.height - sh) / 2)
        }

        ctx.drawImage(imgEl, sx, sy, sw, sh, dx, dy, dw, dh)
        }

        // 프레임은 항상 최상단, 캔버스 전체에 꽉 차게
        ctx.drawImage(frameImg, 0, 0, cssW, cssH)
    }

    // 프레임 로드되면 즉시 표시
    useEffect(() => {
        if (!framePath) return
        const img = new Image()
        img.onload = () => {
        frameImgRef.current = img
        setIsReady(true)
        redraw()
        }
        img.src = framePath
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [framePath])

    // placed가 바뀔 때마다 리드로우(첫 클릭 누락 방지)
    useEffect(() => {
        if (isReady) redraw()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placed, isReady, layout])

    // 리사이즈 대응
    useEffect(() => {
        const onResize = () => redraw()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placed, layout, isReady])

    // 썸네일 클릭: 상태만 변경(최대 4)
    const handlePick = (idx: number) => {
        if (!isReady) return
        if (!images[idx]) return
        setPlaced(prev => (prev.length < 4 ? [...prev, idx] : prev))
    }

    // 저장 후 결과 페이지 이동
    const handleSaveAndGoResult = async () => {
        const canvas = canvasRef.current
        const frameImg = frameImgRef.current

        if (!canvas && frameImg) {
        const temp = document.createElement('canvas')
        temp.width = FRAME_W
        temp.height = FRAME_H
        const tctx = temp.getContext('2d')
        if (tctx) tctx.drawImage(frameImg, 0, 0, FRAME_W, FRAME_H)
        temp.toBlob(async (blob) => {
            if (!blob) return
            const dataURL = await blobToDataURL(blob)
            setResultImage(dataURL)
            navigate('/result')
        }, 'image/jpeg', 0.92)
        return
        }

        if (!canvas) return
        canvas.toBlob(async (blob) => {
        if (!blob) return
        const dataURL = await blobToDataURL(blob)
        setResultImage(dataURL)
        navigate('/result')
        }, 'image/jpeg', 0.92)
    }

    // ----- 렌더 -----
    return (
        <div
        style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            overflow: 'hidden',
            padding: '40px 24px 24px',
            boxSizing: 'border-box',
        }}
        >
        {/* 왼쪽: 캔버스(처음부터 프레임 보임), 프레임 비율 유지 */}
        <div
            ref={leftPaneRef}
            style={{
            flex: '0 0 60%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
            height: '100%',
            minWidth: 0,
            }}
        >
            {!isReady ? (
            <div
                style={{
                color: '#000',
                opacity: 0.8,
                border: '2px dashed #ccc',
                padding: '12px 16px',
                borderRadius: 8,
                }}
            >
                프레임을 불러오는 중...
            </div>
            ) : (
            <canvas
                ref={canvasRef}
                style={{
                width: '100%',
                height: '100%', // 실제 비율 유지 크기는 sizeCanvasToContainer에서 계산
                border: '2px solid #ccc',
                borderRadius: 8,
                background: '#fff',
                boxSizing: 'border-box',
                display: 'block',
                }}
            />
            )}
        </div>

        {/* 오른쪽: 8장 썸네일(스크롤 없음) + 저장 */}
        <div
            style={{
            flex: '0 0 40%',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            gap: '10px',
            overflow: 'hidden',
            }}
        >
            <div
            style={{
                flex: 1,
                minHeight: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRows: 'repeat(4, 1fr)',
                gap: '10px',
                alignItems: 'stretch',
                justifyItems: 'stretch',
                overflow: 'hidden',
                boxSizing: 'border-box',
            }}
            >
            {images.map((img, idx) => (
                <button
                key={idx}
                onClick={() => handlePick(idx)}
                style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: img ? 'pointer' : 'default',
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                }}
                disabled={!img}
                title={img ? `이미지 ${idx + 1} 합성` : '비어 있음'}
                >
                {img ? (
                    <img
                    src={img}
                    alt={`이미지 ${idx + 1}`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: '2px solid #ccc',
                        display: 'block',
                        userSelect: 'none',
                        boxSizing: 'border-box',
                    }}
                    draggable={false}
                    />
                ) : (
                    <div
                    style={{
                        width: '100%',
                        height: '100%',
                        background: '#eee',
                        borderRadius: 8,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 14,
                        color: '#888',
                        border: '2px dashed #ccc',
                        userSelect: 'none',
                        boxSizing: 'border-box',
                    }}
                    draggable={false}
                    >
                    {idx + 1}
                    </div>
                )}
                </button>
            ))}
            </div>

            <div style={{ textAlign: 'center', flex: '0 0 52px' }}>
            <button
                onClick={handleSaveAndGoResult}
                style={{
                height: 52,
                width: '100%',
                fontSize: 18,
                borderRadius: 8,
                cursor: 'pointer',
                }}
            >
                결과 페이지로 이동
            </button>
            </div>
        </div>
        </div>
    )
}
