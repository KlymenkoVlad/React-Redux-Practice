import {useHttp} from '../../hooks/http.hook';
import { useEffect, useMemo, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import './heroesList.scss'

import { heroesFetching, heroesFetched, heroesFetchingError } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const { heroes, heroesLoadingStatus, currentFilter } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();    
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
    if (heroes.length > 0) {
        setIsLoaded(true);

    } 
    }, [heroes]);

    const filteredHeroes = useMemo(() => {
        if (currentFilter === null || currentFilter === "all") {
          return heroes;
        } else {
          return heroes.filter(hero => hero.element === currentFilter);
        }
      }, [currentFilter, heroes]);
  
    useEffect(() => {
        dispatch(heroesFetching());
            request("http://localhost:3001/heroes")
                .then(data => dispatch(heroesFetched(data)))
                .catch(() => dispatch(heroesFetchingError()));
    }, [dispatch, request]);
  
    const onDelete = async (id) => {
      dispatch(heroesFetched(heroes.filter(element => element.id !== id)));
      request(`http://localhost:3001/heroes/${id}`, 'DELETE')
        .catch(() => new Error('smth went wrong'))
    };

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition key={id} appear timeout={500} classNames="item">
                    <HeroesListItem key={id} {...props} onDelete={onDelete} id={id} />
                </CSSTransition>
            )
        })
        
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            <TransitionGroup component={null}>
                {isLoaded && elements}
            </TransitionGroup>
        </ul>
    )
}

export default HeroesList;