import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Review } from '../types';
import { colors, spacing, fontSize, radius, fonts } from '../theme';
import { PRICE_LABEL } from '../data/mock';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const { width } = Dimensions.get('window');

export default function DetailScreen({ route }: Props) {
  const { place } = route.params;

  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [userReviews, setUserReviews] = useState<Review[]>(place.reviews ?? []);
  const [commentText, setCommentText] = useState('');
  const [selectedStars, setSelectedStars] = useState(5);
  const photoListRef = useRef<FlatList>(null);

  function renderStars(rating: number) {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  }

  function handleRoute() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(url);
  }

  function handlePrevPhoto() {
    const prev = Math.max(0, currentPhoto - 1);
    setCurrentPhoto(prev);
    photoListRef.current?.scrollToIndex({ index: prev, animated: true });
  }

  function handleNextPhoto() {
    const next = Math.min(place.photos.length - 1, currentPhoto + 1);
    setCurrentPhoto(next);
    photoListRef.current?.scrollToIndex({ index: next, animated: true });
  }

  function handleSubmitComment() {
    if (!commentText.trim()) return;
    const newReview: Review = {
      author: 'Você',
      rating: selectedStars,
      text: commentText.trim(),
      time: 'agora mesmo',
    };
    setUserReviews(prev => [newReview, ...prev]);
    setCommentText('');
    setSelectedStars(5);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Carrossel de fotos com setas */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={photoListRef}
            data={place.photos}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.photo}
                accessibilityLabel={`Foto de ${place.name}`}
              />
            )}
          />

          {currentPhoto > 0 && (
            <TouchableOpacity
              style={[styles.arrow, styles.arrowLeft]}
              onPress={handlePrevPhoto}
              accessibilityLabel="Foto anterior"
              accessibilityRole="button"
            >
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
          )}

          {currentPhoto < place.photos.length - 1 && (
            <TouchableOpacity
              style={[styles.arrow, styles.arrowRight]}
              onPress={handleNextPhoto}
              accessibilityLabel="Próxima foto"
              accessibilityRole="button"
            >
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          )}

          {place.photos.length > 1 && (
            <View style={styles.dots} accessibilityLabel={`Foto ${currentPhoto + 1} de ${place.photos.length}`}>
              {place.photos.map((_, i) => (
                <View key={i} style={[styles.dot, i === currentPhoto && styles.dotActive]} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.body}>

          {/* Nome e status */}
          <View style={styles.titleRow}>
            <Text style={styles.name}>{place.name}</Text>
            <View style={[styles.badge, place.openNow ? styles.badgeOpen : styles.badgeClosed]}>
              <Text style={styles.badgeText}>{place.openNow ? 'Aberto' : 'Fechado'}</Text>
            </View>
          </View>

          <Text style={styles.address}>{place.address}</Text>

          {/* Rating + Preço */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBlock}>
              <Text style={styles.ratingNumber}>{place.rating.toFixed(1)}</Text>
              <View>
                <Text style={styles.stars}>{renderStars(place.rating)}</Text>
                <Text style={styles.reviewCount}>{place.reviewCount} avaliações</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.priceBlock}>
              <Text style={styles.priceValue}>{PRICE_LABEL[place.priceLevel]}</Text>
              <Text style={styles.priceLabel}>faixa de preço</Text>
            </View>
          </View>

          {/* Botão de rota */}
          <TouchableOpacity
            style={styles.routeButton}
            onPress={handleRoute}
            accessibilityLabel="Traçar rota no Google Maps"
            accessibilityRole="button"
          >
            <Text style={styles.routeButtonText}>🗺  Traçar Rota</Text>
          </TouchableOpacity>

          {/* Avaliações */}
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Avaliações</Text>

            {userReviews.map((review, i) => (
              <View key={i} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{review.author[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.reviewAuthor}>{review.author}</Text>
                    <Text style={styles.reviewTime}>{review.time}</Text>
                  </View>
                  <Text style={styles.reviewStars}>{renderStars(review.rating)}</Text>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))}
          </View>

          {/* Campo de comentário */}
          <View style={styles.commentSection}>
            <Text style={styles.sectionTitle}>Deixe sua avaliação</Text>

            {/* Seletor de estrelas */}
            <View style={styles.starSelector}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setSelectedStars(star)}
                  style={styles.starButton}
                  accessibilityLabel={`${star} estrela${star > 1 ? 's' : ''}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: star <= selectedStars }}
                >
                  <Text style={[styles.starOption, star <= selectedStars && styles.starOptionActive]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Conte sua experiência..."
              placeholderTextColor={colors.textMuted}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              numberOfLines={3}
              accessibilityLabel="Escreva sua avaliação"
            />

            <TouchableOpacity
              style={[styles.submitButton, !commentText.trim() && styles.submitButtonDisabled]}
              onPress={handleSubmitComment}
              disabled={!commentText.trim()}
              accessibilityLabel="Enviar avaliação"
              accessibilityRole="button"
              accessibilityState={{ disabled: !commentText.trim() }}
            >
              <Text style={styles.submitButtonText}>Enviar avaliação</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  carouselContainer: { position: 'relative' },
  photo: { width, height: 280, resizeMode: 'cover' },

  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: { left: spacing.sm },
  arrowRight: { right: spacing.sm },
  arrowText: { color: '#fff', fontSize: 32, lineHeight: 36, fontFamily: fonts.regular },

  dots: {
    position: 'absolute',
    bottom: spacing.sm,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: colors.primary, width: 18 },

  body: { padding: spacing.lg },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  name: { fontSize: fontSize.xl, fontFamily: fonts.bold, color: colors.text, flex: 1 },

  badge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.sm },
  badgeOpen: { backgroundColor: 'rgba(72,199,116,0.2)' },
  badgeClosed: { backgroundColor: 'rgba(255,90,90,0.2)' },
  badgeText: { fontSize: fontSize.xs, fontFamily: fonts.bold, color: colors.text },

  address: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textMuted, marginTop: spacing.xs },

  metaRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  ratingBlock: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ratingNumber: { fontSize: fontSize.xxl, fontFamily: fonts.bold, color: colors.primary },
  stars: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.primary },
  reviewCount: { fontSize: fontSize.xs, fontFamily: fonts.regular, color: colors.textMuted },

  divider: { width: 1, height: 40, backgroundColor: colors.border, marginHorizontal: spacing.md },

  priceBlock: { flex: 1, alignItems: 'center' },
  priceValue: { fontSize: fontSize.xl, fontFamily: fonts.bold, color: colors.primary },
  priceLabel: { fontSize: fontSize.xs, fontFamily: fonts.regular, color: colors.textMuted, marginTop: 2 },

  routeButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.lg,
    minHeight: 48,
    justifyContent: 'center',
  },
  routeButtonText: { fontSize: fontSize.md, fontFamily: fonts.bold, color: colors.background },

  reviewsSection: { marginTop: spacing.xl },
  sectionTitle: { fontSize: fontSize.lg, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing.md },

  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: fontSize.md, fontFamily: fonts.bold, color: colors.background },
  reviewAuthor: { fontSize: fontSize.sm, fontFamily: fonts.bold, color: colors.text },
  reviewTime: { fontSize: fontSize.xs, fontFamily: fonts.regular, color: colors.textMuted },
  reviewStars: { marginLeft: 'auto', fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.primary },
  reviewText: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textMuted, lineHeight: 22 },

  commentSection: { marginTop: spacing.xl, paddingBottom: spacing.xl },

  starSelector: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  starButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starOption: { fontSize: 28, fontFamily: fonts.regular, color: colors.border },
  starOptionActive: { color: colors.primary },

  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
    fontFamily: fonts.regular,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  submitButtonDisabled: { opacity: 0.3 },
  submitButtonText: { fontSize: fontSize.md, fontFamily: fonts.bold, color: colors.background },
});
