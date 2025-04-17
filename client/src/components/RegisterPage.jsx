import { useState } from "react";

function RegisterPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [patronymic,  setPatronymic] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const handleReg = async () => {
    if(!login || !password || !name || !surname || !patronymic || !phone || !email){
      console.log('Заполните все поля');
      return
    }
    const response = await fetch('http://localhost:3001/register', {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({login, password, name, surname, patronymic, phone, email})
    })
    const data = await response.json()
    if(response.ok){
      console.log('Регистрация');
      setEmail('')
      setLogin('')
      setName('')
      setPassword('')
      setPatronymic('')
      setPhone('')
      setSurname('')
    } else {
      console.log(data.message);
    }
  }
  return (
    <>
      <div>
        <input type="text" placeholder="Логин" value={login} onChange={e=> setLogin(e.target.value)}/>
        <input type="text" placeholder="Фамилия" value={surname} onChange={e=> setSurname(e.target.value)}/>
        <input type="text" placeholder="Имя" value={name} onChange={e=> setName(e.target.value)}/>
        <input type="text" placeholder="Отчество" value={patronymic} onChange={e=> setPatronymic(e.target.value)}/>
        <input type="text" placeholder="Почта" value={email} onChange={e=> setEmail(e.target.value)}/>
        <input type="text" placeholder="Номер" value={phone} onChange={e=> setPhone(e.target.value)}/>
        <input type="password" placeholder="Пароль" value={password} onChange={e=> setPassword(e.target.value)}/>
        <button onClick={handleReg}>Зарегистрироваться</button>
      </div>
    </>
  );
}

export default RegisterPage;