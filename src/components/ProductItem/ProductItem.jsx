import React from "react";
import Button from "../Button/Button";
import './ProductItem.css';
import IncDecCounter from '../Counter/IncDecCounter';



const ProductItem = ({product, className, onAdd})=> {

	const onAddHandler = () => {
		onAdd(product);
	}
 

	return (
		<div className={'product' + className}>
			<div className={'img'}><img src={product.img}/></div>
			<div className={'title'}>{product.title}</div>
			<div className={'description'}>{product.description}</div>
			<div className={'price'}><span>Цена: <b>{product.price}</b></span><span> р.</span>
			{/* <div className='count'>
				<div className="count_box">
					<input type="number" className="count_input" min="1" max="10"/>
				</div>
				<div className="controls">
					<button type="button" className="count_up">⌃</button>
					<button type="button" className="count_down">⌄</button>
				</div>
			</div> */}
			<IncDecCounter />
		</div>
			<Button className={'add-btn'} onClick={onAddHandler}>
				Добавить в корзину
			</Button>
		</div>
	);
};

export default ProductItem;