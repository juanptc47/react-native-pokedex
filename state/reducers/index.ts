// Redux imports
import { combineReducers } from 'redux';

// Reducers
import PokemonReducer from './pokemon.reducer';

export { PokemonReducer };

export default combineReducers({
    pokemonState: PokemonReducer,
});
