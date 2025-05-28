import {
  useDynamicConfig as useStatsigConfig,
  useExperiment as useStatsigExperiment,
  useFeatureGate,
} from '@statsig/react-bindings';

export const useGateValue = (gate?: string) => {
  const { value } = useFeatureGate(gate ?? '');

  return !!value;
};

export const useDynamicConfig = (key: string) => {
  const config = useStatsigConfig(key);

  return config;
};

export const useExperiment = (experiment: string) => {
  const config = useStatsigExperiment(experiment);

  return config;
};
