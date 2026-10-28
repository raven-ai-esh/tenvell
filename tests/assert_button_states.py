"""Assertions over real browser pointer-state captures, not CSS snapshots."""
import json, re, sys
from pathlib import Path
from PIL import Image

def rgb(value):
    values=[float(x) for x in re.findall(r"[\d.]+",value)]
    return values[:3],values[3] if len(values)>3 else 1
def luminance(values):
    c=[x/255 for x in values]
    c=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in c]
    return sum(x*w for x,w in zip(c,(.2126,.7152,.0722)))
def contrast(a,b):
    lo,hi=sorted([luminance(a),luminance(b)])
    return (hi+.05)/(lo+.05)

root=Path(sys.argv[1])
if len(sys.argv)>2 and sys.argv[2]=="--before":
    before=json.loads((root/"before-states.json").read_text())
    failures=[]
    for key in ["lightLinkBefore","darkLinkBefore"]:
        item=before[key];fg,_=rgb(item["color"]);bg,_=rgb(item["background"]);ratio=contrast(fg,bg)
        if ratio<4.5:failures.append((key,round(ratio,2)))
    assert not failures,"Pre-fix regression correctly detected: "+str(failures)
    raise SystemExit(0)

cases=json.loads((root/"state-matrix.json").read_text())
assert len(cases)==14
results=[]
for item in cases:
    assert item["hover"] and item["opacity"]=="1"
    fg,fg_alpha=rgb(item["color"]);bg,bg_alpha=rgb(item["background"])
    assert fg_alpha==1
    if bg_alpha==1:
        ratios=[contrast(fg,bg)]
    else:
        im=Image.open(root/item["file"]).convert("RGB")
        sx=im.width/item["viewportWidth"];sy=im.height/item["viewportHeight"]
        samples=[(.5,.13),(.5,.87),(.25,.13),(.75,.87)]
        ratios=[contrast(fg,im.getpixel((round((item["x"]+item["width"]*x)*sx),round((item["y"]+item["height"]*y)*sy)))) for x,y in samples]
    ratio=min(ratios)
    assert ratio>=4.5,(item["theme"],item["text"],ratio)
    if item["state"]=="hover":
        if bg_alpha==1:assert min(bg)>70 and max(bg)<210,"Opaque black/white hover returned"
        else:assert bg_alpha<=.25,"Quiet hover became a heavy opaque fill"
    results.append({"theme":item["theme"],"label":item["text"],"state":item["state"],"contrast":round(ratio,2)})
(root/"contrast-results.json").write_text(json.dumps(results,ensure_ascii=False,indent=2)+"\n")
print(json.dumps(results,ensure_ascii=False,indent=2))
