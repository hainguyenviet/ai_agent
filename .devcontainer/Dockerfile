FROM mcr.microsoft.com/devcontainers/javascript-node:22-bullseye

# Cài thêm dependencies nếu cần
RUN apt-get update && apt-get install -y --no-install-recommends sqlite3 && rm -rf /var/lib/apt/lists/*

# Thiết lập thư mục ẩn
WORKDIR /workspace
