import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Place } from '../types';
import { colors, spacing, fontSize, radius, fonts } from '../theme';
import { CATEGORIES, PRICE_LABEL } from '../data/mock';
import { searchPlaces } from '../services/places';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
  const { city, state, category } = route.params;
  const categoryLabel = CATEGORIES.find(c => c.key === category)?.label ?? '';

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const results = await searchPlaces(city, state, category);
        setPlaces(results);
      } catch (e: any) {
        console.error('Places API error:', e?.message ?? e);
        setError(`Erro: ${e?.message ?? 'desconhecido'}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [city, state, category]);

  function renderStars(rating: number) {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  }

  function renderCard({ item }: { item: Place }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { place: item })}
        activeOpacity={0.85}
        accessibilityLabel={`${item.name}, avaliação ${item.rating.toFixed(1)}, ${PRICE_LABEL[item.priceLevel]}`}
        accessibilityRole="button"
      >
        {item.photos[0] ? (
          <Image
            source={{ uri: item.photos[0] }}
            style={styles.cardImage}
            accessibilityLabel={`Foto de ${item.name}`}
          />
        ) : (
          <View style={[styles.cardImage, styles.cardImageFallback]}>
            <Text style={styles.cardImageFallbackText}>📍</Text>
          </View>
        )}

        {item.openNow !== undefined && (
          <View style={[styles.badge, item.openNow ? styles.badgeOpen : styles.badgeClosed]}>
            <Text style={styles.badgeText}>{item.openNow ? 'Aberto' : 'Fechado'}</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardAddress} numberOfLines={1}>{item.address}</Text>

          <View style={styles.cardFooter}>
            <View style={styles.ratingRow}>
              <Text style={styles.stars}>{renderStars(item.rating)}</Text>
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({item.reviewCount})</Text>
            </View>
            <Text style={styles.price}>{PRICE_LABEL[item.priceLevel]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>{categoryLabel}</Text>
        <Text style={styles.location}>{city}, {state}</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Buscando lugares...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>⚠️</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : places.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyText}>Nenhum lugar encontrado</Text>
          <Text style={styles.emptySubtext}>Tente outra categoria ou cidade</Text>
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={item => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: fontSize.xl, fontFamily: fonts.bold, color: colors.text },
  location: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textMuted, marginTop: 2 },

  list: { padding: spacing.lg, gap: spacing.md },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  loadingText: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textMuted, marginTop: spacing.sm },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardImage: { width: '100%', height: 180 },
  cardImageFallback: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageFallbackText: { fontSize: 40 },

  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeOpen: { backgroundColor: 'rgba(72,199,116,0.85)' },
  badgeClosed: { backgroundColor: 'rgba(255,90,90,0.85)' },
  badgeText: { fontSize: fontSize.xs, fontFamily: fonts.bold, color: '#fff' },

  cardBody: { padding: spacing.md },
  cardName: { fontSize: fontSize.lg, fontFamily: fonts.bold, color: colors.text },
  cardAddress: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textMuted, marginTop: 2 },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stars: { color: colors.primary, fontSize: fontSize.sm, fontFamily: fonts.regular },
  ratingText: { fontSize: fontSize.sm, fontFamily: fonts.bold, color: colors.text },
  reviewCount: { fontSize: fontSize.xs, fontFamily: fonts.regular, color: colors.textMuted },
  price: { fontSize: fontSize.md, fontFamily: fonts.bold, color: colors.primary },

  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: fontSize.lg, fontFamily: fonts.bold, color: colors.text },
  emptySubtext: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textMuted },
});
