import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Category } from '../types';
import { colors, spacing, fontSize, radius, fonts } from '../theme';
import { CATEGORIES, BRAZILIAN_STATES } from '../data/mock';
import { City, searchCities } from '../data/cities';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<City[]>([]);

  const canProceed = selectedState && selectedCity && selectedCategory;

  function handleSelectState(uf: string) {
    setSelectedState(uf);
    setSelectedCity(null);
    setCityQuery('');
    setCitySuggestions([]);
    setStateModalVisible(false);
  }

  function handleCityQueryChange(text: string) {
    setCityQuery(text);
    setSelectedCity(null);
    setCitySuggestions(searchCities(text, selectedState ?? undefined));
  }

  function handleSelectCity(city: City) {
    setSelectedCity(city.name);
    setCityQuery(city.name);
    setCitySuggestions([]);
  }

  function handleProceed() {
    if (!canProceed) return;
    navigation.navigate('Results', {
      state: selectedState!,
      city: selectedCity!,
      category: selectedCategory!,
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>NOX</Text>
          <Text style={styles.subtitle}>Descubra onde a noite te leva</Text>
        </View>

        {/* Estado */}
        <Text style={styles.label}>Estado</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setStateModalVisible(true)}
          accessibilityLabel={selectedState
            ? `Estado selecionado: ${BRAZILIAN_STATES.find(s => s.uf === selectedState)?.name}`
            : 'Selecionar estado'}
          accessibilityRole="button"
        >
          <Text style={selectedState ? styles.selectorText : styles.selectorPlaceholder}>
            {selectedState
              ? BRAZILIAN_STATES.find(s => s.uf === selectedState)?.name
              : 'Selecione o estado'}
          </Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Cidade */}
        <Text style={[styles.label, !selectedState && styles.labelDisabled]}>Cidade</Text>
        <View style={[styles.cityInputWrapper, !selectedState && styles.selectorDisabled]}>
          <TextInput
            style={styles.cityInput}
            placeholder="Digite o nome da cidade"
            placeholderTextColor={colors.textMuted}
            value={cityQuery}
            onChangeText={handleCityQueryChange}
            editable={!!selectedState}
            autoCorrect={false}
            accessibilityLabel="Buscar cidade"
          />
        </View>

        {citySuggestions.length > 0 && (
          <View style={styles.suggestions}>
            {citySuggestions.map((city, idx) => (
              <TouchableOpacity
                key={`${city.uf}-${city.name}-${idx}`}
                style={[
                  styles.suggestionItem,
                  idx === citySuggestions.length - 1 && styles.suggestionItemLast,
                ]}
                onPress={() => handleSelectCity(city)}
                accessibilityLabel={`Selecionar ${city.name}`}
                accessibilityRole="button"
              >
                <Text style={styles.suggestionText}>{city.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Categorias */}
        <Text style={styles.label}>O que você procura?</Text>
        <View style={styles.grid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryCard,
                selectedCategory === cat.key && styles.categoryCardActive,
              ]}
              onPress={() => setSelectedCategory(cat.key)}
              accessibilityLabel={cat.label}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedCategory === cat.key }}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === cat.key && styles.categoryLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão */}
        <TouchableOpacity
          style={[styles.button, !canProceed && styles.buttonDisabled]}
          onPress={handleProceed}
          disabled={!canProceed}
          accessibilityLabel="Explorar lugares"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canProceed }}
        >
          <Text style={styles.buttonText}>Explorar</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal de estados */}
      <Modal
        visible={stateModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setStateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o estado</Text>
            <FlatList
              data={BRAZILIAN_STATES}
              keyExtractor={item => item.uf}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectState(item.uf)}
                  accessibilityLabel={`${item.name}, ${item.uf}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  <Text style={styles.modalItemUF}>{item.uf}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setStateModalVisible(false)}
              accessibilityLabel="Cancelar seleção de estado"
              accessibilityRole="button"
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },

  header: { alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.lg },
  logo: { fontSize: 42, fontFamily: fonts.bold, color: colors.primary, letterSpacing: 8 },
  subtitle: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textMuted, marginTop: spacing.xs },

  label: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.md },
  labelDisabled: { opacity: 0.4 },

  selector: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  selectorDisabled: { opacity: 0.4 },
  selectorText: { fontSize: fontSize.md, fontFamily: fonts.regular, color: colors.text },
  selectorPlaceholder: { fontSize: fontSize.md, fontFamily: fonts.regular, color: colors.textMuted },
  chevron: { fontSize: fontSize.lg, fontFamily: fonts.regular, color: colors.textMuted },

  cityInputWrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  cityInput: {
    fontSize: fontSize.md,
    fontFamily: fonts.regular,
    color: colors.text,
    paddingVertical: 12,
  },

  suggestions: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionItemLast: { borderBottomWidth: 0 },
  suggestionText: { fontSize: fontSize.md, fontFamily: fonts.regular, color: colors.text },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  categoryCard: {
    width: '47%',
    aspectRatio: 1.8,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 44,
  },
  categoryCardActive: { borderColor: colors.primary, backgroundColor: '#1f1a12' },
  categoryEmoji: { fontSize: 26 },
  categoryLabel: { fontSize: fontSize.xs, fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center' },
  categoryLabelActive: { color: colors.primary },

  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.xl,
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.3 },
  buttonText: { fontSize: fontSize.md, fontFamily: fonts.bold, color: colors.background },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    maxHeight: '75%',
  },
  modalTitle: { fontSize: fontSize.lg, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing.md },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemText: { fontSize: fontSize.md, fontFamily: fonts.regular, color: colors.text },
  modalItemUF: { fontSize: fontSize.md, fontFamily: fonts.regular, color: colors.textMuted },
  modalClose: { marginTop: spacing.md, alignItems: 'center', paddingVertical: spacing.sm, minHeight: 44, justifyContent: 'center' },
  modalCloseText: { fontSize: fontSize.md, fontFamily: fonts.regular, color: colors.primary },
});
