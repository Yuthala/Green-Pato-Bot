import React, {useEffect, useState, useCallback} from "react";
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
import { orderCartData } from '../../hooks/CustomerData';


// TODO:Вынести в базу данных
const products = [
	{id: '1', title: 'Картофель', price: 75, description: 'сорт Импала, кг', img: "img/potatoes.jpg", count: 1},
	{id: '2', title: 'Томаты', price: 150, description: 'сорт Розовые, кг', img: "img/tomatoes.jpg", count: 1},
	{id: '3', title: 'Баклажаны', price: 80, description: 'сорт Алмаз, кг', img: "img/eggplant.jpg", count: 1},
	{id: '4', title: 'Огруцы', price: 120, description: 'сорт ТСХ, 600 г', img: "img/cucumber.jpg", count: 1}
]

// Подсчёт стоимости всех товаров в массиве с учётом количества
const getTotalPrice = (items = []) => {
	return items.reduce((acc, item) => {
		return acc += item.price * item.count
	}, 0)
}

//  1 Создание объекта Product list(Список Товаров)
const ProductList = () => {

	// 1.1 Константы для отслеживания состояния объектов
	// Отслеживается объект addedItems
	const [addedItems, setAddedItems] = useState([]);
	// Отслеживание объекта tg 
	const {tg, queryId} = useTelegram();

	// 1.2 Передача данных в Telegram --
	const onSendData = useCallback(() => {
		// Объект для передачи в Telegram
        const data = {
            products: addedItems,
			totalPrice: getTotalPrice(addedItems),
			queryId
        }
		 orderCartData = data
	//tg.sendData(JSON.stringify(data));
    }, [addedItems])

	useEffect( ()=> {
		tg.onEvent('mainButtonClicked', onSendData)
		window.location.href = "https://greenpatobot.netlify.app/form"
			// return ()=> {
			// 	tg.offEvent('mainButtonClicked', onSendData)
			// }
		}, [onSendData])
	

	//КОРЗИНА
	//функция увеличения количества товара в корзине
		const increase = (product) => {

			// setAddedItems((addedItems) => {
			// 	return addedItems.map((product) => {
			// 		if (product.id === id) {
			// 			return {
			// 				...product,
			// 					count: product.count + 1,
			// 			};
			// 		}
			// 		return product;
			// 	})
			// })
		}

	//КОРЗИНА
	//функция уменьшения количества товара в корзине
	const decrease = (product) => {

		// setAddedItems((addedItems) => {
		// 	return addedItems.map((product) => {
		// 		if (product.id === id) {;

		// 			return {
		// 				...product,
		// 					count: product.count - 1 < 1 ? product.count - 1 : 1,
		// 			};
		// 		}
		// 		return product;
		// 	})
		// })
	}

	const onAdd = (product) => { // TODO: Add Count Increase Decrease logic
		const alreadyAdded = addedItems.find(item => item.id === product.id);
		let newItems = [];
		
		if(alreadyAdded) {
			//newItems = addedItems.filter(item => item.count += 1);
		const foundItem = addedItems.find(function(item) {
			return item.id === product.id
		})
		foundItem.count += 1
		newItems = addedItems

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
			{products.map(product => (
				<ProductItem
					product={product}
					key={product.id}
					onAdd={onAdd}
					increase={increase}
					decrease={decrease}
					className={'item'}
					count={product.count}
				/>
			))}
		</div>
	);
};

export default ProductList;