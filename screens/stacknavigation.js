import { createStackNavigator } from '@react-navigation/stack';
import helpsaisieCode from './helpsaisieCode';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HelpSaisieCode" component={helpsaisieCode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
