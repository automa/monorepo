import process from 'process';

import {
  NodeSDK,
  api,
  resources,
  tracing,
  logs,
  metrics,
} from '@opentelemetry/sdk-node';
import { logs as logsAPI } from '@opentelemetry/api-logs';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { TraceExporter as GCPTraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MetricExporter as GCPMetricExporter } from '@google-cloud/opentelemetry-cloud-monitoring-exporter';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';

export { SeverityNumber } from '@opentelemetry/api-logs';

const {
  BatchSpanProcessor,
  SimpleSpanProcessor,
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
} = tracing;

const { PeriodicExportingMetricReader } = metrics;

const {
  BatchLogRecordProcessor,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} = logs;

import {
  environment,
  isTest,
  isProduction,
  env,
  product,
  service,
  version,
} from './env';

const sdk = new NodeSDK({
  resource: new resources.Resource({
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: product,
    [SemanticResourceAttributes.SERVICE_NAME]: service,
    [SemanticResourceAttributes.SERVICE_VERSION]: version,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
  }),
  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(env.OTEL.TRACES.SAMPLER_ARG),
  }),
  spanProcessor: !isTest
    ? isProduction
      ? new BatchSpanProcessor(
          new GCPTraceExporter({
            credentials: JSON.parse(env.GCP.CREDENTIALS),
            projectId: env.GCP.PROJECT_ID,
          }),
        )
      : new SimpleSpanProcessor(new OTLPTraceExporter())
    : undefined,
  instrumentations: [
    new PrismaInstrumentation({ middleware: true }),
    new IORedisInstrumentation(),
    new HttpInstrumentation(),
    new FastifyInstrumentation(),
    new GraphQLInstrumentation(),
  ],
  logRecordProcessor: !isTest
    ? isProduction
      ? new BatchLogRecordProcessor(new ConsoleLogRecordExporter())
      : new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
    : undefined,
  metricReader: !isTest
    ? isProduction
      ? // new PeriodicExportingMetricReader({
        //   exporter: new GCPMetricExporter({
        //     credentials: JSON.parse(env.GCP.CREDENTIALS),
        //     projectId: env.GCP.PROJECT_ID,
        //   }),
        // })
        undefined
      : new PrometheusExporter()
    : undefined,
});

sdk.start();

export const tracer = api.trace.getTracer('default');

export const logger = logsAPI.getLogger('default');

export const meter = api.metrics.getMeter('default');

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(
      () => console.log('Telemetry shut down successfully'),
      () => console.log('Telemetry shut down failed'),
    )
    .finally(() => {
      process.exit(0);
    });
});
