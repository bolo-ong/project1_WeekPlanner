import { Route, Routes } from 'react-router-dom';
import './App.css';
import Service from './pages/Service';
import Posts from './pages/Posts';
import Main from './pages/Main';
import SignInProvider from './contexts/SignInCheckContext/SignInCheckProvider';


function App() {
  return (
    <SignInProvider>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/service' element={<Service />} />
        <Route path='/posts' element={<Posts />} />
        <Route path='*' element={<div>404</div>} />
      </Routes>
    </SignInProvider>

  )
}

export default App;
