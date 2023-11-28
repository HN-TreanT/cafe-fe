import { all } from "redux-saga/effects";

import authSaga from "./auth/saga";
import stateSaga from "./state/saga";
import productSaga from "./product/saga";
import categorySaga from "./category/saga"
import comboSaga from "./combo/saga"
export default function* rootSaga() {
    yield all([
        authSaga(),
        stateSaga(),
        productSaga(),
        categorySaga(),
        comboSaga()
    ]);
}