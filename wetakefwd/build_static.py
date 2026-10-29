"""Render public pages to dist/. No application server is needed after export."""
from pathlib import Path
import shutil
from html.parser import HTMLParser
from urllib.parse import urlsplit

from flask import render_template
from app import app, SERVICES

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT.parent / 'dist'


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.targets = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        for key in ('href', 'src', 'action'):
            target = attrs.get(key, '')
            if target.startswith('/') and not target.startswith('//'):
                self.targets.append(urlsplit(target).path)


def build():
    OUTPUT.mkdir(exist_ok=True)
    shutil.copytree(ROOT / 'static', OUTPUT / 'static', dirs_exist_ok=True)
    routes = ['/','/services'] + ['/services/' + item['slug'] for item in SERVICES]
    with app.test_client() as client:
        for route in routes:
            response = client.get(route)
            if response.status_code != 200:
                raise RuntimeError(f'Cannot export {route}: {response.status_code}')
            destination = OUTPUT / route.strip('/') / 'index.html'
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(response.data)
        for name in ('robots.txt', 'sitemap.xml'):
            response = client.get('/' + name)
            if response.status_code != 200:
                raise RuntimeError(f'Cannot export {name}')
            (OUTPUT / name).write_bytes(response.data)
    with app.test_request_context('/'):
        thanks = render_template('thank_you.html')
    (OUTPUT / 'thank-you').mkdir(exist_ok=True)
    (OUTPUT / 'thank-you' / 'index.html').write_text(thanks, encoding='utf-8')
    for page in OUTPUT.rglob('*.html'):
        html = page.read_text(encoding='utf-8')
        if '{{' in html or '{%' in html:
            raise RuntimeError(f'Unrendered template in {page}')
        links = Links()
        links.feed(html)
        for link in links.targets:
            target = OUTPUT / link.lstrip('/')
            if not target.is_file() and not (target / 'index.html').is_file():
                raise RuntimeError(f'Missing target {link} in {page}')
    home = (OUTPUT / 'index.html').read_text(encoding='utf-8')
    assert 'action="https://formsubmit.co/wetakefwd@gmail.com"' in home
    assert 'name="_honey"' in home
    assert not (OUTPUT / 'admin').exists()
    assert not (OUTPUT / 'contact').exists()
    print(f'Exported and checked {len(routes) + 1} public HTML pages in {OUTPUT}')


if __name__ == '__main__':
    build()
