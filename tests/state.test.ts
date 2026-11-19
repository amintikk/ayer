import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lonLatToTile, SURVEYS, tileBbox } from '../src/data/layers.ts';
import { PLACE_TEXT } from '../src/data/place-text.ts';
import { PLACES } from '../src/data/places.ts';
import { wktCoords } from '../src/map/search.ts';
import { parse, serialize } from '../src/map/state.ts';

const ids = new Set(SURVEYS.map((s) => s.id));

test('a shared view survives a round trip through the URL', () => {
  const v = parse('?lat=38.5365&lon=-0.1275&z=14.6&a=ams&b=actual&m=cortina', ids);
  assert.equal(v.curtain, true);
  assert.equal(v.a, 'ams');
  const back = parse(serialize(v), ids);
  assert.deepEqual({ ...back, lat: +back.lat.toFixed(4), lon: +back.lon.toFixed(4) }, { ...v, lat: 38.5365, lon: -0.1275 });
});

test('bad parameters fall back to the defaults', () => {
  const v = parse('?lat=91&lon=abc&y=evil', ids);
  assert.equal(v.z < 7, true);
  assert.equal(ids.has(v.y), true);
});

test('tile maths: Benidorm at z16', () => {
  const [x, y] = lonLatToTile(-0.13, 38.538, 16);
  assert.deepEqual([x, y], [32744, 25154]);
  const b = tileBbox(16, x, y).split(',').map(Number);
  assert.ok(Math.abs(b[0]! - -14675.909) < 0.01);
});

test('WKT geometries give their coordinates', () => {
  assert.deepEqual(wktCoords('LINESTRING(-0.13 38.53,-0.12 38.54)'), [
    [-0.13, 38.53],
    [-0.12, 38.54],
  ]);
});

test('every gallery place has text in both languages and valid surveys', () => {
  for (const p of PLACES) {
    assert.ok(PLACE_TEXT[p.slug]?.es.body.length && PLACE_TEXT[p.slug]?.en.body.length, p.slug);
    assert.ok(ids.has(p.from) && ids.has(p.to), p.slug);
  }
  assert.ok(PLACES.length >= 15 && PLACES.length <= 20);
});
