serve:
	docker run -it --rm -v "$(PWD):/workspace" -w /workspace -p 127.0.0.1:8000:8000 node:24-bookworm bash -c "npx eleventy --serve --port 8000"