import { BrowserRouter, Route, Routes } from "react-router-dom"
import TicketForm from "./pages/TicketForm"


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicketForm/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App