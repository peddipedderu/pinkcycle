import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Shop Components
import PinkCycleHome from "./src/screens/PinkCycleHome";
import ProductList from "./src/screens/shop/ProductList";
import ProductDetail from "./src/screens/shop/ProductDetail";
import Categories from "./src/screens/shop/Categories";
import Cart from "./src/screens/shop/Cart";
import Checkout from "./src/screens/shop/Checkout";
import Orders from "./src/screens/shop/Orders";
import Payment from "./src/screens/shop/Payment";
import AddProduct from "./src/screens/shop/AddProduct";
import AddCategory from "./src/screens/shop/AddCategory";
import PaymentSuccess from "./src/screens/shop/PaymentSuccess";
import PaymentCanceled from "./src/screens/shop/PaymentCanceled";
import Donate from "./src/screens/shop/Donate";

// Other Components
import RegForm from "./src/screens/drawer/regForm.js";
import LoginForm from "./src/screens/drawer/loginForm.js";
import Account from "./src/screens/drawer/Account";
import Booking from "./src/screens/Booking";
import SessionDetail from "./src/screens/SessionDetail";
import BookSession from "./src/screens/BookSession";
import BookingSuccess from "./src/screens/BookingSuccess";
import MyBookings from "./src/screens/MyBookings";
import Blogs from "./src/screens/Blogs";
import BlogDetail from "./src/screens/BlogDetail";
import JoinUs from "./src/screens/JoinUs";
import CommunityForum from "./src/screens/CommunityForum";
import Programs from "./src/screens/Programs";
import ChatServer from "./src/screens/ChatServer";
import SendMessage from "./src/screens/SendMessage";
import MessageReceived from "./src/screens/MessageReceived";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const PinkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#d63384',
    background: '#fff1f5',
    card: '#f8bbd0',
    text: '#c2185b',
    border: '#f8bbd0',
    notification: '#f06292',
  },
};

const linking = {
  prefixes: [
    'http://localhost',
    'http://102.220.169.172',
    'http://pinkcycle.hopto.org',
    window.location.origin,
  ],
  config: {
    screens: {
      Main: {
        screens: {
          Home: '',
          Programs: 'programs',
          Blogs: 'blogs',
          BlogDetail: 'blogs/:id',
          JoinUs: 'join-us',
          CommunityForum: 'join-us/forums',
          ChatServer: 'join-us/forums/chat/:room',
          Booking: {
            path: 'booking/:category?',
            parse: {
              category: (category) => category || 'All',
            },
          },
          SessionDetail: 'sessions/details/:id',
          BookSession: 'sessions/book/:id',
          BookingSuccess: 'booking/success/:bookingId',
          MyBookings: 'dashboard/my-bookings',
          SendMessage: 'send_message',
          MessageReceived: 'send_message/message_received',
          Donate: 'Donate',
          Shop: {
            screens: {
              Products: 'Shop/Products',
              Cart: 'cart',
              Orders: 'Orders',
              Payment: 'Payment',
            },
          },
          PaymentSuccess: 'payment_successfully',
          PaymentCanceled: 'payment_canceled',
          ProductDetail: 'ProductDetail',
        },
      },
      Registration: 'registration',
      Login: 'login',
      Account: 'account',
    },
  },
};

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate('Main', { screen: 'Home', params: { scrollTo: null } })}
      />
      <DrawerItem
        label="Blog"
        onPress={() => props.navigation.navigate('Main', { screen: 'Blogs' })}
      />
      <DrawerItem
        label="Donate"
        onPress={() => props.navigation.navigate('Main', { screen: 'Donate' })}
      />
      <DrawerItem
        label="About PinkCycle"
        onPress={() => props.navigation.navigate('Main', { screen: 'Home', params: { scrollTo: 'about' } })}
      />
      <DrawerItem
        label="Strategic Pillars"
        onPress={() => props.navigation.navigate('Main', { screen: 'Home', params: { scrollTo: 'pillars' } })}
      />
      <DrawerItem
        label="Join Us"
        onPress={() => props.navigation.navigate('Main', { screen: 'JoinUs' })}
      />
      <DrawerItem
        label="Shop"
        onPress={() => props.navigation.navigate('Main', { screen: 'Shop' })}
      />
      <DrawerItem
        label="Account"
        onPress={() => props.navigation.navigate('Account')}
      />
    </DrawerContentScrollView>
  );
};

