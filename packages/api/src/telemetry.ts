import process from 'process';

import {
  NodeSDK,
  api,
  resources,
  tracing,
  metrics,
} from '@opentelemetry/sdk-node';
import {
  LoggerProvider,
  BatchLogRecordProcessor,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} from '@opentelemetry/sdk-logs';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';

const {
  BatchSpanProcessor,
  SimpleSpanProcessor,
  ConsoleSpanExporter,
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
} = tracing;

const { PeriodicExportingMetricReader, ConsoleMetricExporter } = metrics;

import { environment, isProduction, env } from './env';

const loggerProvider = new LoggerProvider();

loggerProvider.addLogRecordProcessor(
  isProduction
    ? new BatchLogRecordProcessor(new ConsoleLogRecordExporter())
    : new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()),
);

const sdk = new NodeSDK({
  resource: new resources.Resource({
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'automa',
    [SemanticResourceAttributes.SERVICE_NAME]: 'api',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
  }),
  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(env.OTEL.TRACES.SAMPLING_RATE),
  }),
  spanProcessor: isProduction
    ? new BatchSpanProcessor(new ConsoleSpanExporter())
    : new SimpleSpanProcessor(new OTLPTraceExporter()),
  instrumentations: [
    new PrismaInstrumentation({ middleware: true }),
    new IORedisInstrumentation(),
    new HttpInstrumentation(),
    new FastifyInstrumentation(),
    new GraphQLInstrumentation(),
  ],
  metricReader: isProduction
    ? new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
        exportIntervalMillis: env.OTEL.METRICS.EXPORT_INTERVAL,
      })
    : new PrometheusExporter(),
});

sdk.start();

export const logger = loggerProvider.getLogger('default');

export const tracer = api.trace.getTracer('default');

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
