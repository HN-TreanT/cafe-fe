import AuthReducer from "./auth/reducer";
import StateReducer from "./state/reducer";
import ProductReducer from "./product/reducer";
import CategoryReducer from "./category/reducer";
import ComboReducer from "./combo/reducer";
const rootReducer = {
    auth: AuthReducer,
    state: StateReducer,
    product: ProductReducer,
    category: CategoryReducer,
    combo: ComboReducer
};

export default rootReducer;