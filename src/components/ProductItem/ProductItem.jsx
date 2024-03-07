import React from "react";
import Button from "../Button/Button";
import './ProductItem.css';
// import IncDecCounter from './../IncDecCounter/IncDecCounter';
import Count from './../Count/Count';


	const ProductItem = ({ product, className, onAdd, increase, decrease})=> {

	const { img, title, description, price, count, id } = product;

	const onAddHandler = () => {
		onAdd(product);
	}

	return (
		<div className={'product' + className}>
			<div className={'img'}><img src={img}/></div>
			<div className={'title'}>{title}</div>
			<div className={'description'}>{description}</div>
			<div className={'price'}><span>Цена: <b>{price}</b></span><span> р.</span>
			{/* <div className='count'>
				<div className="count_box">
					<input type="number" className="count_input" min="1" max="10" value={count}/>
				</div>
				<div className="controls">
					<button type="button" className="count_up">⌃</button>
					<button type="button" className="count_down">⌄</button>
				</div>
			</div> */}
			{/* <IncDecCounter increaseQty={increaseQtyHandler}/> */}
			<Count 
				count={count} 
				increase={increase} 
				decrease={decrease} 
				id={id}
				//changeValue={changeValue}
			/>

		</div>
			<Button className={'add-btn'} onClick={onAddHandler}>
				Добавить в корзину
			</Button>
		</div>
	);
};

export default ProductItem;