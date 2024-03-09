import React, {useEffect, useState, useCallback} from "react";
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";
import { orderCartData } from '../../hooks/CustomerData';

// 1 Создание объекта "Форма(Form)"
const Form =() => {

	//  1.1 Костанты для отслеживания состояния объектов ... с использованием useState()
	// Объект name из формы
	const [name, setname] = useState('');
	// Объект street из формы
	const [street, setStreet] = useState('');
	// Объект phone из формы
	const [phone, setPhone] = useState('');
	// Объект tg
	const {tg} = useTelegram();

	// 1.2 Передача данных в Telegram, TODO: Что такое Use callback??
    const onSendData = useCallback(() => {
		// Объект для передачи в Telegram
        const data = {
            name,
            street,
            phone,
			orderCartData
        }
		
		// 1.3 Вызов функции передачи объекта в Telegram 
        tg.sendData(JSON.stringify(data));
    }, [name, street, phone]) // TODO - Зачем нужен массив в useCallBack??

	useEffect( ()=> {
		tg.onEvent('mainButtonClicked', onSendData)
			return ()=> {
				tg.offEvent('mainButtonClicked', onSendData)
			}
		}, [onSendData])

	//цвет, текст кнопки, TODO: Что такое useEffect ??
	// 1.4 Установка текста для Главной кнопки
	useEffect( () => {
		tg.MainButton.setParams( {
			text: 'Отправить данные'
		})
	}, [])

	// 1.5 Отслеживание значений в элементах Формы, чтобы показать или скрыть Главную кнопку
	useEffect( () => {
		// TODO: изменить на tg.onToggleButton?? Протестировать!!
		if(!street || !name) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
		}
	}, [name, street])

	// 1.6 Как обработать изменение значения объектов в Форме
	const onChangeName = (e) => {
		setname(e.target.value)
	}

	const onChangeStreet= (e) => {
		setStreet(e.target.value)
	}

	const onChangePhone = (e) => {
		setPhone(e.target.value)
	}

	// Отрисовка Формы на странице
	return (
		<div className={"form"}>
			<h3>Введите ваши данные</h3>

			<input 
				className={'input'} 
				type="text" 
				placeholder={'Ваше имя'}
				value={name}
				onChange={onChangeName}
			/>
			<input 
				className={'input'} 
				type="phone" 
				placeholder={'Телефон'}
				value={phone}
				onChange={onChangePhone}
			/>

			<input
				className={'input'} 
				type="text" 
				placeholder={'Адрес'}
				value={street}
				onChange={onChangeStreet}
			/>
{/* 
			<select value={phone} onChange={onChangephone} className={'select'}>
				<option value={'physical'}>Физ. лицо</option>
				<option value={'legal'}>Юр. лицо</option>
			</select> */}
		</div>
	);
};

export default Form;