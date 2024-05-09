import re
import sys
from xml.etree import ElementTree

from shapely import Point, MultiPoint

nodes = dict()
ways = dict()

print("[")
first = True
things = {'node', 'way', 'relation'}

def find_height(elem):
    for child in elem:
        if child.tag == 'tag' and child.attrib["k"] == "height":
            # there are a few noncompliant heights...
            poss_height = child.attrib["v"].split(";")[0]
            try:
                return float(poss_height)
            except ValueError:
                pass

def print_line(lat, lon, height):
    global first

    if not first:
        print(",")
    else:
        first = False

    print(f"[{lat}, {lon}, {height}]", end='')

for _, elem in ElementTree.iterparse(sys.argv[1], ("end",)):
    if elem.tag not in things:
        continue

    id_ = elem.attrib["id"]

    if elem.tag == 'node':
        lat = elem.attrib["lat"]
        lon = elem.attrib["lon"]
        nodes[id_] = Point(float(lat), float(lon))
        if (height := find_height(elem)) is not None:
            print_line(lat, lon, height)
    elif elem.tag == 'way':
        points = [nodes[child.attrib["ref"]] for child in elem if child.tag == 'nd']
        centroid = MultiPoint(points).centroid
        ways[id_] = centroid
        if (height := find_height(elem)) is not None:
            print_line(centroid.x, centroid.y, height)
    elif elem.tag == 'relation':
        # i guess just take the first one? idk
        point = None
        for child in elem:
            if child.tag == 'member':
                if child.attrib["type"] == "node":
                    point = nodes[child.attrib["ref"]]
                elif child.attrib["type"] == "way":
                    point = ways[child.attrib["ref"]]
                break
        if point is not None and (height := find_height(elem)) is not None:
            print_line(point.x, point.y, height)

print("]")
