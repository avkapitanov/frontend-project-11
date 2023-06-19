import './styles.scss';
import 'bootstrap';
import runApp from './view';
import getInitialState from './state';

const initialState = getInitialState();
runApp(initialState);
