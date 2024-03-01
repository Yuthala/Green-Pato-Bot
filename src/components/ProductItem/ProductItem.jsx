import React from "react";
import Button from "../Button/Button";
import './ProductItem.css';
import IncDecCounter from './../IncDecCounter/IncDecCounter';

const ProductItem = ({product, className, onAdd, increaseQty})=> {

	const onAddHandler = () => {
		onAdd(product);
	}
 
	return (
		<div className={'product' + className}>
			<div className={'img'}><img src={product.img}/></div>
			<div className={'title'}>{product.title}</div>
			<div className={'description'}>{product.description}</div>
			<div className={'price'}><span>Стоимость: <b>{product.price}</b></span>
			<IncDecCounter increaseQty={increaseQty}/>
		</div>
			<Button className={'add-btn'} onClick={onAddHandler}>
				Добавить в корзину
			</Button>
		</div>
	);
};

export default ProductItem;