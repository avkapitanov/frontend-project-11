import './styles.scss';
import 'bootstrap';
import runApp from './app';
import getInitialState from './state';

const initialState = getInitialState();
runApp(initialState);
