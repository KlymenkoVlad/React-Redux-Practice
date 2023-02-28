export const heroesFetching = () => {
    return {
        type: 'HEROES_FETCHING'
    }
}

export const heroesFetched = (heroes) => {
    return {
        type: 'HEROES_FETCHED',
        payload: heroes
    }
}

export const heroesFetchingError = () => {
    return {
        type: 'HEROES_FETCHING_ERROR'
    }
}

export const setFilters = (filters) => {
    return { 
        type: 'SET_FILTERS', 
        payload: filters 
    }
}

export const setCurrentFilter = (filter) => {
    return { 
        type: 'SET_CURRENT_FILTER', 
        payload: filter 
    }
}

  