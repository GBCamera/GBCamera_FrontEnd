import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SelectFrame from './pages/SelectFrame'
import TakePicture from './pages/TakePicture'
import SelectImage from './pages/SelectImage'
import Result from './pages/Result'

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/selectFrame" element={<SelectFrame />} />
        <Route path="/takePicture" element={<TakePicture />} />
        <Route path="/selectImage" element={<SelectImage />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </div>
  )
}
