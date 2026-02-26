import urllib.request
import urllib.parse
import re

def search(query):
    quoted_query = urllib.parse.quote(query)
    url = f"https://greasyfork.org/en/scripts?q={quoted_query}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            links = re.findall(r'href="/en/scripts/(\d+-[^"]+)"', html)
            return links
    except Exception as e:
        return [f"Error: {str(e)}"]

if __name__ == "__main__":
    import sys
    queries = ["フォーム 復元", "表单恢复", "восстановление форм"]
    for q in queries:
        print(f"Results for {q}: {search(q)}")
