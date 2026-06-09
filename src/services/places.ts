import { Place, Review, Category } from "../types";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? "";

const BASE_URL = "https://places.googleapis.com/v1";

// Mapeamento de categoria do app para tipo do Google Places
const CATEGORY_TO_GOOGLE_TYPE: Record<Category, string> = {
  restaurant: "restaurant",
  bar: "bar",
  nightclub: "night_club",
  burger: "hamburger_restaurant",
  pizza: "pizza_restaurant",
  cafe: "cafe",
  icecream: "ice_cream_shop",
  cinema: "movie_theater",
  park: "park",
  rooftop: "bar", // rooftop não tem tipo próprio, usamos bar
};

// Converte nível de preço do Google (0-4) para nosso formato (1-4)
function parsePriceLevel(level?: string): 1 | 2 | 3 | 4 {
  const map: Record<string, 1 | 2 | 3 | 4> = {
    PRICE_LEVEL_FREE: 1,
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4,
  };
  return map[level ?? ""] ?? 2;
}

// Busca foto do lugar pelo nome do recurso
function buildPhotoUrl(photoName: string): string {
  return `${BASE_URL}/${photoName}/media?maxHeightPx=800&maxWidthPx=800&key=${API_KEY}&skipHttpRedirect=false`;
}

// Busca lugares por cidade e categoria
export async function searchPlaces(
  city: string,
  state: string,
  category: Category,
): Promise<Place[]> {
  const googleType = CATEGORY_TO_GOOGLE_TYPE[category];

  const body = {
    textQuery: `${googleType} em ${city}, ${state}, Brasil`,
    languageCode: "pt-BR",
    maxResultCount: 10,
    locationBias: {
      circle: {
        center: { latitude: -14.235, longitude: -51.925 }, // centro do Brasil como fallback
        radius: 50000.0,
      },
    },
  };

  const response = await fetch(`${BASE_URL}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.userRatingCount",
        "places.priceLevel",
        "places.currentOpeningHours",
        "places.photos",
        "places.location",
        "places.reviews",
      ].join(","),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Places API error: ${response.status}`);
  }

  const data = await response.json();
  const rawPlaces = data.places ?? [];

  return rawPlaces.map(
    (p: any): Place => ({
      id: p.id,
      name: p.displayName?.text ?? "Sem nome",
      category,
      address: p.formattedAddress ?? "",
      rating: p.rating ?? 0,
      reviewCount: p.userRatingCount ?? 0,
      priceLevel: parsePriceLevel(p.priceLevel),
      openNow: p.currentOpeningHours?.openNow ?? undefined,
      latitude: p.location?.latitude ?? 0,
      longitude: p.location?.longitude ?? 0,
      photos: (p.photos ?? [])
        .slice(0, 5)
        .map((photo: any) => buildPhotoUrl(photo.name)),
      reviews: (p.reviews ?? []).slice(0, 3).map(
        (r: any): Review => ({
          author: r.authorAttribution?.displayName ?? "Anônimo",
          rating: r.rating ?? 5,
          text: r.text?.text ?? "",
          time: r.relativePublishTimeDescription ?? "",
        }),
      ),
    }),
  );
}
