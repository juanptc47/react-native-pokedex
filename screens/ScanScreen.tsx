import * as React from 'react';
import { StyleSheet, Image, Dimensions, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

import { Text, View } from '../components/Themed';

// Constants
import Colors from '../constants/Colors';

// Assets
import PokedexHeader from '../assets/images/pokedex-header.png';

interface ScanScreenProps extends StackScreenProps<RootStackParamList, 'Root'> { }

const ScanScreen: React.FC<ScanScreenProps> = (props) => {
  const [pokemonSearchInputValue, setPokemonSearchInputValue] = React.useState('');
  const [pokemonSearchInputIsFocused, setPokemonSearchInputIsFocused] = React.useState(false);

  const _handleSubmit = React.useCallback(() => {
    if (pokemonSearchInputValue) {
      props.navigation.push('PokemonResultScreen', { pokemonName: pokemonSearchInputValue });
      setPokemonSearchInputValue('');
    }
  }, [pokemonSearchInputValue, props]);

  return (
    <View style={styles.screenContainer}>
      <Image source={PokedexHeader} style={styles.header} />
      <KeyboardAvoidingView style={styles.contentWrapper} behavior={'height'}>
        {!pokemonSearchInputIsFocused && (
          <>
            <Text style={styles.title}>
              Scan the Pokemon
            </Text>
            <Text style={styles.title}>
              you want to analyse!
            </Text>
            <Text style={styles.subTitle}>
              Or just pretend you are scanning and write a name below...
            </Text>
          </>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholderTextColor={'rgba(0, 0, 0, .4)'}
            value={pokemonSearchInputValue}
            placeholder={'Try Pikachu, Charizard or any other'}
            returnKeyType={'done'}
            onChangeText={(text) => setPokemonSearchInputValue(text)}
            onFocus={() => setPokemonSearchInputIsFocused(true)}
            onBlur={() => setPokemonSearchInputIsFocused(false)}
            onSubmitEditing={() => _handleSubmit()}
          />
        </View>
        {pokemonSearchInputIsFocused ? (
          <TouchableOpacity onPress={() => _handleSubmit()} style={styles.goButton}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>
              Go!
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        )}
      </KeyboardAvoidingView>
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
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'center',
    marginVertical: 5,
  },
  inputContainer: {
    backgroundColor: 'rgb(0, 220, 255)',
    borderColor: '#fff',
    borderWidth: 5,
    borderStyle: 'solid',
    borderRadius: 10,
    height: 100,
    width: screenDimensions.width * .8,
    marginVertical: 40,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  searchInput: {
    color: '#000',
    fontSize: 16,
    height: '100%'
  },
  separator: {
    marginVertical: 0,
    height: 1,
    width: screenDimensions.width * .8,
  },
  goButton: {
    backgroundColor: 'rgb(119,239,107)',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderColor: '#fff',
    borderWidth: 5,
    borderStyle: 'solid',
  }
});

export default ScanScreen;
