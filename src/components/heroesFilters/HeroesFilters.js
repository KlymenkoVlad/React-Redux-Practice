import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentFilter } from '../../actions';
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const { filters} = useSelector(state => state);
    const dispatch = useDispatch();

    const [activeButton, setActiveButton] = useState(null);

    const onFilter = (event) => {
        event.preventDefault();
        setActiveButton(event.target.value);
        dispatch(setCurrentFilter(event.target.value))
    }

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {
                        filters.length !== 0 ? filters.map((filter) => {
                            return <button key={filter.value} onClick={onFilter} value={filter.value} className={`${filter.classes} ${activeButton === filter.value ? 'active' : ''}`}>{filter.title}</button>
                        }) : <Spinner/>
                    }
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;