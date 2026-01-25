FROM osrm/osrm-backend:v5.25.0

# STEP 1: Fix the broken Debian Stretch repositories
RUN sed -i s/deb.debian.org/archive.debian.org/g /etc/apt/sources.list && \
    sed -i 's|security.debian.org|archive.debian.org/|g' /etc/apt/sources.list && \
    sed -i '/stretch-updates/d' /etc/apt/sources.list

# STEP 2: Now apt-get will work! Install python and gdown
RUN apt-get update && apt-get install -y python3-pip && \
    pip3 install gdown --break-system-packages

WORKDIR /data

# STEP 3: Download your folder from Google Drive
# Make sure your folder is set to "Anyone with the link"
RUN gdown --folder 1LnCHiA0l9HjE2qNvd45nPLHRE59-kAld -O /data/osrm_build --remaining-ok

# STEP 4: Clean up the folder structure
RUN mv /data/osrm_build/* /data/ && rm -rf /data/osrm_build

EXPOSE 6000

CMD ["osrm-routed", "--algorithm", "ch", "--port", "6000", "/data/sri-lanka-latest.osrm"]