import { Category, Place } from "../types";

export const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: "restaurant", label: "Restaurantes", emoji: "🍽️" },
  { key: "bar", label: "Bares", emoji: "🍺" },
  { key: "nightclub", label: "Baladas", emoji: "🎶" },
  { key: "burger", label: "Hamburguerias", emoji: "🍔" },
  { key: "pizza", label: "Pizzarias", emoji: "🍕" },
  { key: "cafe", label: "Cafés", emoji: "☕" },
  { key: "icecream", label: "Sorveterias", emoji: "🍦" },
  { key: "cinema", label: "Cinemas", emoji: "🎬" },
  { key: "park", label: "Parques", emoji: "🌳" },
  { key: "rooftop", label: "Rooftops", emoji: "🌆" },
];

export const MOCK_PLACES: Place[] = [
  {
    id: "1",
    name: "Xapuri Restaurante",
    category: "restaurant",
    address: "R. Mandacaru, 260 - Pampulha, Belo Horizonte",
    rating: 4.7,
    reviewCount: 1842,
    priceLevel: 3,
    openNow: true,
    latitude: -19.8509,
    longitude: -43.9706,
    photos: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    ],
    reviews: [
      {
        author: "Mariana S.",
        rating: 5,
        text: "Ambiente incrível, comida mineira autêntica. Recomendo o frango com quiabo.",
        time: "há 2 dias",
      },
      {
        author: "Pedro L.",
        rating: 4,
        text: "Ótimo para um jantar especial. O atendimento é impecável.",
        time: "há 1 semana",
      },
    ],
  },
  {
    id: "2",
    name: "Bar do Museu",
    category: "bar",
    address: "Av. Otacílio Negrão de Lima - Pampulha, Belo Horizonte",
    rating: 4.5,
    reviewCount: 934,
    priceLevel: 2,
    openNow: true,
    latitude: -19.8612,
    longitude: -43.9681,
    photos: [
      "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=800",
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800",
    ],
    reviews: [
      {
        author: "Lucas M.",
        rating: 5,
        text: "Vista para a lagoa da Pampulha. Perfeito para o fim do dia.",
        time: "há 3 dias",
      },
    ],
  },
  {
    id: "3",
    name: "Deck Rooftop BH",
    category: "rooftop",
    address: "R. Fernandes Tourinho, 460 - Funcionários, Belo Horizonte",
    rating: 4.6,
    reviewCount: 612,
    priceLevel: 3,
    openNow: false,
    latitude: -19.9325,
    longitude: -43.9345,
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ],
    reviews: [
      {
        author: "Ana P.",
        rating: 5,
        text: "Vista linda da cidade. Os drinques são excelentes.",
        time: "há 5 dias",
      },
    ],
  },
];

export const PRICE_LABEL: Record<number, string> = {
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$",
};

export const BRAZILIAN_STATES = [
  { uf: "AC", name: "Acre" },
  { uf: "AL", name: "Alagoas" },
  { uf: "AP", name: "Amapá" },
  { uf: "AM", name: "Amazonas" },
  { uf: "BA", name: "Bahia" },
  { uf: "CE", name: "Ceará" },
  { uf: "DF", name: "Distrito Federal" },
  { uf: "ES", name: "Espírito Santo" },
  { uf: "GO", name: "Goiás" },
  { uf: "MA", name: "Maranhão" },
  { uf: "MT", name: "Mato Grosso" },
  { uf: "MS", name: "Mato Grosso do Sul" },
  { uf: "MG", name: "Minas Gerais" },
  { uf: "PA", name: "Pará" },
  { uf: "PB", name: "Paraíba" },
  { uf: "PR", name: "Paraná" },
  { uf: "PE", name: "Pernambuco" },
  { uf: "PI", name: "Piauí" },
  { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "RN", name: "Rio Grande do Norte" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "RO", name: "Rondônia" },
  { uf: "RR", name: "Roraima" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "SP", name: "São Paulo" },
  { uf: "SE", name: "Sergipe" },
  { uf: "TO", name: "Tocantins" },
];
