import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';

// ─── Splash ───
function SplashScreen() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Meu App</Text>
      <Text style={s.subtitle}>Disciplina de Mobile</Text>
      <ActivityIndicator size="large" color="#fff" style={{ marginTop: 24 }} />
    </View>
  );
}

// ─── Login ───
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  function handleLogin() {
    if (user === 'admin' && pass === '123456') {
      onLogin();
    } else {
      Alert.alert('Erro', 'Usuário ou senha inválidos');
    }
  }

  return (
    <View style={s.loginContainer}>
      <Ionicons name="lock-closed" size={48} color="#6C63FF" style={{ marginBottom: 16 }} />
      <Text style={s.title}>Login</Text>
      <TextInput
        style={s.input}
        placeholder="Usuário"
        value={user}
        onChangeText={setUser}
        autoCapitalize="none"
      />
      <TextInput
        style={s.input}
        placeholder="Senha"
        value={pass}
        onChangeText={setPass}
        secureTextEntry
      />
      <TouchableOpacity style={s.button} onPress={handleLogin}>
        <Text style={s.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Home ───
function HomeScreen({ navigation }: any) {
  return (
    <View style={s.container}>
      <Ionicons name="home-outline" size={64} color="#6C63FF" style={{ marginBottom: 16 }} />
      <Text style={s.title}>Home</Text>
      <Text style={s.subtitle}>Bem-vindo ao app!</Text>
      <TouchableOpacity
        style={s.button}
        onPress={() => navigation.navigate('Details', { itemId: 42 })}
      >
        <Text style={s.buttonText}>Ir para Detalhes</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Details ───
function DetailsScreen({ navigation, route }: any) {
  return (
    <View style={s.container}>
      <Ionicons name="information-circle-outline" size={64} color="#6C63FF" style={{ marginBottom: 16 }} />
      <Text style={s.title}>Detalhes</Text>
      <Text style={s.info}>Item ID: {route.params?.itemId}</Text>
      <TouchableOpacity style={s.button} onPress={() => navigation.goBack()}>
        <Text style={s.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Profile ───
function ProfileScreen() {
  return (
    <View style={s.container}>
      <Ionicons name="person-circle-outline" size={64} color="#6C63FF" style={{ marginBottom: 16 }} />
      <Text style={s.title}>Perfil</Text>
      <Text style={s.text}>Aluno: Mauricio</Text>
      <Text style={s.text}>Disciplina: Mobile</Text>
    </View>
  );
}

// ─── Stack interna da aba Home ───
const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

// ─── Bottom Tabs ───
const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'HomeTab' ? 'home' : 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#999',
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{ tabBarLabel: 'Início', headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

// ─── Root ───
const RootStack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Login">
          {(props) => (
            <LoginScreen
              onLogin={() =>
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                })
              }
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen name="Main" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ───
const s = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 24,
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  info: { fontSize: 18, color: '#666', marginVertical: 24 },
  text: { fontSize: 16, color: '#444', marginTop: 4 },
  input: {
    backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 12,
    borderWidth: 1, borderColor: '#ccc', width: '80%',
  },
  button: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});