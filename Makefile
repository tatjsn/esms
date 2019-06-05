dist/lit-element.js: node_modules/lit-element/lit-element.js
	node_modules/.bin/rollup -c -i $< -o $@

dist/lit-connect.js: src/lit-connect.js
	node_modules/.bin/rollup -c -i $< -e lit-element | sed -E 's|from"lit-element"|from"./lit-element.js"|' > $@

dist/react-spring.js: node_modules/react-spring/web.js
	node_modules/.bin/rollup -c -i $< -e react | sed -E 's|from"react"|from"./react.js"|' > $@

dist/%.js: src/%.js
	node_modules/.bin/rollup -c -i $< -o $@

all: dist/lit-element.js dist/lit-connect.js dist/react-spring.js dist/react.js dist/react-dom.js
