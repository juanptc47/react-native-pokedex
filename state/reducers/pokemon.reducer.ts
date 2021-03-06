// Redux Types
import { Action, Dispatch } from 'redux';
import { AppState } from '../store';

// APIs
import PokemonAPI, { EvolvesTo } from '../apis/pokemon.api';

/*
 * Action Types
 * Naming convention based on Redux Ducks:
 * MUST have action types in the form npm-module-or-app/reducer_name/ACTION_TYPE
 */
export const SET_REDUCER_STATUS = 'state/pokemons/SET_REDUCER_STATUS';
export const SET_ON_SCREEN_POKEMON_STATUS = 'state/pokemons/SET_ON_SCREEN_POKEMON_STATUS';
export const SET_POKEMON = 'state/pokemons/SET_POKEMON';

/**
 * Reducer Types and Interfaces
 * All reducers MUST export its own type to enable the store
 * creator to generate an AppState based on its reducers.
 */
export interface Pokemon {
    id: string;
    name: string;
    pokedexNumber: number;
    thumbnailURL: string;
    height: number;
    weight: number;
    types: string[];
    speciesData?: {
        genderRate: number;
        captureRate: number;
        genus: string;
        evolutionLineId: string;
    };
    evloutionChain?: string[],
}
export type PokemonState = {
    pokemon: { [key: string]: Pokemon };
    pokemonStatus: 'PENDING' | 'SUCCESS' | 'ERROR' | 'IDLE';
    onScreenPokemonStatus: 'UPDATING' | 'PENDING' | 'SUCCESS' | 'ERROR' | 'IDLE';
    errorMessage?: string;
};

export interface SetPokemonAction extends Action {
    type: typeof SET_POKEMON;
    pokemonName: string;
    pokemonData: Pokemon;
}

export interface SetReducerStatusAction extends Action {
    type: typeof SET_REDUCER_STATUS;
    status: 'PENDING' | 'SUCCESS' | 'ERROR' | 'IDLE';
}

export interface SetOnScreenPokemonStatusAction extends Action {
    type: typeof SET_ON_SCREEN_POKEMON_STATUS;
    status: 'UPDATING' | 'PENDING' | 'SUCCESS' | 'ERROR' | 'IDLE';
}

export type AuthActionTypes = SetPokemonAction | SetReducerStatusAction | SetOnScreenPokemonStatusAction;

/*
 * Synchronous Action Creators
 * All action creators must be exported as functions based on Redux Ducks:
 * MUST export its action creators as functions
 */
export const setPokemon = (
    pokemonName: string,
    pokemonData: Pokemon
): SetPokemonAction => {
    return {
        type: SET_POKEMON,
        pokemonName,
        pokemonData,
    };
};

export const setReducerStatus = (status: 'PENDING' | 'SUCCESS' | 'ERROR' | 'IDLE'): SetReducerStatusAction => {
    return {
        type: SET_REDUCER_STATUS,
        status,
    };
};

export const setPokemonOnScreenStatus = (status: 'UPDATING' | 'PENDING' | 'SUCCESS' | 'ERROR' | 'IDLE'): SetOnScreenPokemonStatusAction => {
    return {
        type: SET_ON_SCREEN_POKEMON_STATUS,
        status,
    };
};

/*
 * Asynchronous Action Creators (with redux-thunks)
 * First word of every function sould be an element from the CRUD verbs
 * according to the nature of the action to performe
 * (create [POST data], read [GET data], update [PUT data], delete [DELETE data])
 */
export const readPokemonByName = (pokemonName: string): Function => {
    const pokemonAPI = new PokemonAPI();

    return (dispatch: Dispatch): void => {
        dispatch(setPokemonOnScreenStatus('PENDING'));
        pokemonAPI.getPokemonByName(pokemonName).then((pokemonData) => {
            const capitlizedName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);;
            dispatch(setPokemon(
                pokemonName,
                {
                    id: `${pokemonData.id}`,
                    name: capitlizedName,
                    thumbnailURL: pokemonData.sprites.front_default,
                    height: pokemonData.height/10,
                    pokedexNumber: pokemonData.order,
                    types: pokemonData.types.map(type => type.type.name),
                    weight: pokemonData.weight/10,
                }
            ));
            dispatch(setPokemonOnScreenStatus('SUCCESS'));
        }).catch((e: Error) => {
            console.log(e.message);
            dispatch(setPokemonOnScreenStatus('ERROR'));
        });
    };
};

