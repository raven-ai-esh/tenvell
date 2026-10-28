"""Regression for the user's real Cyrillic lowercase-height failure.

Reads the generated binary, not the master implementation. Run with a font
directory argument; v0.2 is the captured negative control.
"""
import json
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen

directory=Path(sys.argv[1] if len(sys.argv)>1 else 'public/fonts')
results=[]
for file in sorted(directory.glob('*.ttf')):
    font=TTFont(file)
    glyphs=font.getGlyphSet()
    cmap=font.getBestCmap()
    x_height=font['OS/2'].sxHeight
    cap_height=font['OS/2'].sCapHeight
    for char in 'кнпимшщъыьэюя':
        pen=BoundsPen(glyphs)
        glyphs[cmap[ord(char)]].draw(pen)
        left,bottom,right,top=pen.bounds
        assert top<=x_height+18, f'{file.name}: lowercase {char} reaches{top}, x-height{x_height}; cap-height{cap_height}'
        assert top>=x_height-18, f'{file.name}: lowercase {char} too short: {top}'
        assert right>left, f'{file.name}: empty lowercase {char}'
        results.append({'face':file.name,'character':char,'top':top,'xHeight':x_height})
    # Vertical terminals of Cyrillicк must align with lowercaseн, not Latin k.
    def bounds(c):
        p=BoundsPen(glyphs);glyphs[cmap[ord(c)]].draw(p);return p.bounds
    assert bounds('k')[3]>bounds('к')[3]+150, f'{file.name}: Cyrillicк incorrectly aliases Latin ascender k'
    assert bounds('К')[3]>bounds('к')[3]+150, f'{file.name}: lowercaseк has capital height'
assert len(results)==52, f'Expected four faces and thirteen Cyrillic letters: {len(results)}'
print(json.dumps({'status':'passed','checks':len(results),'binaryGeometry':results},ensure_ascii=False,indent=2))
