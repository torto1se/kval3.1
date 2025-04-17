import { useState } from "react";

function LoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')


  const handleLogin = async () => {
    if(!login || !password){
      console.log('Заполните все поля');
      return
    }
    const response = await fetch('http://localhost:3001/login', {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({login, password})
    })
    const data = await response.json()
    if(response.ok){
      console.log('Вход');
      localStorage.setItem('token', data.token)
      localStorage.setItem('id_user', data.id_user)
      localStorage.setItem('login', data.login)
      localStorage.setItem('id_role', data.id_role)
      setLogin('')
      setPassword('')
    } else {
      console.log(data.message);
    }
  }
  return (
    <>
      <div>
        <input type="text" placeholder="Логин" value={login} onChange={e=> setLogin(e.target.value)}/>
        <input type="password" placeholder="Пароль" value={password} onChange={e=> setPassword(e.target.value)}/>
        <button onClick={handleLogin}>Войти</button>
      </div>
    </>
  );
}

export default LoginPage;