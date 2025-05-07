import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import HomeScreen from "../screens/HomeScreen";


const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons: Record<string, string> = { Home: "home", Rides: "car", Help: "question-circle", Account: "user" };
            return <Icon name={icons[route.name] || "question-circle"} size={size} color={color} />;
          },
          tabBarStyle: { backgroundColor: "#121212", height: 10 },
          tabBarActiveTintColor: "#FF5722",
          tabBarIconStyle: {height: 10},
          tabBarInactiveTintColor: "#888",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Rides" component={HomeScreen} />
        <Tab.Screen name="Help" component={HomeScreen} />
        <Tab.Screen name="Account" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
