import { AuthActions } from "./auth/actions";
import { StateAction } from "./state/actions";
import { ProductActions } from "./product/actions";
import { categoryAction } from "./category/actions"
import { comboAction } from "./combo/actions";
import { OrderActions } from "./order/actions";
const useAction = () => {
  const actions = {
    AuthActions,
    StateAction,
    ProductActions,
    categoryAction,
    comboAction,
    OrderActions
  };
  return actions
}
export default useAction;