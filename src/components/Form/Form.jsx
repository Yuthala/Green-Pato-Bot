import React, {useEffect, useState, useCallback} from "react";
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";

const Form =() => {

	const [name, setname] = useState('');
	const [street, setStreet] = useState('');
	const [phone, setPhone] = useState('');
	const {tg} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            name,
            street,
            phone
        }
        tg.sendData(JSON.stringify(data));
    }, [name, street, phone])

	useEffect( ()=> {
		tg.onEvent('mainButtonClicked', onSendData)
			return ()=> {
				tg.offEvent('mainButtonClicked', onSendData)
			}
		}, [onSendData])

	//цвет, текст кнопки
	useEffect( () => {
		tg.MainButton.setParams( {
			text: 'Отправить данные'
		})
	}, [])

	useEffect( () => {
		if(!street || !name) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
		}
	}, [name, street])

	const onChangeName = (e) => {
		setname(e.target.value)
	}

	const onChangeStreet= (e) => {
		setStreet(e.target.value)
	}

	const onChangePhone = (e) => {
		setPhone(e.target.value)
	}

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