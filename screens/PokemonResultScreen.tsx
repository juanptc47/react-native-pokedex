import * as React from 'react';
import { StyleSheet, Image, Dimensions, ActivityIndicator, TouchableOpacity, View, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

import { Text } from '../components/Themed';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../state/store';
import { readPokemonByName, readPokemonSpeciesData, PokemonState, Pokemon , readPokemonEvolutionChain} from '../state/reducers/pokemon.reducer';

// Constants
import Colors from '../constants/Colors';

// Assets
import PokedexHeader from '../assets/images/pokedex-header.png';

interface PokemonResultScreenProps extends StackScreenProps<RootStackParamList, 'PokemonResultScreen'> { }

const missingNoURL = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0cc7abb0-75b1-4d93-bbcd-d13a1ab5e59c/d99ucfg-09a238a0-285b-415c-9251-defcd57cb011.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMGNjN2FiYjAtNzViMS00ZDkzLWJiY2QtZDEzYTFhYjVlNTljXC9kOTl1Y2ZnLTA5YTIzOGEwLTI4NWItNDE1Yy05MjUxLWRlZmNkNTdjYjAxMS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.vSvxMBbtMNWXLeRQU3fPz45xNFnV8f0Ch3xfy4ymmLA';

function usePrevious<T>(value: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const PokemonResultScreen: React.FC<PokemonResultScreenProps> = (props) => {
  const dispatch = useDispatch();
  const pokemonState = useSelector<AppState, PokemonState>((state) => state.pokemonState);
  const prevPokemonState = usePrevious<PokemonState>(pokemonState);
  const prevProps = usePrevious<PokemonResultScreenProps>(props);

  const selectedPokemonData = pokemonState.pokemon[props.route.params.pokemonName.toLocaleLowerCase()];

  React.useEffect(() => {
    const pokemonId = props.route.params.pokemonName.toLocaleLowerCase();
    if (prevProps?.route.params.pokemonName !== props.route.params.pokemonName) {
      // if (!pokemonState.pokemon[pokemonId]) {
      //   dispatch(readPokemonByName(pokemonId));
      // }
      dispatch(readPokemonByName(pokemonId));
    }
    if (prevPokemonState?.onScreenPokemonStatus === 'PENDING' && pokemonState.onScreenPokemonStatus === 'SUCCESS') {
      dispatch(readPokemonSpeciesData(pokemonId));
    }
    if (prevPokemonState?.onScreenPokemonStatus === 'UPDATING' && pokemonState.onScreenPokemonStatus === 'SUCCESS') {
    }
  }, [props, prevProps, pokemonState, prevPokemonState]);

  const _handleViewEvolutionLineClick = React.useCallback(() => {
    const pokemonId = props.route.params.pokemonName.toLocaleLowerCase();
    dispatch(readPokemonEvolutionChain(
      selectedPokemonData?.speciesData?.evolutionLineId!,
      pokemonId,
    ));
  }, [selectedPokemonData, props]);

  return (
    <View style={styles.screenContainer}>
      <Image source={PokedexHeader} style={styles.header} />
      {pokemonState.onScreenPokemonStatus === 'PENDING' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={'rgb(0, 220, 255)'} size={40} />
        </View>
      )}
      {(pokemonState.onScreenPokemonStatus === 'SUCCESS' || pokemonState.onScreenPokemonStatus === 'UPDATING') && (
        <View style={{ flex: 1, width: '100%' }}>
          <ScrollView>
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingBottom: 30 }}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: '100%', padding: 20 }}>
                <View style={styles.pokemonThumbnailContainer}>
                  <Image
                    source={{uri: selectedPokemonData?.thumbnailURL }}
                    style={styles.pokemonThumbnailImg}
                  />
                </View>
                <View>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 26 }}>
                    #{selectedPokemonData?.id}: {selectedPokemonData?.name}
                  </Text>
                  <Text style={{ lineHeight: 24 }}>
                    <Text style={{ fontWeight: 'bold' }}>Type(s): </Text>
                    {selectedPokemonData?.types.map((type, index, types) => {
                      return (
                        <Text key={index}>{type}{index < types.length - 1 ? ', ' : ''}</Text>
                      );
                    })}
                  </Text>
                  <Text style={{ lineHeight: 24 }}>
                    <Text style={{ fontWeight: 'bold' }}>Height: </Text>
                    {selectedPokemonData?.height} m
                  </Text>
                  <Text style={{ lineHeight: 24 }}>
                    <Text style={{ fontWeight: 'bold' }}>Weight: </Text>
                    {selectedPokemonData?.weight} kg
                  </Text>
                </View>
              </View>
              {selectedPokemonData?.speciesData && (
                <>
                  <View style={{ alignItems: 'flex-start', width: '100%', paddingHorizontal: 20 }}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'left' }}>
                        Species Data:
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
                      <Text style={{ lineHeight: 24, width: 300 }}>
                          <Text style={{ fontWeight: 'bold' }}>Genus: </Text>
                          {selectedPokemonData?.speciesData?.genus}
                        </Text>
                        <Text style={{ lineHeight: 24, width: 300 }}>
                          <Text style={{ fontWeight: 'bold' }}>Capture rate: </Text>
                          {selectedPokemonData?.speciesData?.captureRate}%
                        </Text>
                        <Text style={{ lineHeight: 24, width: 300 }}>
                          <Text style={{ fontWeight: 'bold' }}>Gender Rate: </Text>
                          {selectedPokemonData?.speciesData?.genderRate === -1 ? 'N/A' : `${selectedPokemonData?.speciesData?.genderRate}% female`}
                        </Text>
                      </View>
                  </View>
                  {selectedPokemonData.evloutionChain && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 20 }}>
                      {selectedPokemonData.evloutionChain.map(pokemonName => {
                        return (
                          <TouchableOpacity key={pokemonName} style={{ alignItems: 'center' }} onPress={() => props.navigation.replace('PokemonResultScreen', { pokemonName })}>
                            <View style={styles.evolutionThumbnailContainer}>
                              <Image source={{ uri: pokemonState.pokemon[pokemonName]?.thumbnailURL || missingNoURL }} style={styles.evolutionThumbnailImg} />
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                  {!selectedPokemonData.evloutionChain && pokemonState.onScreenPokemonStatus === 'SUCCESS' && (
                    <TouchableOpacity onPress={() => _handleViewEvolutionLineClick()} style={styles.evolutionLineButton}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>
                        View evolution line
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
              {pokemonState.onScreenPokemonStatus === 'UPDATING' && (
                <ActivityIndicator color={'rgb(0, 220, 255)'} size={20} />
              )}
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => props.navigation.popToTop()}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', height: 25 }}>
              SCAN AGAIN
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {pokemonState.onScreenPokemonStatus === 'ERROR' && (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
            No Pokemon was found under the name:
          </Text>
          <Text style={{ fontSize: 20, lineHeight: 40 }}>
            {props.route.params.pokemonName}
          </Text>
          <TouchableOpacity onPress={() => props.navigation.popToTop()} style={styles.tryAgainButton}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>
              Try another name!
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const screenDimensions = Dimensions.get('screen');
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.appColors.pokedexRed,
    paddingTop: 30,
  },
  header: {
    alignSelf: 'flex-start',
    width: screenDimensions.width,
    height: screenDimensions.width * .46,
  },
  pokemonThumbnailContainer: {
    backgroundColor: 'rgb(0, 220, 255)',
    borderColor: '#fff',
    borderWidth: 7,
    borderStyle: 'solid',
    borderRadius: 10,
    height: 120,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  pokemonThumbnailImg: {
    height: 120,
    width: 120,
  },
  statsContainer: {
    color: '#fff',
    fontSize: 18,
  },
  tryAgainButton: {
    backgroundColor: 'rgb(119,239,107)',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderColor: '#fff',
    borderWidth: 5,
    borderStyle: 'solid',
  },
  evolutionLineButton: {
    backgroundColor: 'rgb(246,238,119)',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderColor: '#fff',
    borderWidth: 5,
    borderStyle: 'solid',
    marginVertical: 20,
  },
  scanAgainButton: {
    backgroundColor: 'rgb(65, 28, 84)',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderColor: '#fff',
    borderWidth: 2,
    borderStyle: 'solid',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evolutionThumbnailContainer: {
    backgroundColor: 'rgb(0, 220, 255)',
    borderColor: '#fff',
    borderWidth: 5,
    borderStyle: 'solid',
    borderRadius: 5,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  evolutionThumbnailImg: {
    height: 60,
    width: 60,
  },
});

export default PokemonResultScreen;
