import logo from './logo.svg';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CreatePage from './components/CreatePage';
import OrdersPage from './components/OrdersPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate to={'/login'} />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='/create' element={<CreatePage />}/>
        <Route path='/orders' element={<OrdersPage />}/>
      </Routes>
    </div>
  );
}

export default App;
