import React from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
import { useCallback, useEffect, useState } from 'react';

//Вынести в базу данных
const products = [
	{id: '1', title: 'Картофель', price: 75, description: 'сорт Импала, кг', img: "https://yandex.ru/images/search?from=tabbar&img_url=https%3A%2F%2Fsveklon.ru%2Fwp-content%2Fuploads%2F2018%2F01%2Fisolated-potatoes.jpeg&lr=213&pos=29&rpt=simage&text=%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B5%D0%BB%D1%8C%20%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8"},
	{id: '2', title: 'Томаты', price: 150, description: 'сорт Розовые, кг', img: "https://yandex.ru/images/search?img_url=https%3A%2F%2Fhortis.info%2Fwp-content%2Fuploads%2F2017%2F06%2FTomato-pink-Brandywine-1960x1176-retina.jpg&lr=213&pos=1&rpt=simage&source=serp&text=%D1%82%D0%BE%D0%BC%D0%B0%D1%82%20%D1%80%D0%BE%D0%B7%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8"},
	{id: '3', title: 'Баклажаны', price: 80, description: 'сорт Алмаз, кг', img: "https://yandex.ru/images/search?img_url=https%3A%2F%2Fimg-s2.onedio.com%2Fid-5c41b07e5e06bdde37847f07%2Frev-0%2Fw-1200%2Fh-631%2Ff-jpg%2Fs-b48f695d4693818414f5b5963bb98c7944d507f4.jpg&lr=213&pos=15&rpt=simage&text=%D0%B1%D0%B0%D0%BA%D0%BB%D0%B0%D0%B6%D0%B0%D0%BD%20%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8"},
	{id: '4', title: 'Огруцы', price: 120, description: 'сорт ТСХ, 600 г', img: "../../img/cucmber.jpg"},
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
        fetch('http://localhost:8000', { //указать актуальный публичный IP-адрес сервера, где лежит бот, и /web-data (в данном примере) - взять эндпоинт из строки app.post первый аргумент
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
		</div>
	);
};

export default ProductList;