FROM osrm/osrm-backend:v5.25.0

# Install python and gdown
RUN apt-get update && apt-get install -y python3-pip && \
    pip3 install gdown --break-system-packages

WORKDIR /data

# Download the entire folder using the Folder ID
# --folder: tells gdown it's a directory
# --remaining-ok: ensures it continues if there are many files
RUN gdown --folder 1LnCHiA0l9HjE2qNvd45nPLHRE59-kAld -O /data/osrm_build --remaining-ok

# Move files out of the subfolder if necessary
# (gdown usually creates a folder named after your Drive folder)
RUN mv /data/osrm_build/* /data/ && rm -rf /data/osrm_build

EXPOSE 6000

# Start OSRM using the file in the root /data
CMD ["osrm-routed", "--algorithm", "ch", "--port", "6000", "/data/sri-lanka-latest.osrm"]