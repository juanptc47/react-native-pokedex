
export interface PokemonResponse {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    sprites: {
        front_default: string;
    };
    types: {
        slot: number;
        type: {
            name: string;
        }
    }[];
}

export interface PokemonSpeciesDataResponse {
    gender_rate: number;
    capture_rate: number;
    color: {
        name: string;
    };
    genera: {
        genus: string;
        language: {
            name: string;
        }
    }[];
    evolution_chain: {
        url: string;
    }
}

export interface EvolvesTo {
    species: {
        name: string;
    };
    evolves_to: EvolvesTo[];
}
export interface PokemonEvolutionChainResponse {
    chain: {
        evolves_to: EvolvesTo[];
        species: {
            name: string;
        };
    };
}

export default class PokemonAPI {
    baseURL: string = 'https://pokeapi.co/api/v2/';

    headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    getPokemonByName(pokemonName: string): Promise<PokemonResponse> {
        return new Promise<PokemonResponse>((resolve, reject) => {
            fetch(
                `${this.baseURL}/pokemon/${pokemonName}`,
                {
                    method: 'get',
                },
            ).then((res) => {
                if (res.ok) {
                    return res.json().then((json) => {
                        resolve(json);
                    }).catch(e => {
                        reject(e);
                    });
                } else {
                    reject(new Error(res.status.toString()));
                }
            }).catch((e) => {
                reject(e);
            })
        });
    }

    getPokemonSpeciesData(pokemonName: string): Promise<PokemonSpeciesDataResponse> {
        return new Promise<PokemonSpeciesDataResponse>((resolve, reject) => {
            fetch(
                `${this.baseURL}/pokemon-species/${pokemonName}`,
                {
                    method: 'get',
                },
            ).then((res) => {
                if (res.ok) {
                    return res.json().then((json) => {
                        resolve(json);
                    }).catch(e => {
                        reject(e);
                    });
                } else {
                    reject(new Error(res.status.toString()));
                }
            }).catch((e) => {
                reject(e);
            })
        });
    }

    getEvolutionLinesData(id: string): Promise<PokemonEvolutionChainResponse> {
        return new Promise<PokemonEvolutionChainResponse>((resolve, reject) => {
            fetch(
                `${this.baseURL}/evolution-chain/${id}`,
                {
                    method: 'get',
                },
            ).then((res) => {
                if (res.ok) {
                    return res.json().then((json) => {
                        resolve(json);
                    }).catch(e => {
                        reject(e);
                    });
                } else {
                    reject(new Error(res.status.toString()));
                }
            }).catch((e) => {
                reject(e);
            })
        });
    }
}