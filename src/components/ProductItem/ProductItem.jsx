import React, { useState }from "react";
import Button from "../Button/Button";
import './ProductItem.css';
// import IncDecCounter from './../IncDecCounter/IncDecCounter';
// import Count from './../Count/Count';
// import QtyField from "../Counter/QtyField/QtyField";
// import PlusButton from "../Counter/PlusButton/PlusButton";


	const ProductItem = ({ product, className, onAdd, onRemove })=> {
		const [count, setCount] = useState(0);

		const { img, title, description, price, id } = product;

		// const onAddHandler = () => {
		// 	onAdd(product);
		// }

		const handleIncrement = () => {
			setCount(count+1);
			onAdd(product);
		}

		const handleDecrement = () => {
			setCount(count-1);
			onRemove(product);
		}

	return (
		<div className={'product' + className}>
			{/* поле с количеством */}
			<span className={`${count !== 0 ? "card__badge" : "card__badge--hidden"}`}
	  	>{count}</span>

			<div className={'img'}><img src={img}/></div>
			<div className={'title'}>{title}</div>
			<div className={'description'}>{description}</div>
			<div className={'price'}><span>Цена: <b>{price}</b> р.</span></div>

			{/* контейнер с кнопками + - */}
			<div className="btn-container">
				<Button title={'+'} type={'add'} onClick={handleIncrement} />

				{count !== 0 ? (
				<Button title={'-'} type={'remove'} onClick={handleDecrement} />
				) : ""}
			</div>
		</div>
	)
};


export default ProductItem;