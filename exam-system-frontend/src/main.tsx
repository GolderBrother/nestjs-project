import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

createRoot(document.getElementById('root')!).render(
  // 在最外层加一下 DndProvider，这是 react-dnd 用来跨组件通信的
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>,
)
