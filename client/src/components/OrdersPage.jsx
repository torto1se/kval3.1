import { useEffect, useState } from "react";

function OrdersPage() {
  const [data, setData] = useState([])
  const [statuses, setStatuses] = useState([])
  const [products, setProducts] = useState([])
  const id_role = localStorage.getItem('id_role')

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchStatuses();
  }, [])

  const fetchOrders = async () => {
    const response = await fetch('http://localhost:3001/orders', {
      method: 'get',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    const data = await response.json();
    if(response.ok){
      setData(data)
    } else {
      console.log(data.message);
    }
  }

  const fetchProducts = async () => {
    const response = await fetch('http://localhost:3001/product', {
      method: 'get',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    const data = await response.json();
    if(response.ok){
      setProducts(data)
    } else {
      console.log(data.message);
    }
  }

  const fetchStatuses = async () => {
    const response = await fetch('http://localhost:3001/statuses', {
      method: 'get',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    const data = await response.json();
    if(response.ok){
      setStatuses(data)
    } else {
      console.log(data.message);
    }
  }

  const updStatus = async (id, id_status) => {
    const response = await fetch(`http://localhost:3001/order/${id}`, {
      method: 'put',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`, 'content-type': 'application/json'},
      body: JSON.stringify({id_status})
    })
    const data = await response.json();
    if(response.ok){
      console.log(data.message);
      fetchOrders();
    } else {
      console.log(data.message);
    }
  }

  return (
    <>
      <div>
        <table>
          <thead>
            <tr>
              <th>id Заказа</th>
              <th>Пользователь</th>
              <th>Продукт</th>
              <th>Статус</th>
              <th>Кол-во</th>
              <th>Адресс</th>
              <th>Дата и время</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <tr key={order.id_order}>
                <td>{order.id_order}</td>
                <td>Пользователь #{order.id_user}</td>
                <td>{products.find((item) => item.id_product === order.id_product)?.name || 'Неизвестно'}</td>
                <td>{id_role === '2' ? (
                  <select value={order.id_status} onChange={(e) => updStatus(order.id_order, e.target.value)}>
                    <option value="1">Новый</option>
                    <option value="2">Подтверждён</option>
                    <option value="3">Отменен</option>
                  </select>
                ) : (statuses.find((item) => item.id_status === order.id_status)?.name || 'Неизвестно')}</td>
                <td>{order.quantity}</td>
                <td>{order.delivery_address}</td>
                <td>{order.order_date }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default OrdersPage;