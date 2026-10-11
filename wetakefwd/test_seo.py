import json
import re
import unittest
from urllib.parse import urlsplit
from xml.etree import ElementTree
import app as site


class SeoTests(unittest.TestCase):
    def test_sitemap_pages_have_unique_metadata_and_resolved_entities(self):
        client = site.app.test_client()
        root = ElementTree.fromstring(client.get('/sitemap.xml').data)
        titles = set()
        descriptions = set()
        for loc in root.findall('.//{*}loc'):
            with self.subTest(url=loc.text):
                response = client.get(urlsplit(loc.text).path)
                self.assertEqual(response.status_code, 200)
                html = response.get_data(as_text=True)
                self.assertEqual(len(re.findall(r'<h1(?:\s|>)', html)), 1)
                self.assertIn('href="' + loc.text + '"', html)
                title = re.search(r'<title>(.*?)</title>', html).group(1)
                description = re.search(r'<meta name="description" content="(.*?)"', html).group(1)
                self.assertNotIn(title, titles)
                self.assertNotIn(description, descriptions)
                titles.add(title)
                descriptions.add(description)
                self.assertNotIn('noindex', response.headers.get('X-Robots-Tag', ''))
                schemas = [json.loads(value) for value in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)]
                self.assertEqual(sum(s.get('@type') == 'Organization' for s in schemas), 1)
                self.assertEqual(sum(s.get('@type') == 'WebSite' for s in schemas), 1)
                for href in re.findall(r'href="(/[^"#]*)"', html):
                    self.assertLess(client.get(href).status_code, 400)
        self.assertEqual(len(titles), len(site.SERVICES) + 2)

    def test_non_search_pages_are_noindex(self):
        client = site.app.test_client()
        for path in ['/login', '/admin', '/success', '/missing', '/services/missing']:
            self.assertIn('noindex', client.get(path).headers.get('X-Robots-Tag', ''))

    def test_faq_schema_matches_visible_answers(self):
        html = site.app.test_client().get('/').get_data(as_text=True)
        from markupsafe import escape
        for item in site.HOME_FAQ:
            self.assertIn(str(escape(item['question'])), html)
            self.assertIn(str(escape(item['answer'])), html)
