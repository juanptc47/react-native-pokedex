import * as React from 'react';
import { StyleSheet, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

import { Text, View } from '../components/Themed';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../state/store';
import { readPokemonByName, PokemonState, Pokemon } from '../state/reducers/pokemon.reducer';

// Constants
import Colors from '../constants/Colors';

// Assets
import PokedexHeader from '../assets/images/pokedex-header.png';

interface PokemonResultScreenProps extends StackScreenProps<RootStackParamList, 'PokemonResultScreen'> { }

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
  const [selectedPokemonData, setSelectedPokemonData] = React.useState<Pokemon>();

  React.useEffect(() => {
    if (prevProps?.route.params.pokemonName !== props.route.params.pokemonName) {
      dispatch(readPokemonByName(props.route.params.pokemonName.toLocaleLowerCase()));
    }
    if (prevPokemonState?.onScreenPokemonStatus === 'PENDING' && pokemonState.onScreenPokemonStatus === 'SUCCESS') {
      setSelectedPokemonData(pokemonState.pokemon[props.route.params.pokemonName.toLocaleLowerCase()]);
    }
  }, [props, prevProps, setSelectedPokemonData, pokemonState, prevPokemonState]);
  return (
    <View style={styles.screenContainer}>
      <Image source={PokedexHeader} style={styles.header} />
      {pokemonState.onScreenPokemonStatus === 'PENDING' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={'rgb(0, 220, 255)'} size={40} />
        </View>
      )}
      {(pokemonState.onScreenPokemonStatus === 'SUCCESS' || pokemonState.onScreenPokemonStatus === 'UPDATNG') && (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingBottom: 30 }}>
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
          <View style={{ alignItems: 'flex-start', width: '100%', paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'left' }}>
                Species Data:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
                <Text style={{ lineHeight: 24, width: 160 }}>
                  <Text style={{ fontWeight: 'bold' }}>Type(s): </Text>
                  {selectedPokemonData?.types.map((type, index, types) => {
                    return (
                      <Text key={index}>{type}{index < types.length - 1 ? ', ' : ''}</Text>
                    );
                  })}
                </Text>
                <Text style={{ lineHeight: 24, width: 160 }}>
                  <Text style={{ fontWeight: 'bold' }}>Height: </Text>
                  {selectedPokemonData?.height} m
                </Text>
                <Text style={{ lineHeight: 24, width: 160 }}>
                  <Text style={{ fontWeight: 'bold' }}>Weight: </Text>
                  {selectedPokemonData?.weight} kg
                </Text>
                <Text style={{ lineHeight: 24, width: 160 }}>
                  <Text style={{ fontWeight: 'bold' }}>Weight: </Text>
                  {selectedPokemonData?.weight} kg
                </Text>
              </View>
          </View>
          <Text>
            {JSON.stringify(selectedPokemonData)}
          </Text>
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => props.navigation.popToTop()}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', height: 20 }}>
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
  }
});

export default PokemonResultScreen;
