
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

export default class PokemonAPI {
    baseURL: string = 'https://pokeapi.co/api/v2/pokemon';

    headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    getPokemonByName(pokemonName: string): Promise<PokemonResponse> {
        return new Promise<PokemonResponse>((resolve, reject) => {
            fetch(
                `${this.baseURL}/${pokemonName}`,
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