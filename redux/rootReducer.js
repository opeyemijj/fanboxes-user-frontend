/* Instruments */
import { combineReducers } from "redux";

// slices
import productReducer from "./slices/product";
import UserReducer from "./slices/user";
import WishlistReducer from "./slices/wishlist";
import CompareReducer from "./slices/compare";
import SettingsReducer from "./slices/settings";
import CategoriesReducer from "./slices/categories";
import BrandsReducer from "./slices/brands";
import ShopsReducer from "./slices/shops";
import AmbassadorsReducer from "./slices/ambassadors";

const reducer = combineReducers({
  product: productReducer,
  user: UserReducer,
  settings: SettingsReducer,
  wishlist: WishlistReducer,
  compare: CompareReducer,
  categories: CategoriesReducer,
  brands: BrandsReducer,
  shops: ShopsReducer,
  ambassadors: AmbassadorsReducer,
});

export { reducer };
