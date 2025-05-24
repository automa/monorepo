import process from 'node:process';

import {
  env,
  environment,
  isProduction,
  isTest,
  product,
  service,
  version,
} from './env';

import {
  api,
  logs,
  metrics,
  NodeSDK,
  resources,
  tracing,
} from '@opentelemetry/sdk-node';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { MetricExporter as GCPMetricExporter } from '@google-cloud/opentelemetry-cloud-monitoring-exporter';
import { TraceExporter as GCPTraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import {
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
  ATTR_SERVICE_NAMESPACE,
} from '@opentelemetry/semantic-conventions/incubating';
import { PrismaInstrumentation } from '@prisma/instrumentation';

const { BatchSpanProcessor, SimpleSpanProcessor } = tracing;

const { PeriodicExportingMetricReader } = metrics;

const {
  BatchLogRecordProcessor,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} = logs;

const sdk = new NodeSDK({
  autoDetectResources: false,
  resource: new resources.Resource({
    [ATTR_SERVICE_NAMESPACE]: product,
    [ATTR_SERVICE_NAME]: service,
    [ATTR_SERVICE_VERSION]: version,
    [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: environment,
  }),
  spanProcessors: !isTest
    ? [
        isProduction
          ? new BatchSpanProcessor(
              env.CLOUD
                ? new GCPTraceExporter({
                    credentials: JSON.parse(env.GCP.CREDENTIALS),
                    projectId: env.GCP.PROJECT_ID,
                  })
                : new OTLPTraceExporter({}),
            )
          : new SimpleSpanProcessor(new OTLPTraceExporter()),
      ]
    : [],
  instrumentations: [
    new PrismaInstrumentation({ middleware: true }),
    new IORedisInstrumentation(),
    new HttpInstrumentation(),
    new FastifyInstrumentation(),
    new PinoInstrumentation(),
    new GraphQLInstrumentation(),
  ],
  logRecordProcessors: !isTest
    ? [
        isProduction
          ? new BatchLogRecordProcessor(new ConsoleLogRecordExporter())
          : new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()),
      ]
    : [],
  metricReader: !isTest
    ? isProduction
      ? // new PeriodicExportingMetricReader({
        //   exporter: new GCPMetricExporter({
        //     credentials: JSON.parse(env.GCP.CREDENTIALS),
        //     projectId: env.GCP.PROJECT_ID,
        //   }),
        // })
        undefined
      : new PeriodicExportingMetricReader({
          exporter: new OTLPMetricExporter(),
        })
    : undefined,
});

sdk.start();

export const tracer = api.trace.getTracer('default');

export const meter = api.metrics.getMeter('default');

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(
      () => console.log('Telemetry shut down successfully'),
      () => console.log('Telemetry shut down failed'),
    )
    .finally(() => process.exit(0));
});
