# Variabel
PM := npm # Ganti menjadi pnpm atau yarn jika diperlukan
NODE_BIN := ./node_modules/.bin

.PHONY: help install dev build start lint clean test

# Perintah default (menampilkan daftar perintah)
help:
	@echo "Perintah yang tersedia:"
	@echo "  make install  - Instal dependensi"
	@echo "  make dev      - Jalankan server pengembangan"
	@echo "  make build    - Build aplikasi untuk produksi"
	@echo "  make start    - Jalankan aplikasi hasil build"
	@echo "  make lint     - Jalankan pemeriksaan linter"
	@echo "  make clean    - Hapus folder .next dan node_modules"
	@echo "  make test     - Jalankan unit testing"

# Instalasi
install:
	$(PM) install

# Pengembangan
dev:
	$(PM) run dev

# Produksi
build:
	$(PM) run build

start:
	$(PM) run start

# Kualitas Kode
lint:
	$(PM) run lint

test:
	$(PM) run test

# Pembersihan
clean:
	rm -rf .next
	rm -rf node_modules
	@echo "Folder .next dan node_modules telah dihapus."