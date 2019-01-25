dist/%.js: src/%.js
	node_modules/.bin/rollup -c -i $< -o $@

all: dist/react.js dist/react-dom.js
