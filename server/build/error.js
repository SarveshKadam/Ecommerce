"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductErrors = exports.UserErrors = void 0;
var UserErrors;
(function (UserErrors) {
    UserErrors["NO_USER_FOUND"] = "no-user-found";
    UserErrors["WRONG_CREDENTIALS"] = "wrong-credentials";
    UserErrors["USER_ALREADY_EXISTS"] = "user-already-exist";
    UserErrors["NOT_ENOUGH_BALANCE"] = "not-enough-balance";
})(UserErrors || (exports.UserErrors = UserErrors = {}));
var ProductErrors;
(function (ProductErrors) {
    ProductErrors["NO_PRODUCT_FOUND"] = "no-product-found";
    ProductErrors["STOCK_EMPTY"] = "stock-empty";
})(ProductErrors || (exports.ProductErrors = ProductErrors = {}));
