(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _redux = __webpack_require__(37);

var initialState = {
	count: 0
};

var count = function count() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var type = action.type;

	switch (type) {
		case 'INCREASE':
			return state + 1;
		case 'DECREASE':
			return state - 1;
		default:
			return state;
	}
};

var reducers = (0, _redux.combineReducers)({ count: count });

var store = (0, _redux.createStore)(reducers, initialState);

exports.default = store;

/***/ })

}]);
//# sourceMappingURL=configStore.js.map