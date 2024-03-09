import React, {useEffect, useState, useCallback} from "react";
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
//import { orderCartData } from '../../hooks/CustomerData';


// TODO:Вынести в базу данных
const products = [
	{id: '1', title: 'Картофель', price: 75, description: 'сорт Импала, кг', img: "img/potatoes.jpg"},
	{id: '2', title: 'Томаты', price: 150, description: 'сорт Розовые, кг', img: "img/tomatoes.jpg"},
	{id: '3', title: 'Баклажаны', price: 80, description: 'сорт Алмаз, кг', img: "img/eggplant.jpg"},
	{id: '4', title: 'Огруцы', price: 120, description: 'сорт ТСХ, 600 г', img: "img/cucumber.jpg"}
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

	const newLocal = 'http://localhost:8000/web-data';

	const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch(newLocal , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

	useEffect( ()=> {
		tg.onEvent('mainButtonClicked', onSendData)
			return ()=> {
				tg.offEvent('mainButtonClicked', onSendData)
			}
		}, [onSendData])

	useEffect( ()=> {
		tg.onEvent('mainButtonClicked', function() {
			window.location.href = "https://greenpatobot.netlify.app/form"
		})
	})

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

	// const onAdd = (product) => { // TODO: Add Count Increase Decrease logic
	// 	const alreadyAdded = addedItems.find(item => item.id === product.id);
	// 	let newItems = [];
		
	// 	if(alreadyAdded) {
	// 		//newItems = addedItems.filter(item => item.count += 1);
	// 	const foundItem = addedItems.find(function(item) {
	// 		return item.id === product.id
	// 	})
	// 	foundItem.count += 1
	// 	newItems = addedItems

	// 	} else {
	// 		newItems = [...addedItems, product];
	// 	}

	const onAdd = (product) => {
		const alreadyAdded = addedItems.find((item) => item.id === product.id);
		let newItems =[];

		if (alreadyAdded) {
			newItems = addedItems.map((item) => 
					item.id === product.id ? {...alreadyAdded, quantity: alreadyAdded.quantity + 1} : item
				)
		} else {
			newItems = [...addedItems, {...product, quantity: 1}];
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

	};

	const onRemove = (product) => {

	};


	return (
		<div className={'list'}>
			{products.map(product => (
				<ProductItem
					product={product}
					key={product.id}
					onAdd={onAdd}
					onRemove={onRemove}
					className={'item'}
				/>
			))}
		</div>
	);
};

export default ProductList;