
import { NavigationContainer } from '@react-navigation/native';
import homeScreen from './screens/homeScreen';
import profilScreen from './screens/profilScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import firstScreen from './screens/FirstScreen';

const Tab = createBottomTabNavigator();


const NavBar = () => {


    return (
        <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="first" component={firstScreen} />
          <Tab.Screen name="Home" component={homeScreen} options={{title: 'Welcome'}}/>
          <Tab.Screen name="Profile" component={profilScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    )
}


export default NavBar;