export const readPokemonSpeciesData = (pokemonName: string): Function => {
    const pokemonAPI = new PokemonAPI();

    return (dispatch: Dispatch, getState: () => AppState): void => {
        dispatch(setPokemonOnScreenStatus('UPDATING'));
        pokemonAPI.getPokemonSpeciesData(pokemonName).then((pokemonData) => {
            const currentPokemon = getState().pokemonState.pokemon[pokemonName];
            const evolutionLineURLBreakdown = pokemonData.evolution_chain.url.split('/');
            dispatch(setPokemon(
                pokemonName,
                {
                    ...currentPokemon,
                    speciesData: {
                        captureRate: Math.round((pokemonData.capture_rate/255) * 100),
                        genderRate: Math.round((pokemonData.gender_rate/8) * 100),
                        genus: pokemonData.genera.find(item => item.language.name === 'en')?.genus!,
                        evolutionLineId: evolutionLineURLBreakdown[evolutionLineURLBreakdown.length - 2],
                    }
                }
            ));
            dispatch(setPokemonOnScreenStatus('SUCCESS'));
        }).catch((e: Error) => {
            console.log(e.message);
            dispatch(setPokemonOnScreenStatus('ERROR'));
        })
    };
};

export const readPokemonEvolutionChain = (chainId: string, pokemonId: string): Function => {
    const pokemonAPI = new PokemonAPI();

    return (dispatch: Dispatch, getState: () => AppState): void => {
        dispatch(setPokemonOnScreenStatus('UPDATING'));
        pokemonAPI.getEvolutionLinesData(chainId).then(chainData => {
            const currentPokemon = getState().pokemonState.pokemon[pokemonId];
            const evolutionLine: string[] = [];
            const getNameFromEvolvesTo = (evolvesTo: EvolvesTo[]) => {
                if (evolvesTo.length > 0) {
                    evolutionLine.push(evolvesTo[0].species.name);
                    getNameFromEvolvesTo(evolvesTo[0].evolves_to);
                }
            }
            evolutionLine.push(chainData.chain.species.name);
            getNameFromEvolvesTo(chainData.chain.evolves_to);
            dispatch(setPokemon(pokemonId, {
                ...currentPokemon,
                evloutionChain: evolutionLine,
            }));
            evolutionLine.forEach(pokemonName => {
                pokemonAPI.getPokemonByName(pokemonName).then((pokemonData) => {
                    const capitlizedName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
                    const additionalData = getState().pokemonState.pokemon[pokemonName] || {};
                    dispatch(setPokemon(
                        pokemonName,
                        {
                            ...additionalData,
                            id: `${pokemonData.id}`,
                            name: capitlizedName,
                            thumbnailURL: pokemonData.sprites.front_default,
                            height: pokemonData.height/10,
                            pokedexNumber: pokemonData.order,
                            types: pokemonData.types.map(type => type.type.name),
                            weight: pokemonData.weight/10,
                        }
                    ));
                }).catch((e: Error) => {
                    console.log(e.message);
                });
            })
            dispatch(setPokemonOnScreenStatus('SUCCESS'));
        }).catch(e => {
            console.log(e.message);
            dispatch(setPokemonOnScreenStatus('ERROR'));
        })
    }
}

const initialState: PokemonState = {
    pokemon: {},
    onScreenPokemonStatus: 'IDLE',
    pokemonStatus: 'IDLE',
    errorMessage: '',
};

/**
 * REDUCER
 * This module's default export is a funciton named reducer, following Redux Ducks rules:
 * MUST export default a function called reducer()
 */
const reducer = (state = initialState, action: AuthActionTypes): PokemonState => {
    switch (action.type) {
        case SET_REDUCER_STATUS: {
            const newState: PokemonState = {
                ...state,
                pokemonStatus: action.status,
            };
            return { ...newState };
        }
        case SET_ON_SCREEN_POKEMON_STATUS: {
            const newState: PokemonState = {
                ...state,
                onScreenPokemonStatus: action.status,
            };
            return { ...newState };
        }
        case SET_POKEMON: {
            const currentPokemons = { ...state.pokemon };
            currentPokemons[action.pokemonName] = action.pokemonData;
            const newState: PokemonState = {
                ...state,
                pokemon: currentPokemons,
            }
            return { ...newState };
        }
        default: {
            return state;
        }
    }
};

export default reducer;
