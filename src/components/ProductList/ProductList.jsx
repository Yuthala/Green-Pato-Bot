import React from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
import { useCallback, useEffect, useState } from 'react';

const products = [
	{id: '1', title: 'Potatoes', price: 75, description: 'сорт Импала'},
	{id: '2', title: 'Tomatoes', price: 150, description: 'сорт Розовые'},
	{id: '3', title: 'Баклажаны', price: 80, description: 'сорт Алмаз'},
	{id: '4', title: 'Cucumbers', price: 120, description: 'сорт ТСХ'},
]

const getTotalPrice = (items = []) => {
	return items.reduce((acc, item) => {
		return acc += item.price
	}, 0)
}

const ProductList = () => {
	const [addedItems, setAddedItems] = useState([]);
	const {tg, queryId} = useTelegram();

	const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
			totalPrice: getTotalPrice(addedItems),
			queryId
        }
        fetch('http://localhost:8000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})
    }, [])

	useEffect( ()=> {
		tg.onEvent('mainButtonClicked', onSendData)
			return ()=> {
				tg.offEvent('mainButtonClicked', onSendData)
			}
		}, [onSendData])

	const onAdd = (product) => {
		const alreadyAdded = addedItems.find(item => item.id === product.id);
		let newItems = [];

		if(alreadyAdded) {
			newItems = addedItems.filter(item => item.id !== product.id);
		} else {
			newItems = [...addedItems, product];
		}

		setAddedItems(newItems)

		if(newItems.length === 0) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
			tg.MainButton.setParams({
				text: `Купить ${getTotalPrice(newItems)}`
			})
		}
	}

	return (
		<div className={'list'}>
			{products.map(item => (
				<ProductItem
					product={item}
					onAdd={onAdd}
					className={'item'}
				/>
			))}
			Product List
		</div>
	);
};

export default ProductList;