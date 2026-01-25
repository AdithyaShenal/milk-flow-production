FROM osrm/osrm-backend:v5.25.0

# STEP 1: Fix the broken Debian Stretch repositories (KEEP THIS)
RUN sed -i s/deb.debian.org/archive.debian.org/g /etc/apt/sources.list && \
    sed -i 's|security.debian.org|archive.debian.org/|g' /etc/apt/sources.list && \
    sed -i '/stretch-updates/d' /etc/apt/sources.list

# STEP 2: Install python and gdown (Flag removed because pip is old)
RUN apt-get update && apt-get install -y python3-pip && \
    pip3 install gdown

WORKDIR /data

# STEP 3: Download from Google Drive (Folder ID: 1LnCHiA0l9HjE2qNvd45nPLHRE59-kAld)
RUN gdown --folder 1LnCHiA0l9HjE2qNvd45nPLHRE59-kAld -O /data/osrm_build --remaining-ok

# STEP 4: Clean up
RUN mv /data/osrm_build/* /data/ && rm -rf /data/osrm_build

EXPOSE 6000

CMD ["osrm-routed", "--algorithm", "ch", "--port", "6000", "/data/sri-lanka-latest.osrm"]