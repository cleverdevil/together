'''
Fetches h-feeds from a number of sources, then converts them to JSON, and dumps
them to disk:

    data/
        source.com/
            YYYY-MM-DDTHH:MM:SS+ZZ:ZZ.js
            ...

Each item in the feed will have a single file associated with it, named
by the timestamp of the item, with a .js extension.

This script requires:

* Python 3.6
* mf2py

Sources are contained in the `sources` list at the top of the script.
'''

from urllib.parse import urlparse

import mf2py
import json
import os


sources = [
    'https://cleverdevil.io/content/all',
    'https://grant.codes',
    'http://aaronparecki.com',
    'http://tantek.com'
]


def mkdir(source):
    dirname = urlparse(source).netloc

    try:
        os.mkdir('data/' + dirname)
    except FileExistsError:
        pass

    return dirname


for source in sources:
    data = mf2py.parse(url=source)
    data = (d for d in data['items'] if d['type'] != ['h-card'])

    directory = mkdir(source)

    for item in data:
        json_item = json.dumps(item, indent=4, separators=(', ', ': '))

        filename = item['properties']['published'][0]
        with open('data/' + directory + '/' + filename + '.js', 'w') as f:
            f.write(json_item)
