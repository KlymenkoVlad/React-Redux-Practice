import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { heroesFetching, heroesFetched, heroesFetchingError, setFilters } from '../../actions';
import { v4 as uuidv4 } from 'uuid';
import {useHttp} from '../../hooks/http.hook';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const {heroes, filters} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const [message, setMessage] = useState('');
    const [text, setText] = useState('');
    const [element, setElement] = useState('');
    // const [filters, setFilters] = useState();


    useEffect(() => {
        request("http://localhost:3001/filters")
            .then(data => dispatch(setFilters(data)))
            .catch(() => {throw new Error('unexpected filters getting')});
            // eslint-disable-next-line
    }, [])
    

    const onCharAdd = (event) => {
        event.preventDefault();

        if (element.length < 1) {
            alert('Выберите элемент героя')
            return
        }

        const newHero = {
            id: uuidv4(),
            name: message,
            description: text,
            element: element
        };
        dispatch(heroesFetching());
        request('http://localhost:3001/heroes', 'POST', JSON.stringify(newHero))
        .then(data => {
            dispatch(heroesFetched([...heroes, data]));
        })
        .catch(error => {
            dispatch(heroesFetchingError(error.message)); 
        });
        setMessage('')
        setText('')
        setElement('')
    }
    
    const messageChange = (event) => {
        setMessage(event.target.value);
 
    };

    const textChange = (event) => {
        setText(event.target.value);
    };
    
    const handleElementChange = (event) => {
          setElement(event.target.value);
    };

    return (
        <form onSubmit={onCharAdd} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name"
                    value={message}
                    className="form-control"
                    onChange={messageChange} 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control"
                    onChange={textChange}
                    value={text}  
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={element}
                    onChange={handleElementChange}
                    >
                    <option >Я владею элементом...</option>

                    {
                        filters.length !== 0 ? filters.map((filter) => {
                            return <option key={filter.value} value={filter.value}>{filter.title}</option>
                        }) : <option>Загрузка Фильтров...</option>
                    }

                </select>
            </div>

            <button className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;
