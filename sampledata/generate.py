'''
Fetches h-feeds from a number of sources, then converts them to JF2, and dumps
them to disk:

    data/
        source.com/
            <uuid>.js
            ...

Each item in the feed will have a single file associated with it, named with a
random uuid and a '.js' extension.

This script requires Python 3.6.

Sources are contained in the `sources` list at the top of the script.
'''

from urllib.parse import urlparse, urlencode
from urllib.request import urlopen

import uuid
import json
import os


sources = [
    'https://cleverdevil.io/content/all',
    'https://grant.codes',
    'http://aaronparecki.com',
    'http://tantek.com',
    'http://known.kevinmarks.com'
]


def mkdir(source):
    dirname = urlparse(source).netloc

    try:
        os.mkdir('data/' + dirname)
    except FileExistsError:
        pass

    return dirname


for source in sources:
    print('Fetching', source)

    jf2_url = 'http://stream.thatmustbe.us/?' + urlencode(dict(url=source))
    with urlopen(jf2_url) as response:
        data = response.read()

        directory = mkdir(source)

        for item in json.loads(data)['children']:
            if item['type'] == 'card':
                continue

            json_item = json.dumps(item, indent=4, separators=(', ', ': '))

            filename = str(uuid.uuid4())
            with open('data/' + directory + '/' + filename + '.js', 'w') as f:
                f.write(json_item)
