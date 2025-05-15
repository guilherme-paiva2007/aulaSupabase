import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from "expo-notifications";
import { NavigationContainer } from '@react-navigation/native';
import Register from './src/screens/register.js';
import Login from './src/screens/login.js';
import UpdateProfile from './src/screens/updateProfile.js';
import Profile from './src/screens/profile.js';
import AddVideo from './src/screens/addVideo.js';
import ListVideos from './src/screens/listVideos.js';
import AddImage from './src/screens/addImage.js';
import ListImages from './src/screens/listImages.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true
    }),
});

const BottomTabs = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const ProfileStack = createNativeStackNavigator();
const ImagesStack = createNativeStackNavigator();
const VideosStack = createNativeStackNavigator();

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <ProfileStack.Screen name="Profile" component={Profile} />
            <ProfileStack.Screen name="UpdateProfile" component={UpdateProfile} />
        </ProfileStack.Navigator>
    );
}

function ImagesStackScreen() {
    return (
        <ImagesStack.Navigator initialRouteName="ListImages" screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <ImagesStack.Screen name="AddImage" component={AddImage} />
            <ImagesStack.Screen name="ListImages" component={ListImages} />
        </ImagesStack.Navigator>
    );
}

function VideosStackScreen() {
    return (
        <VideosStack.Navigator initialRouteName="ListVideos" screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <VideosStack.Screen name="AddVideo" component={AddVideo} />
            <VideosStack.Screen name="ListVideos" component={ListVideos} />
        </VideosStack.Navigator>
    );
}

function BottomTabsScreen() {
    return (
        <BottomTabs.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                tabBarStyle: {
                    backgroundColor: '#1e1e1e',
                    borderTopColor: '#333',
                    height: 65,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: '#007bff',
                tabBarInactiveTintColor: '#aaa',
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            }}
        >
            <BottomTabs.Screen
                name="Profile"
                component={ProfileStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-outline" size={size} color={color} />
                    ),
                }}
            />
            <BottomTabs.Screen
                name="Imagens"
                component={ImagesStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="images-outline" size={size} color={color} />
                    ),
                }}
            />
            <BottomTabs.Screen
                name="Vídeos"
                component={VideosStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="videocam-outline" size={size} color={color} />
                    ),
                }}
            />
        </BottomTabs.Navigator>

    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }} initialRouteName="Login">
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="BottomTabs" component={BottomTabsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}