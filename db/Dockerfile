ARG postgresql_major=15
ARG postgresql_release=${postgresql_major}.4

ARG pg_jsonschema_release=0.3.1

####################
# Postgres
####################
FROM postgres:${postgresql_release} AS base

# Redeclare args for use in subsequent stages
ARG TARGETARCH
ARG postgresql_major

####################
# Extension: pg_jsonschema
####################
FROM base AS pg_jsonschema

# Download package archive
ARG pg_jsonschema_release
ADD "https://github.com/supabase/pg_jsonschema/releases/download/v${pg_jsonschema_release}/pg_jsonschema-v${pg_jsonschema_release}-pg${postgresql_major}-${TARGETARCH}-linux-gnu.deb" \
    /tmp/pg_jsonschema.deb

####################
# Collect extension packages
####################
FROM scratch AS extensions
COPY --from=pg_jsonschema /tmp/*.deb /tmp/

####################
# Build final image
####################
FROM base AS production

# Setup extensions
COPY --from=extensions /tmp /tmp

RUN apt-get update && apt-get install -y --no-install-recommends \
    /tmp/*.deb \
    && rm -rf /var/lib/apt/lists/* /tmp/*
