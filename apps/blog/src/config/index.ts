import configs from './config.default';
import { FactoryContainer } from '@jimizai/injectable';
import { INJECT_CONFIG } from '../constants';

export type FoxxConfig = typeof configs;

FactoryContainer.bind(INJECT_CONFIG, configs);
