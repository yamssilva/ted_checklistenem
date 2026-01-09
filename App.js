import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Image, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native';
/* ================= CONTEXT ================= */
const AppContext = createContext();
/* ================= CONTEÚDOS ================= */
const STRUCTURE = {
Linguagens: {
Português: [
'Interpretação de textos',
'Gêneros textuais',
'Funções da linguagem',
'Variação linguística',
'Figuras de linguagem',
'Coesão e coerência',
'Semântica',
],
Inglês: [
'Interpretação de textos',
'Cognatos',
'Temas globais',
'Funções da linguagem',
'Charges e tirinhas',
'Vocabulário',
'Inferência de sentido',
],
Espanhol: [
'Interpretação de textos',
'Cognatos',
'Variação linguística',
'Temas sociais',
'Conectivos',
'Funções da linguagem',
'Vocabulário',
],
Arte: [
'Arte e cultura',
'Artes visuais',
'Música',
'Teatro',
'Dança',
'Arte contemporânea',
'Patrimônio cultural',
],
'Educação Física': [
'Esporte e sociedade',
'Corpo e saúde',
'Jogos',
'Lutas',
'Dança',
'Sedentarismo',
'Cultura corporal',
],
},
Humanas: {
História: [
'Brasil Colônia',
'Escravidão',
'República Velha',
'Era Vargas',
'Ditadura Militar',
'Movimentos sociais',
'História contemporânea',
],
Geografia: [
'Globalização',
'Meio ambiente',
'Urbanização',
'Industrialização',
'Geopolítica',
'Clima e relevo',
'Demografia',
],
Sociologia: [
'Cultura',
'Cidadania',
'Movimentos sociais',
'Trabalho',
'Globalização',
'Poder',
'Identidade',
],
Filosofia: [
'Ética',
'Política',
'Conhecimento',
'Filosofia antiga',
'Filosofia moderna',
'Existencialismo',
'Filosofia contemporânea',
],
},
Naturezas: {
Biologia: [
'Ecologia',
'Genética',
'Citologia',
'Evolução',
'Fisiologia',
'Cadeias alimentares',
'Biotecnologia',
],
Química: [
'Química ambiental',
'Funções inorgânicas',
'Ligações químicas',
'Reações químicas',
'Estequiometria',
'Química orgânica',
'Termoquímica',
],
Física: [
'Cinemática',
'Dinâmica',
'Energia',
'Eletricidade',
'Ondulatória',
'Óptica',
'Termologia',
],
},
Matemática: {
'Matemática Básica': [
'Razão e proporção',
'Porcentagem',
'Regra de três',
'Operações básicas',
'Gráficos',
'Média e mediana',
'Geometria',
],
'Matemática Avançada': [
'Função 1º grau',
'Função 2º grau',
'Exponencial',
'Logarítmica',
'Geometria espacial',
'Trigonometria',
'Probabilidade',
],
},
Redação: {
Estrutura: [
'Introdução',
'Tese',
'Desenvolvimento',
'Repertório',
'Coesão',
'Conclusão',
'Proposta de intervenção',
],
'Eixos Temáticos': [
'Educação',
'Saúde',
'Meio ambiente',
'Cidadania',
'Tecnologia',
'Cultura',
'Trabalho',
],
},
};
/* ================= TOTAL ================= */
const TOTAL_CONTENTS = Object.values(STRUCTURE)
.flatMap(a => Object.values(a))
.flatMap(s => s).length;
/* ================= PROVIDER ================= */
function AppProvider({ children }) {
const [progress, setProgress] = useState({});
useEffect(() => {
AsyncStorage.getItem('progress').then(p => p && setProgress(JSON.parse(p)));
}, []);
useEffect(() => {
AsyncStorage.setItem('progress', JSON.stringify(progress));
}, [progress]);
const toggle = key => {
setProgress(prev => ({ ...prev, [key]: !prev[key] }));
};
return (
<AppContext.Provider value={{ progress, toggle }}>
{children}
</AppContext.Provider>
);
}
const useApp = () => useContext(AppContext);
/* ================= TELAS ================= */
function InicioScreen({ navigation }) {
return (
<View style={styles.container}>
{Object.keys(STRUCTURE).map(area => (
<TouchableOpacity
key={area}
style={styles.areaButton}
onPress={() => navigation.navigate('Sub', { area })}
>
<Text style={styles.areaText}>{area.toUpperCase()}</Text>
</TouchableOpacity>
))}
</View>
);
}
function SubScreen({ route, navigation }) {
const { area } = route.params;
return (
<View style={styles.container}>
{Object.keys(STRUCTURE[area]).map(sub => (
<TouchableOpacity
key={sub}
style={styles.areaButton}
onPress={() => navigation.navigate('Conteudos', { area, sub })}
>
<Text style={styles.areaText}>{sub}</Text>
</TouchableOpacity>
))}
</View>
);
}
function ConteudosScreen({ route }) {
const { area, sub } = route.params;
const { progress, toggle } = useApp();
const data = STRUCTURE[area][sub];
return (
<FlatList
contentContainerStyle={styles.container}
data={data}
keyExtractor={i => i}
renderItem={({ item }) => {
const key = `${area}-${sub}-${item}`;
const done = progress[key];
return (
<TouchableOpacity
style={[styles.topic, done ? styles.done : styles.pending]}
onPress={() => toggle(key)}
>
<Text>{item}</Text>
<Text>{done ? '✔' : '○'}</Text>
</TouchableOpacity>
);
}}
/>
);
}
/* ================= MENU ================= */
function MenuScreen({ navigation }) {
return (
<View style={styles.container}>
<MenuItem title="Progresso" onPress={() => navigation.navigate('Progresso')} />
<MenuItem title="Cursos" onPress={() => navigation.navigate('Cursos')} />
<MenuItem title="Canais" onPress={() => navigation.navigate('Canais')} />
<MenuItem title="Calendário ENEM" onPress={() => navigation.navigate('Calendario')}
/>
<MenuItem title="Metas de Estudo" onPress={() => navigation.navigate('Metas')}
/>
</View>
);
}
function MenuItem({ title, onPress }) {
return (
<TouchableOpacity style={styles.areaButton} onPress={onPress}>
<Text style={styles.areaText}>{title}</Text>
</TouchableOpacity>
);
}
function CursosScreen() {
const cursos = ['Ferreto', 'Aprova Total', 'Repertório ENEM', 'Poliedro', 'Fernanda Pessoa',
'Plataforma Assaad'];
return (
<View style={styles.container}>
{cursos.map(c => (
<View key={c} style={styles.card}>
<Text style={styles.areaText}>{c}</Text>
</View>
))}
</View>
);
}
function InfoPessoaisScreen() {
return (
<View style={styles.container}>
<View style={styles.card}>
<Ionicons name="person-circle" size={100} color="#0b2c6d" />
<Text style={styles.name}>Maria</Text>
<Text style={{ fontSize: 16, color: '#333' }}>
maria.brito2341@gmail.com
</Text>
</View>
</View>
);
}
function ConfiguracoesScreen() {
const apagarProgresso = async () => {
await AsyncStorage.removeItem('progress');
alert('Progresso apagado com sucesso');
};
const apagarConta = async () => {
await AsyncStorage.clear();
alert('Conta apagada com sucesso');
};
return (
<View style={styles.container}>
<View style={styles.card}>
<Text style={styles.areaText}>Ações críticas</Text>
<TouchableOpacity
style={styles.dangerButton}
onPress={apagarProgresso}
>
<Text style={styles.dangerText}>Apagar progresso</Text>
</TouchableOpacity>
<TouchableOpacity
style={styles.dangerButton}
onPress={apagarConta}
>
<Text style={styles.dangerText}>Apagar conta</Text>
</TouchableOpacity>
</View>
</View>
);
}
function CanaisScreen() {
const canais = ['Descomplica', 'ProEnem', 'Ferreto', 'Débora Aladim', 'Química Simples',
'Profinho', 'Redação e Gramática Zica', 'Física Total', 'Parabólica'];
return (
<View style={styles.container}>
{canais.map(c => (
<View key={c} style={styles.card}>
<Text style={styles.areaText}>{c}</Text>
</View>
))}
</View>
);
}
function ProgressoScreen() {
const { progress } = useApp();
const concluidos = Object.values(progress).filter(Boolean).length;
const percent = TOTAL_CONTENTS === 0
? 0
: Math.round((concluidos / TOTAL_CONTENTS) * 100);
return (
<View style={styles.container}>
{/* CARD PRINCIPAL */}
<View style={styles.progressCard}>
<Text style={styles.progressTitle}>Progresso geral</Text>
{/* CÍRCULO SIMULADO */}
<View style={styles.progressCircle}>
<Text style={styles.progressPercent}>{percent}%</Text>
</View>
<Text style={styles.progressSubtitle}>
{concluidos} de {TOTAL_CONTENTS} conteúdos concluídos
</Text>
</View>
{/* BARRA DE PROGRESSO */}
<View style={styles.progressBarContainer}>
<View
style={[
styles.progressBarFill,
{ width: `${percent}%` },
]}
/>
</View>
{/* INDICADORES */}
<View style={styles.progressStats}>
<View style={styles.progressStatBox}>
<Ionicons name="checkmark-circle" size={28} color="#2e7d32" />
<Text style={styles.progressStatValue}>{concluidos}</Text>
<Text style={styles.progressStatLabel}>Concluídos</Text>
</View>
<View style={styles.progressStatBox}>
<Ionicons name="time" size={28} color="#c62828" />
<Text style={styles.progressStatValue}>
{TOTAL_CONTENTS - concluidos}
</Text>
<Text style={styles.progressStatLabel}>Pendentes</Text>
</View>
</View>
</View>
);
}
function MetasScreen() {
const [meta, setMeta] = useState('');
const [metas, setMetas] = useState([]);
useEffect(() => {
AsyncStorage.getItem('metas').then(data => {
if (data) setMetas(JSON.parse(data));
});
}, []);
useEffect(() => {
AsyncStorage.setItem('metas', JSON.stringify(metas));
}, [metas]);
const adicionarMeta = () => {
if (!meta.trim()) return;
setMetas(prev => [
...prev,
{ id: Date.now().toString(), texto: meta, done: false }
]);
setMeta('');
};
const toggleMeta = id => {
setMetas(prev =>
prev.map(m =>
m.id === id ? { ...m, done: !m.done } : m
)
);
};
return (
<View style={styles.container}>
<Text style={styles.big}>Metas</Text>
<View style={styles.card}>
<TextInput
placeholder="Digite sua meta de estudo"
value={meta}
onChangeText={setMeta}
style={styles.input}
/>
<TouchableOpacity style={styles.areaButton} onPress={adicionarMeta}>
<Text style={styles.areaText}>Adicionar</Text>
</TouchableOpacity>
</View>
<FlatList
data={metas}
keyExtractor={item => item.id}
renderItem={({ item }) => (
<TouchableOpacity
style={[
styles.topic,
item.done ? styles.done : styles.pending
]}
onPress={() => toggleMeta(item.id)}
>
<Text>{item.texto}</Text>
<Text>{item.done ? '✔' : '○'}</Text>
</TouchableOpacity>
)}
/>
</View>
);
}
/* ================= PERFIL ================= */
function PerfilScreen({ navigation }) {
return (
<View style={styles.container}>
<View style={styles.profileHeader}>
<Ionicons name="person-circle" size={120} color="#0b2c6d" />
<Text style={styles.name}>Maria</Text>
</View>
<View style={styles.profileCard}>
<TouchableOpacity onPress={() => navigation.navigate('InfoPessoais')}>
<Text style={styles.profileItem}>Informações pessoais</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('Configuracoes')}>
<Text style={styles.profileItem}>Configurações</Text>
</TouchableOpacity>
<Text style={styles.profileItem}>Idioma</Text>
</View>
</View>
);
}
/* ================= NAVEGAÇÃO ================= */
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
function InicioStack() {
return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
<Stack.Screen name="Inicio" component={InicioScreen} />
<Stack.Screen name="Sub" component={SubScreen} />
<Stack.Screen name="Conteudos" component={ConteudosScreen} />
</Stack.Navigator>
);
}
function MenuStack() {
return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
<Stack.Screen name="Menu" component={MenuScreen} />
<Stack.Screen name="Progresso" component={ProgressoScreen} />
<Stack.Screen name="Cursos" component={CursosScreen} />
<Stack.Screen name="Canais" component={CanaisScreen} />
<Stack.Screen name="Calendario" component={CalendarioScreen} />
<Stack.Screen name="Metas" component={MetasScreen} />
</Stack.Navigator>
);
}
function PerfilStack() {
return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
<Stack.Screen name="PerfilMain" component={PerfilScreen} />
<Stack.Screen name="InfoPessoais" component={InfoPessoaisScreen} />
<Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
</Stack.Navigator>
);
}
function CalendarioScreen() {
const hoje = new Date();
const enem1 = new Date(2026, 10, 8); // 08/11/2026
const enem2 = new Date(2026, 10, 15); // 15/11/2026
const proximaData =
hoje <= enem1 ? enem1 :
hoje <= enem2 ? enem2 :
enem2;
const diffTime = proximaData - hoje;
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
return (
<View style={styles.container}>
<Text style={styles.big}>{diffDays}</Text>
<Text style={styles.areaText}>
faltam {diffDays} dias para o ENEM!
</Text>
<View style={styles.card}>
<Text>📅 Provas ENEM 2026</Text>
<Text>• 08 de novembro de 2026</Text>
<Text>• 15 de novembro de 2026</Text>
</View>
</View>
);
}
function Splash() {
return (
<View style={styles.splashContainer}>
<Text style={styles.splashTitle}>
Enem<Text style={{ color: '#f4b400' }}>✓</Text>
</Text>
<Text style={styles.splashSubtitle}>Check-List</Text>
<ActivityIndicator size="large" color="#2d2dff" />
</View>
);
}
export default function App() {
const [loading, setLoading] = useState(true);
useEffect(() => {
const timer = setTimeout(() => {
setLoading(false);
}, 2000);
return () => clearTimeout(timer);
}, []);
if (loading) {
return <Splash />;
}
return (
<AppProvider>
<NavigationContainer>
<Tab.Navigator
screenOptions={({ route }) => ({
headerShown: false,
tabBarIcon: ({ color, size }) => {
const icons = {
Menu: 'menu',
Início: 'home',
Perfil: 'person',
};
return <Ionicons name={icons[route.name]} size={size} color={color} />;
},
tabBarActiveTintColor: '#fff',
tabBarInactiveTintColor: '#cfd8ff',
tabBarStyle: { backgroundColor: '#0b2c6d' },
})}
>
<Tab.Screen name="Menu" component={MenuStack} />
<Tab.Screen name="Início" component={InicioStack} />
<Tab.Screen name="Perfil" component={PerfilStack} />
</Tab.Navigator>
</NavigationContainer>
</AppProvider>
);
}
/* ================= STYLES ================= */
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#cfe3ff',
padding: 20,
},
input: {
width: '100%',
borderWidth: 1,
borderColor: '#ccc',
borderRadius: 8,
padding: 10,
marginBottom: 10,
backgroundColor: '#fff',
},
areaButton: {
width: '100%',
backgroundColor: '#b8f7c5',
padding: 16,
borderRadius: 8,
marginBottom: 14,
alignItems: 'center',
},
areaText: { fontWeight: 'bold' },
topic: {
width: '100%',
padding: 14,
borderRadius: 8,
marginBottom: 10,
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
},
done: { backgroundColor: '#b8f7c5' },
pending: { backgroundColor: '#ffb3a7' },
big: { fontSize: 42, fontWeight: 'bold', marginBottom: 10 },
name: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
card: {
width: '100%',
backgroundColor: '#bcd6ff',
padding: 16,
borderRadius: 10,
marginBottom: 12,
alignItems: 'center',
},
profileCard: {
marginTop: 20,
width: '100%',
backgroundColor: '#bcd6ff',
padding: 16,
borderRadius: 10,
},
profileItem: {
paddingVertical: 8,
fontSize: 16,
},
profileHeader: {
alignItems: 'center',
marginBottom: 20,
},
splashContainer: {
flex: 1,
backgroundColor: '#cfe3ff',
justifyContent: 'center',
alignItems: 'center',
},
splashTitle: {
fontSize: 34,
fontWeight: 'bold',
color: '#0b2c6d',
},
splashSubtitle: {
fontSize: 18,
color: '#2e7d32',
marginBottom: 20,
},
dangerButton: {
width: '100%',
backgroundColor: '#d32f2f',
padding: 14,
borderRadius: 8,
marginTop: 12,
alignItems: 'center',
},
dangerText: {
color: '#fff',
fontWeight: 'bold',
},
/* ===== PROGRESSO ===== */
progressCard: {
width: '100%',
backgroundColor: '#ffffff',
borderRadius: 16,
padding: 24,
alignItems: 'center',
marginBottom: 20,
elevation: 4,
},
progressTitle: {
fontSize: 18,
fontWeight: 'bold',
color: '#0b2c6d',
marginBottom: 16,
},
progressCircle: {
width: 140,
height: 140,
borderRadius: 70,
backgroundColor: '#e3f2fd',
justifyContent: 'center',
alignItems: 'center',
marginBottom: 12,
borderWidth: 8,
borderColor: '#0b2c6d',
},
progressPercent: {
fontSize: 32,
fontWeight: 'bold',
color: '#0b2c6d',
},
progressSubtitle: {
fontSize: 14,
color: '#444',
marginTop: 8,
},
progressBarContainer: {
width: '100%',
height: 14,
backgroundColor: '#dbe7ff',
borderRadius: 7,
overflow: 'hidden',
marginBottom: 24,
},
progressBarFill: {
height: '100%',
backgroundColor: '#2e7d32',
borderRadius: 7,
},
progressStats: {
flexDirection: 'row',
justifyContent: 'space-between',
width: '100%',
},
progressStatBox: {
width: '48%',
backgroundColor: '#ffffff',
borderRadius: 12,
padding: 16,
alignItems: 'center',
elevation: 3,
},
progressStatValue: {
fontSize: 22,
fontWeight: 'bold',
marginTop: 6,
},
progressStatLabel: {
fontSize: 12,
color: '#555',
},
});