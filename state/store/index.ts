// Redux
import { createStore, applyMiddleware, Store } from 'redux';
// Middleware
import ReduxLogger from 'redux-logger';
import ReduxThunk from 'redux-thunk';

/**
 * REDUCERS
 * In order to create a Redux Store with a State type matching our data,
 * we import our RootReducer (combinde reducres) and all our reducers types.
 * With that information we are able to create the custom type AppState,
 * which properties must match the type name of each reducer's state
 * starting with a lowercase letter.
 */
import RootReducer from '../reducers';
import { PokemonState } from '../reducers/pokemon.reducer';

/**
 * AppState
 * A custom type for our App State in order to enable intellisense and type
 * validation to all and any components that require access to such data.
 */
export type AppState = {
    pokemonState: PokemonState;
};

/**
 * Create Custom Store
 * A function that allows any external module to create a Redux Store
 * based on our custom configuration.
 * @param initialState A default state to initialize our store predefined data.
 */
export const createCustomStore = (initialState?: AppState): Store<AppState> => {
    const middlewares = [ReduxThunk, process.env.NODE_ENV === 'development' && ReduxLogger].filter(Boolean);
    return createStore(RootReducer, initialState, applyMiddleware(...middlewares));
};
