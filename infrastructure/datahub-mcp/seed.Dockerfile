FROM python:3.12-slim-bookworm

RUN pip install --no-cache-dir "acryl-datahub==1.5.0.6"

WORKDIR /seed
COPY seed_catalog.py /seed/seed_catalog.py

ENTRYPOINT ["python", "/seed/seed_catalog.py"]
