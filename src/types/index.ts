export type Category =
  | "restaurant"
  | "bar"
  | "nightclub"
  | "burger"
  | "pizza"
  | "cafe"
  | "icecream"
  | "cinema"
  | "park"
  | "rooftop";

export interface Place {
  id: string;
  name: string;
  category: Category;
  address: string;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4; // $ $$ $$$ $$$$
  photos: string[];
  latitude: number;
  longitude: number;
  openNow?: boolean;
  reviews?: Review[];
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  time: string;
}

export type RootStackParamList = {
  Home: undefined;
  Results: {
    city: string;
    state: string;
    category: Category;
  };
  Detail: {
    place: Place;
  };
};
