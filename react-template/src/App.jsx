import {Routes,Route} from 'react-router-dom';
import {Home} from "./ui/pages/home/Home.jsx";
import Login from './ui/pages/login/Login.jsx';
import UserHomePage from './ui/pages/Defficency_Check/User_check.jsx';


function App() {

  return (
    <>
      <Routes>
        <Route path={'/'} element={<Home/>}/>
        <Route path="/see" element={<Login/>}/>
        <Route path="/check" element={<UserHomePage/>}/>
      </Routes>

    </>
  )
}

export default App
