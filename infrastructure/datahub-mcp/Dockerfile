FROM node:22-bookworm-slim

ARG SUPERGATEWAY_VERSION=3.4.3
ARG DATAHUB_MCP_VERSION=0.6.0

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates python3 python3-venv \
    && rm -rf /var/lib/apt/lists/* \
    && npm install --global "supergateway@${SUPERGATEWAY_VERSION}" \
    && python3 -m venv /opt/datahub-mcp \
    && /opt/datahub-mcp/bin/pip install --no-cache-dir "mcp-server-datahub==${DATAHUB_MCP_VERSION}"

ENV PATH="/opt/datahub-mcp/bin:${PATH}"

RUN useradd --create-home --uid 10001 app
USER app

EXPOSE 8000

ENTRYPOINT ["supergateway"]
CMD ["--stdio", "mcp-server-datahub", "--outputTransport", "streamableHttp", "--stateful", "--sessionTimeout", "60000", "--streamableHttpPath", "/mcp", "--port", "8000", "--logLevel", "info"]