const ShopTabNavigator = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName;
      if (route.name === 'Products') iconName = 'list';
      else if (route.name === 'Cart') iconName = 'cart';
      else if (route.name === 'Orders') iconName = 'receipt';
      else if (route.name === 'Payment') iconName = 'card';
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#d63384',
    tabBarInactiveTintColor: 'gray',
    headerShown: false,
  })}>
    <Tab.Screen name="Products" component={ProductList} />
    <Tab.Screen name="Cart" component={Cart} />
    <Tab.Screen name="Orders" component={Orders} />
    <Tab.Screen name="Payment" component={Payment} />
  </Tab.Navigator>
);

const MainStackNavigator = ({ navigation }) => (
  <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#f8bbd0' },
      headerTintColor: '#c2185b',
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginRight: 15 }}>
          <Ionicons name="menu" size={32} color="#c2185b" />
        </TouchableOpacity>
      )
  }}>
    <Stack.Screen name="Home" component={PinkCycleHome} options={{ headerShown: false }} />
    <Stack.Screen name="Booking" component={Booking} options={{ title: "Book a Session" }} />
    <Stack.Screen name="SessionDetail" component={SessionDetail} options={{ title: "Session Details" }} />
    <Stack.Screen name="BookSession" component={BookSession} options={{ title: "Book Session" }} />
    <Stack.Screen name="BookingSuccess" component={BookingSuccess} options={{ title: "Booking Confirmation" }} />
    <Stack.Screen name="MyBookings" component={MyBookings} options={{ title: "My Bookings" }} />
    <Stack.Screen name="Blogs" component={Blogs} options={{ title: "Our Blog" }} />
    <Stack.Screen name="BlogDetail" component={BlogDetail} options={{ title: "Blog Post" }} />
    <Stack.Screen name="JoinUs" component={JoinUs} options={{ title: "Join Us" }} />
    <Stack.Screen name="CommunityForum" component={CommunityForum} options={{ title: "Community Forum" }} />
    <Stack.Screen name="ChatServer" component={ChatServer} options={{ title: "Chat Room" }} />
    <Stack.Screen name="Programs" component={Programs} options={{ title: "Explore Programs" }} />
    <Stack.Screen name="SendMessage" component={SendMessage} options={{ title: "Send a Message" }} />
    <Stack.Screen name="MessageReceived" component={MessageReceived} options={{ title: "Message Received" }} />
    <Stack.Screen name="Shop" component={ShopTabNavigator} options={{ title: 'Pink Shop' }} />
    <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Product Details' }} />
    <Stack.Screen name="Checkout" component={Checkout} options={{ title: 'Checkout' }} />
    <Stack.Screen name="AddProduct" component={AddProduct} options={{ title: 'New Product' }} />
    <Stack.Screen name="AddCategory" component={AddCategory} options={{ title: 'New Category' }} />
    <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} options={{ title: 'Payment Successful' }} />
    <Stack.Screen name="PaymentCanceled" component={PaymentCanceled} options={{ title: 'Payment Canceled' }} />
    <Stack.Screen name="Donate" component={Donate} options={{ title: "Donate" }} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer theme={PinkTheme} linking={linking}>
      <Drawer.Navigator 
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: { backgroundColor: '#fff1f5' },
          drawerActiveTintColor: '#d63384',
      }}>
        <Drawer.Screen name="Main" component={MainStackNavigator} />
        <Drawer.Screen name="Registration" component={RegForm} />
        <Drawer.Screen name="Login" component={LoginForm} />
        <Drawer.Screen name="Account" component={Account} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
