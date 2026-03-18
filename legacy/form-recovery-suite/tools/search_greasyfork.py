import urllib.request
import re

def search(query):
    url = f"https://greasyfork.org/en/scripts?q={query.replace(' ', '+')}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        # Find script links
        links = re.findall(r'href="/en/scripts/(\d+-[^"]+)"', html)
        return links

if __name__ == "__main__":
    import sys
    q = "form recovery"
    if len(sys.argv) > 1:
        q = sys.argv[1]
    print(search(q))
