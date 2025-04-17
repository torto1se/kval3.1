import { useEffect, useState } from "react";
import Card from "./Card";

function CreatePage() {
  const [data, setData] = useState([])
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [delivery_address, setDelivery_address] = useState('')
  const [id_product, setId_product] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async() => {
    const response = await fetch('http://localhost:3001/product', {
      method: 'get',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    const data = await response.json()
    if(response.ok){

      setData(data)
    } else {
      console.log(data.message);
    }
  }

    const createOrder = async() => {
    if(!id_product || !delivery_address || !quantity){
      console.log('Заполните все поля!');
      return
    }
    
    const curDate = new Date().toLocaleString();
    const response = await fetch('http://localhost:3001/create', {
      method: 'post',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`, 'content-type':'application/json'},
      body: JSON.stringify({quantity, delivery_address, id_product, order_date: curDate})
    })
    const data = await response.json()
    if(response.ok){
      console.log(data.message);
      setDelivery_address('')
      setQuantity(1)
      setId_product('')
      setName('')
    } else {
      console.log(data.message);
    }
  }


  const handleAdd = (product) => {
    setName(product.name);
    setId_product(product.id_product)
    console.log(product.id_product);
  }

  const handleDel = () => {
    setName('')
    setId_product('')
    setDelivery_address('')
    setQuantity(1);
  }
  return (
    <>
      <div>
        <input type="text" value={name} disabled placeholder="Продукт" onChange={e => setName(e.target.value)}/>
        <input type="number" min='1' value={quantity} placeholder="" onChange={e => setQuantity(e.target.value)}/>
        <input type="text" value={delivery_address} placeholder="" onChange={e => setDelivery_address(e.target.value)}/>
        <button onClick={createOrder}>Создать</button>
        <button onClick={handleDel}>Очистить</button>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '15px'}}>
        {data.map(product => (
          <Card key={product.id_product} product={product} handleAdd={handleAdd} />
        ))}
        </div>
      </div>
    </>
  );
}

export default CreatePage;