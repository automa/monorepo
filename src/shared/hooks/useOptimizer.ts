import {
  useGate as useStatsigGate,
  useConfig as useStatsigConfig,
  useExperiment as useStatsigExperiment,
} from 'statsig-react';

export const useGate = (gate: string) => {
  const { value } = useStatsigGate(gate);

  return !!value;
};

export const useConfig = (key: string) => {
  const { config } = useStatsigConfig(key);

  return config;
};

export const useExperiment = (experiment: string) => {
  const { config } = useStatsigExperiment(experiment);

  return config;
};
