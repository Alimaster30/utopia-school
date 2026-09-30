import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const manifest = JSON.parse(await readFile(new URL('../asset-manifest.json', import.meta.url), 'utf8'));
const base = process.env.CLONE_URL || 'http://127.0.0.1:3001';
const unavailable = new Set(manifest.unavailablePages || []);
const routes = [...manifest.pages.filter(url => !unavailable.has(url)).map(url => new URL(url).pathname), ...Object.keys(manifest.queryRoutes || {}), ...manifest.assets.filter(x => x.status === 'downloaded').map(x => '/' + x.local)];
const failures = [];
const hash = body => createHash('sha256').update(body).digest('hex');
for (let index = 0; index < routes.length; index += 12) {
  await Promise.all(routes.slice(index, index + 12).map(async route => {
    const response = await fetch(new URL(route, base), { method: 'HEAD' });
    if (response.status !== 200) failures.push(`${route}: ${response.status}`);
  }));
}
const filters = JSON.parse(await readFile(new URL('../public/query-routes.json', import.meta.url), 'utf8'));
for (const [route, file] of Object.entries(filters)) {
  const response = await fetch(new URL(route, base));
  const expected = await readFile(new URL('../public/' + file, import.meta.url));
  if (response.status !== 200 || hash(Buffer.from(await response.arrayBuffer())) !== hash(expected)) {
    failures.push(`${route}: filtered page content mismatch`);
  }
}
for (const fragment of ['chooseGuide', 'slideshow-702', 'slideshow-704']) {
  const params = fragment === 'chooseGuide' ? { action: 'chooseGuide' } : { action: 'slideshow', id: fragment.split('-')[1], page: '/' };
  const response = await fetch(base + '/wp-admin/admin-ajax.php', { method: 'POST', body: new URLSearchParams(params) });
  const expected = await readFile(new URL('../public/fragments/' + fragment + '.html', import.meta.url));
  if (response.status !== 200 || hash(Buffer.from(await response.arrayBuffer())) !== hash(expected)) failures.push(`${fragment}: AJAX content mismatch`);
}
const movie = manifest.assets.find(x => x.contentType === 'video/mp4');
const video = await fetch(new URL('/' + movie.local, base), { headers: { Range: 'bytes=0-1023' } });
if (video.status !== 206 || (await video.arrayBuffer()).byteLength !== 1024) failures.push('MP4 byte-range playback failed');
console.log(`${routes.length} page/asset routes, ${Object.keys(filters).length} filter bodies, 3 AJAX fragments, and MP4 byte-range playback checked.`);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; } else console.log('All server checks passed.');
