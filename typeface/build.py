"""Lamina UI: original glyph drawings for the independent thin-glass kit.

No existing font is read, traced or used as an outline source. The contour
master is master.py; this file packages it into TrueType and WOFF2 files.
"""
from __future__ import annotations
import json
import math
import os
from pathlib import Path
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.ttLib import TTFont
from shapely.geometry import LineString, Point, GeometryCollection
from shapely.geometry.polygon import orient
from shapely.ops import unary_union
from shapely.affinity import translate, scale

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get("LAMINA_OUT",str(ROOT/"public"/"fonts")))
OUT.mkdir(parents=True,exist_ok=True)
UPEM=1000
VERSION="0.3"

from master import make_master

def glyph_name(char):
    return "space" if char==" " else "uni%04X"%ord(char)

def package(weight,mono=False):
    drawings=make_master(weight)
    glyph_order=[".notdef"]+[glyph_name(c) for c in sorted(drawings,key=ord)]
    notdef=LineString([(80,30),(80,670),(500,670),(500,30),(80,30)]).buffer(24,quad_segs=6)
    shapes={".notdef":(590,notdef)}
    for char,(advance,geometry) in drawings.items():
        if mono:
            if not geometry.is_empty:
                factor=min(1,600/(geometry.bounds[2]-geometry.bounds[0]))
                geometry=scale(geometry,xfact=factor,yfact=1,origin=(0,0))
                geometry=translate(geometry,xoff=350-(geometry.bounds[0]+geometry.bounds[2])/2)
            advance=700
        shapes[glyph_name(char)]=(advance,geometry)
    outlines={};metrics={}
    for name in glyph_order:
        advance,geometry=shapes[name];pen=TTGlyphPen(None)
        polygons=[] if geometry.is_empty else list(geometry.geoms) if geometry.geom_type=="MultiPolygon" else [geometry]
        for poly in polygons:
            if poly.geom_type!="Polygon":continue
            poly=orient(poly,sign=-1)
            for ring in [poly.exterior,*poly.interiors]:
                coords=[(round(x),round(y)) for x,y in list(ring.coords)[:-1]]
                dedup=[p for i,p in enumerate(coords) if i==0 or p!=coords[i-1]]
                if len(dedup)<3:continue
                pen.moveTo(dedup[0])
                for point in dedup[1:]:pen.lineTo(point)
                pen.closePath()
        outlines[name]=pen.glyph()
        metrics[name]=(round(advance),round(geometry.bounds[0]) if not geometry.is_empty else 0)
    family="Lamina Mono" if mono else "Lamina UI";style="Regular" if weight==400 else "Medium"
    fb=FontBuilder(UPEM,isTTF=True)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap({ord(c):glyph_name(c) for c in drawings})
    fb.setupGlyf(outlines);fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=900,descent=-260,lineGap=0)
    fb.setupNameTable({"familyName":family,"styleName":style,"uniqueFontIdentifier":family.replace(" ","")+"-"+style+"-"+VERSION,
      "fullName":family+" "+style,"psName":family.replace(" ","")+"-"+style,"version":"Version "+VERSION,
      "copyright":"2026. Original glyph outlines for the independent thin-glass design kit.",
      "description":"Original closed-contour drawings, with independent Cyrillic lowercase. No existing font outlines were used."})
    fb.setupOS2(version=4,sTypoAscender=900,sTypoDescender=-260,sTypoLineGap=0,usWinAscent=1000,usWinDescent=300,
      sxHeight=520,sCapHeight=700,usWeightClass=weight,achVendID="LAMI",fsSelection=0xC0 if weight==400 else 0x80)
    fb.setupPost(isFixedPitch=1 if mono else 0);fb.setupMaxp()
    font=fb.font;font.recalcTimestamp=False;font["head"].created=font["head"].modified=3875904000
    if not mono:
        pairs=[("A","V",-60),("A","W",-48),("A","Y",-55),("T","a",-55),("T","e",-50),("T","o",-55),
          ("V","a",-44),("V","o",-45),("W","a",-30),("Y","a",-55),("Y","o",-55),("L","T",-35),
          ("А","Т",-35),("А","У",-40),("Г","а",-45),("Г","о",-48),("Т","а",-48),("Т","е",-45),
          ("Т","о",-48),("У","а",-38),("У","о",-40),("Р","а",-25),("Р","о",-25),("Л","Т",-20),
          ("f","i",-12),("f","l",-10),("r","a",-10),("r","e",-8)]
        rules="\n".join("pos %s %s %d;"%(glyph_name(a),glyph_name(b),n) for a,b,n in pairs)
        addOpenTypeFeaturesFromString(font,"languagesystem DFLT dflt;\nlanguagesystem latn dflt;\nlanguagesystem cyrl dflt;\nfeature kern {\n"+rules+"\n} kern;")
    stem="lamina-mono" if mono else "lamina-ui";path=OUT/(stem+"-"+style.lower()+".ttf")
    font.save(path);font.flavor="woff2";font.save(path.with_suffix(".woff2"))
    actual=TTFont(path);cmap=actual.getBestCmap()
    required="".join(chr(n) for n in range(32,127))+"АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя"
    assert len(cmap)==len(drawings)
    assert all(ord(c) in cmap for c in required)
    return {"family":family,"weight":weight,"glyphs":len(drawings),"file":path.name,"woff2":path.with_suffix(".woff2").name,"characters":"".join(sorted(drawings,key=ord))}

if __name__=="__main__":
    outputs=[package(weight,mono) for mono in [False,True] for weight in [400,500]]
    manifest={"version":VERSION,"unitsPerEm":UPEM,"capHeight":700,"xHeight":520,
      "origin":"All outlines and spacing are original and defined in typeface/master.py. No existing font is opened or imported.",
      "styles":outputs}
    (OUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps([{k:v for k,v in x.items() if k!="characters"} for x in outputs],ensure_ascii=False,indent=2))
