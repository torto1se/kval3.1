import React from "react";

function Card({product, handleAdd}) {
  return (
    <div>
      <img src={`/images/product${product.id_product}.jpg`} alt={product.name}  style={{width: '150px', height: '150px'}}/>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <button onClick={() => handleAdd(product)}>Добавить</button>
    </div>
  );
}

export default Card;