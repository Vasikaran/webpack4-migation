import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';

import style from './app.css';

require.ensure(
	[],
	() => {
		let store = require('./configStore').default;
		renderApp(store);
	},
	'configStore'
);

class Counter extends Component {
	render() {
		let { count, countIncrease, countDecrease } = this.props;
		return (
			<div>
				<div className={style.count}>{count}</div>
				<button className={style.button} onClick={countIncrease}>
					Increase
				</button>
				<button className={style.button} onClick={countDecrease}>
					Decrease
				</button>
			</div>
		);
	}
}

let countIncrease = () => {
	return { type: 'INCREASE' };
};

let countDecrease = () => {
	return { type: 'DECREASE' };
};

let HOCCounter = connect(state => state, { countIncrease, countDecrease })(
	Counter
);

let renderApp = store => {
	ReactDOM.render(
		<Provider store={store}>
			<HOCCounter />
		</Provider>,
		document.getElementById('target')
	);
};
