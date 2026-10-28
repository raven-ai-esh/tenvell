"""Original, contour-drawn Lamina master (v0.3).

All coordinates below are authored here. No font is read as an input.
Letters use closed outer/counter contours; punctuation uses controlled strokes.
Cyrillic lowercase is drawn at its actual x-height, never scaled from capitals.
"""
from math import hypot
from shapely.geometry import Polygon, LineString, Point, GeometryCollection, box
from shapely.ops import unary_union
from shapely.affinity import translate, scale


def contour(*commands):
    points = [commands[0]]
    for command in commands[1:]:
        if len(command) == 2:
            points.append(command)
        else:
            x0, y0 = points[-1]
            x1, y1, x2, y2, x3, y3 = command
            for n in range(1, 33):
                u = n / 32
                v = 1 - u
                points.append((v**3*x0+3*v*v*u*x1+3*v*u*u*x2+u**3*x3,
                               v**3*y0+3*v*v*u*y1+3*v*u*u*y2+u**3*y3))
    return Polygon(points).buffer(0)


def oval(x0, y0, x1, y1):
    cx, cy = (x0+x1)/2, (y0+y1)/2
    rx, ry = (x1-x0)/2, (y1-y0)/2
    k = .565
    return contour((cx, y1), (cx+rx*k,y1,x1,cy+ry*k,x1,cy),
                   (x1,cy-ry*k,cx+rx*k,y0,cx,y0),
                   (cx-rx*k,y0,x0,cy-ry*k,x0,cy),
                   (x0,cy+ry*k,cx-rx*k,y1,cx,y1))


def make_master(weight):
    t = 62
    h = t * .91
    g = {}
    def put(c, advance, *shapes):
        shape = unary_union(shapes).buffer(0) if shapes else GeometryCollection()
        g[c] = (advance, shape)
        return shape
    def alias(c, base):
        g[c] = g[base]
    def stem(x, height=520, bottom=0):
        return box(x,bottom,x+t,height)
    def line(x0,y0,x1,y1,width=None):
        return LineString([(x0,y0),(x1,y1)]).buffer((width or t)/2,cap_style='flat',join_style='mitre')
    def route(points, width=None):
        return LineString(points).buffer((width or t)/2,cap_style='flat',join_style='round')
    def curve(p0,p1,p2,p3,width=None):
        points=[]
        for n in range(49):
            u=n/48;v=1-u
            points.append((v**3*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u**3*p3[0],
                           v**3*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u**3*p3[1]))
        return route(points,width)
    def ring(x0,y0,x1,y1):
        return oval(x0,y0,x1,y1).difference(oval(x0+t,y0+h,x1-t,y1-h))
    def right_bowl(left,bottom,right,top):
        cy=(top+bottom)/2
        shoulder=left+(right-left)*.48
        return contour((left,bottom),(shoulder,bottom),
                       (right,bottom,right,cy, right,cy),
                       (right,top,shoulder,top,shoulder,top),(left,top))
    def bowl(left,bottom,right,top):
        return right_bowl(left,bottom,right,top).difference(right_bowl(left+t,bottom+h,right-t,top-h))
    def B(height,advance):
        top=right_bowl(68,height*.46,advance-72,height)
        lower=right_bowl(68,0,advance-44,height*.55)
        counters=unary_union([right_bowl(68+t,height*.46+h,advance-72-t,height-h),
                              right_bowl(68+t,h,advance-44-t,height*.55-h)])
        return unary_union([top,lower]).difference(counters)
    def K(height,ascender=None):
        # Closed joins and flat stem terminals; Cyrillic к stays at520.
        H=height; asc=ascender or H
        return contour((68,0),(68+t,0),(68+t,H*.34),(H*.35,H*.51),
                       (H*.76,0),(H*.76+t*1.23,0),(H*.35+t*.75,H*.59),
                       (H*.83,H),(H*.83-t*1.25,H),(68+t,H*.46),(68+t,asc),(68,asc))
    def EH(height,advance):
        return unary_union([stem(68,height),stem(advance-68-t,height),box(68,height*.49-h/2,advance-68,height*.49+h/2)])
    def PI(height,advance):
        return unary_union([stem(68,height),stem(advance-68-t,height),box(68,height-h,advance-68,height)])
    def EE(height,advance):
        return unary_union([stem(68,height),box(68,height-h,advance-55,height),box(68,0,advance-55,h),box(68,height*.49-h/2,advance-90,height*.49+h/2)])
    def EL(height,advance):
        right=advance-68; topLeft=advance*.35
        return contour((30,-4),(108,-4,142,28,161,118),
                       (topLeft,height-h),(right-t,height-h),(right-t,0),(right,0),(right,height),
                       (topLeft-t*.8,height),(99,126),(90,76,73,54,30,54))
    def DE(height,advance):
        r=advance-95
        return unary_union([line(advance*.34,height-h/2,95,h/2,t),
                            box(advance*.34-t/2,height-h,r,height),stem(r-t,height),
                            box(30,0,advance-30,h),box(30,-100,30+t,h),box(advance-30-t,-100,advance-30,h)])
    def EM(height,advance):
        l=68;r=advance-68;mid=advance/2
        return unary_union([stem(l,height),stem(r-t,height),
              Polygon([(l+t*.45,height),(l+t*.45+t*.9,height),(mid,height*.24+t*.5),
                       (r-t*.45-t*.9,height),(r-t*.45,height),(mid+t*.50,height*.20),
                       (mid-t*.50,height*.20)])])
    def I_CYR(height,advance):
        r=advance-68-t
        return unary_union([stem(68,height),stem(r,height),
            line(68+t/2,t*.4,r+t/2,height-t*.4,t*.94)]).intersection(box(68,0,advance-68,height))
    def ZHE(height,advance):
        mid=advance/2
        return unary_union([stem(mid-t/2,height),
            Polygon([(36,height),(36+t*1.24,height),(mid,height*.51+t*.35),(advance-36-t*1.24,height),(advance-36,height),
                     (mid+t*.60,height*.51),(advance-26,0),(advance-26-t*1.25,0),(mid,height*.51-t*.4),
                     (26+t*1.25,0),(26,0),(mid-t*.6,height*.51)])])
    def TSE(height,advance):
        right=advance-110
        return unary_union([stem(68,height),stem(right-t,height),box(68,0,right,h),box(right-t,0,advance-30,h),box(advance-30-t,-100,advance-30,h)])
    def CHE(height,advance):
        r=advance-68
        return unary_union([stem(r-t,height),contour((68,height),(68+t,height),(68+t,height*.60),
            (68+t,height*.43, r-t,height*.43,r-t,height*.60),(r-t,height*.70),(r,height*.70),
            (r,height*.52,r-t*.5,height*.39,advance*.53,height*.39),
            (140,height*.39,68,height*.44,68,height*.62))])
    def SHA(height,advance,tail=False):
        r=advance-68-(55 if tail else 0)
        result=unary_union([stem(68,height),stem((68+r-t)/2,height),stem(r-t,height),box(68,0,r,h)])
        if tail:result=unary_union([result,box(r-t,0,advance-30,h),box(advance-30-t,-100,advance-30,h)])
        return result
    def SOFT(height,advance):
        return unary_union([stem(68,height),bowl(68,0,advance-50,height*.52)])
    def YA(height,advance):
        r=advance-68
        back=scale(bowl(68,height*.44,advance-50,height),xfact=-1,yfact=1,origin=(advance/2,0))
        return unary_union([stem(r-t,height),back,line(r-t/2,height*.48,65+t/2,t*.20,t*.96)]).intersection(box(26,0,advance,height))

    # Capitals, cap-height700 and round overshoot10.
    put('A',650,Polygon([(34,0),(102,0),(325,619),(548,0),(616,0),(359,700),(291,700)]),box(158,223,492,223+h))
    put('B',620,B(700,620))
    capO=ring(45,-10,625,710)
    put('O',670,capO)
    put('C',650,ring(45,-10,625,710).difference(box(440,145,700,555)))
    put('D',675,bowl(68,0,625,700))
    put('E',565,EE(700,565))
    put('F',550,stem(68,700),box(68,700-h,505,700),box(68,340,460,340+h))
    put('G',695,ring(45,-10,640,710).difference(box(445,330,710,555)),box(365,285,640,285+h),box(640-t,80,640,330))
    put('H',690,EH(700,690))
    put('I',290,stem(114,700))
    put('J',500,contour((366,700),(366+t,700),(366+t,185),(428,55,355,-10,230,-10),(160,-10,102,9,55,42),
                        (55,110),(104,70,157,48,222,48),(316,48,366,91,366,187)))
    put('K',640,K(700))
    put('L',540,stem(68,700),box(68,0,495,h))
    put('M',820,EM(700,820))
    put('N',700,stem(68,700),stem(700-68-t,700),Polygon([(68,700),(68+t+8,700),(632,95),(632,0),(632-t-8,0),(68,605)]))
    put('P',605,stem(68,700),bowl(68,310,555,700))
    put('Q',700,capO,line(404,159,648,-67,t*.93))
    put('R',630,stem(68,700),bowl(68,310,568,700),Polygon([(278,337),(350,337),(602,0),(524,0)]))
    put('S',640,contour((552,639),(490,688,418,710,328,710),(167,710,70,630,70,517),
        (70,406,145,355,300,317),(357,303),(467,277,501,244,501,181),
        (501,98,430,48,324,48),(223,48,144,78,74,139),(74,64),
        (137,16,226,-10,323,-10),(475,-10,569,69,569,186),
        (569,294,504,351,362,385),(304,399),(185,427,137,463,137,525),
        (137,605,205,653,326,653),(413,653,489,627,552,576)))
    put('T',610,box(32,700-h,578,700),stem(305-t/2,700))
    put('U',685,contour((68,700),(68+t,700),(68+t,242),(130,110,202,48,342,48),
        (482,48,555,110,555,242),(555,700),(555+t,700),(555+t,234),
        (617,67,518,-10,342,-10),(166,-10,68,67,68,234)))
    put('V',650,Polygon([(29,700),(97,700),(325,80),(553,700),(621,700),(360,0),(290,0)]))
    put('W',945,Polygon([(32,700),(100,700),(260,99),(437,700),(507,700),(685,99),(845,700),(913,700),
                        (722,0),(650,0),(472,595),(295,0),(223,0)]))
    put('X',630,Polygon([(34,700),(112,700),(315,402),(518,700),(596,700),(354,350),(603,0),(525,0),(315,301),(105,0),(27,0),(276,350)]))
    put('Y',640,Polygon([(27,700),(103,700),(320,371),(537,700),(613,700),(320+t/2,305),(320+t/2,0),(320-t/2,0),(320-t/2,305)]))
    put('Z',600,Polygon([(46,700),(554,700),(554,700-h),(123,h),(562,h),(562,0),(38,0),(38,h),(469,700-h),(46,700-h)]))

    # Lowercase: independently closed outlines, common x-height520.
    lowerO=ring(42,-10,510,530)
    put('o',552,lowerO)
    put('a',548,contour((480,0),(480-t,0),(414,66),(373,14,310,-10,234,-10),
        (108,-10,44,47,44,143),(44,240,117,299,252,299),(480-t,299),(480-t,332),
        (418,431,365,475,269,475),(200,475,142,455,91,424),(91,486),
        (145,515,207,530,276,530),(414,530,480,463,480,331)).difference(
        contour((480-t,246),(255,246),(158,246,44+t,209,44+t,146),
                (44+t,83,151,46,234,46),(327,46,393,93,480-t,165))))
    put('b',572,stem(68,720),ring(68,-10,522,530))
    put('c',526,ring(42,-10,504,530).difference(box(340,112,560,408)))
    put('d',572,stem(510-t,720),ring(56,-10,510,530))
    put('e',550,contour((508,238),(42+t,238),(113,110,177,46,287,46),
        (360,46,420,67,465,102),(465,42),(411,7,350,-10,282,-10),
        (126,-10,42,87,42,258),(42,421,126,530,280,530),(429,530,508,433,508,285)).difference(
        contour((42+t,293),(508-t,293),(436,410,382,474,280,474),(182,474,120,410,42+t,293))))
    arch=contour((68,0),(68+t,0),(68+t,318),(130,415,190,473,274,473),
        (358,473,404,426,404,335),(404,0),(404+t,0),(404+t,347),
        (466,466,402,530,293,530),(220,530,166,504,128,452),(128,520),(68,520))
    put('n',536,arch)
    put('h',536,arch,stem(68,720))
    put('m',766,contour((68,0),(68+t,0),(68+t,328),(130,420,174,473,245,473),
        (315,473,351,430,351,347),(351,0),(351+t,0),(351+t,328),
        (413,420,457,473,528,473),(598,473,634,430,634,347),(634,0),(634+t,0),(634+t,354),
        (698,472,639,530,543,530),(477,530,429,499,397,448),
        (371,503,323,530,259,530),(199,530,156,502,128,453),(128,520),(68,520)))
    put('u',536,scale(arch,xfact=-1,yfact=-1,origin=(268,260)))
    put('r',370,contour((68,0),(68+t,0),(68+t,310),(130,418,185,472,267,472),
        (295,472,316,467,338,457),(338,520),(318,527,295,530,269,530),
        (202,530,154,498,128,446),(128,520),(68,520)))
    put('f',350,contour((112,0),(112+t,0),(112+t,520-h),(324,520-h),(324,520),
        (112+t,520),(112+t,584),(174,649,207,675,263,675),(286,675,309,671,332,663),
        (332,719),(310,728,283,732,253,732),(162,732,112,682,112,588)),box(32,520-h,112+t,520))
    put('i',228,stem(83),box(81,650,83+t+2,718))
    put('j',260,stem(132,520,-52),box(130,650,132+t+2,718),
        contour((132,-50),(132+t,-50),(194,-160,147,-208,57,-208),(27,-208,5,-204,-13,-198),
                (-13,-141),(8,-148,28,-151,49,-151),(105,-151,132,-121,132,-50)))
    put('k',510,K(520,720))
    put('l',258,contour((83,720),(83+t,720),(83+t,113),(145,67,163,47,201,47),
        (218,47,231,49,243,54),(243,0),(226,-7,205,-10,186,-10),
        (113,-10,83,28,83,108)))
    put('p',572,stem(68,520,-200),ring(68,-10,522,530))
    put('q',572,stem(510-t,520,-200),ring(56,-10,510,530))
    put('g',572,ring(56,-10,510,530),contour((510-t,520),(510,520),(510,-14),
        (510,-151,427,-214,283,-214),(208,-214,144,-199,91,-170),(91,-106),
        (144,-141,207,-158,277,-158),(391,-158,510-t,-112,510-t,-10)))
    put('s',490,contour((424,481),(374,514,311,530,247,530),
        (121,530,51,472,51,383),(51,299,109,261,224,233),(284,219),
        (358,201,384,178,384,136),(384,84,337,46,253,46),
        (177,46,115,67,61,104),(61,38),(113,6,177,-10,251,-10),
        (374,-10,446,48,446,139),(446,223,395,262,281,290),(224,304),
        (142,324,113,346,113,388),(113,440,160,474,247,474),
        (313,474,374,454,424,421)))
    put('t',355,contour((106,658),(106+t,658),(106+t,520),(321,520),(321,520-h),
        (106+t,520-h),(106+t,137),(168,74,196,46,248,46),
        (278,46,305,53,329,66),(329,8),(302,-4,271,-10,237,-10),
        (147,-10,106,37,106,130),(106,520-h),(27,520-h),(27,520),(106,520)))
    put('v',510,Polygon([(24,520),(91,520),(255,76),(419,520),(486,520),(290,0),(220,0)]))
    put('w',755,Polygon([(25,520),(91,520),(220,79),(342,520),(412,520),(535,79),(664,520),(730,520),
        (572,0),(500,0),(377,435),(254,0),(182,0)]))
    put('x',500,Polygon([(25,520),(100,520),(250,313),(400,520),(475,520),(286,262),
        (481,0),(405,0),(250,212),(95,0),(19,0),(214,262)]))
    put('y',514,contour((25,520),(94,520),(260,95),(425,520),(493,520),(268,-39),(207,-180,155,-214,59,-214),
        (36,-214),(36,-156),(62,-156),(127,-156,166,-130,194,-63),(226,11)))
    put('z',472,Polygon([(38,520),(434,520),(434,520-h),(116,h),(442,h),(442,0),(30,0),(30,h),(348,520-h),(38,520-h)]))

    # Cyrillic: shared contours only for genuinely identical letter forms.
    for c,base in {'А':'A','В':'B','Е':'E','К':'K','М':'M','Н':'H','О':'O','Р':'P','С':'C','Т':'T','Х':'X',
                   'а':'a','е':'e','о':'o','р':'p','с':'c','у':'y','х':'x'}.items():alias(c,base)
    for H,lower in [(700,False),(520,True)]:
        def c(upper):return upper.lower() if lower else upper
        put(c('Б'),590 if lower else 620,stem(68,H),box(68,H-h,(540 if lower else 570),H),bowl(68,0,(540 if lower else 570),H*.54))
        put(c('В'),562 if lower else 620,B(H,562 if lower else 620))
        put(c('Г'),425 if lower else 520,stem(68,H),box(68,H-h,(390 if lower else 480),H))
        put(c('Д'),650 if lower else 710,DE(H,650 if lower else 710))
        put(c('Ж'),755 if lower else 850,ZHE(H,755 if lower else 850))
        # з uses the same two balanced lobes as numeral3, drawn at its own height below.
        put(c('И'),555 if lower else 700,I_CYR(H,555 if lower else 700))
        put(c('Л'),540 if lower else 660,EL(H,540 if lower else 660))
        put(c('М'),665 if lower else 820,EM(H,665 if lower else 820))
        put(c('Н'),555 if lower else 690,EH(H,555 if lower else 690))
        put(c('П'),555 if lower else 700,PI(H,555 if lower else 700))
        put(c('Т'),480 if lower else 610,box(25,H-h,(455 if lower else 585),H),stem((240 if lower else 305)-t/2,H))
        put(c('Ф'),730 if lower else 825,ring(40,(-10 if lower else 95),(690 if lower else 785),(530 if lower else 605)),stem((365 if lower else 412.5)-t/2,(720 if lower else 720),(-200 if lower else -20)))
        put(c('Ц'),600 if lower else 725,TSE(H,600 if lower else 725))
        put(c('Ч'),545 if lower else 655,CHE(H,545 if lower else 655))
        put(c('Ш'),755 if lower else 900,SHA(H,755 if lower else 900))
        put(c('Щ'),810 if lower else 955,SHA(H,810 if lower else 955,True))
        softAdvance=530 if lower else 600
        soft=SOFT(H,softAdvance)
        put(c('Ь'),softAdvance,soft)
        put(c('Ы'),softAdvance+190,soft,stem(softAdvance+190-68-t,H))
        put(c('Ъ'),softAdvance+75,translate(soft,xoff=75),box(30,H-h,143+t,H))
        ec=scale(g['c' if lower else 'C'][1],xfact=-1,yfact=1,origin=((263 if lower else 325),0))
        put(c('Э'),540 if lower else 660,ec,box((235 if lower else 300),H*.49-h/2,(480 if lower else 605),H*.49+h/2))
        yuRing=ring((260 if lower else 300),-10,(728 if lower else 880),H+10)
        put(c('Ю'),770 if lower else 925,stem(68,H),box(68,H*.49-h/2,(300 if lower else 340),H*.49+h/2),yuRing)
        put(c('Я'),565 if lower else 650,YA(H,565 if lower else 650))
    put('к',510,K(520))
    # A proper lowercase б: rounded bowl and a compact, connected ascender.
    put('б',562,ring(48,-10,516,510),contour((48,250),(48+t,250),(48+t,453),
        (110,583,188,639,329,652),(447,663),(486,668,504,677,517,693),
        (517,625),(496,612,473,606,442,603),(335,593),
        (185,579,48,528,48,341)))
    # У has a lower optical tail; it is not a raised LatinY.
    put('У',640,contour((28,700),(103,700),(338,263),(550,700),(622,700),(342,137),
        (285,25,221,-10,119,-10),(89,-10),(89,49),(119,49),(194,49,239,72,277,144),(302,193)))

    def three(H,adv):
        # Open left terminals and balanced upper/lower counters.
        return contour((54,H*.91),(116,H*1.00,198,H+10,adv*.50,H+10),
            (adv*.83,H+10,adv-48,H*.86,adv-48,H*.72),
            (adv-48,H*.60,adv*.79,H*.54,adv*.66,H*.51),
            (adv*.85,H*.48,adv-32,H*.39,adv-32,H*.25),
            (adv-32,H*.08,adv*.80,-10,adv*.49,-10),
            (adv*.31,-10,adv*.14,H*.04,47,H*.12),(47,H*.22),
            (adv*.16,H*.11,adv*.32,h,adv*.49,h),
            (adv*.72,h,adv-32-t,H*.12,adv-32-t,H*.25),
            (adv-32-t,H*.39,adv*.71,H*.46,adv*.49,H*.46),
            (adv*.39,H*.46),(adv*.39,H*.46+h),(adv*.48,H*.46+h),
            (adv*.70,H*.46+h,adv-48-t,H*.60,adv-48-t,H*.72),
            (adv-48-t,H*.85,adv*.71,H-h+10,adv*.49,H-h+10),
            (adv*.32,H-h+10,adv*.17,H*.88,54,H*.81))
    put('З',590,three(700,590));put('з',490,three(520,490))
    for char,base in [('Ё','Е'),('ё','е')]:
        a,s=g[base];y=795 if char=='Ё' else 625
        put(char,a,s,box(a*.34-29,y,a*.34+29,y+62),box(a*.68-29,y,a*.68+29,y+62))
    for char,base in [('Й','И'),('й','и')]:
        a,s=g[base];y=782 if char=='Й' else 610
        breve=contour((a*.28,y+47),(a*.28+52,y+47),
            (a*.36,y-4,a*.64,y-4,a*.72-52,y+47),(a*.72,y+47),
            (a*.68,y-57,a*.32,y-57,a*.28,y+47))
        put(char,a,s,breve)

    # Tabular numerals, open punctuation, operators and source-code symbols.
    put('0',570,ring(68,-10,502,710))
    put('1',570,Polygon([(104,530),(252,700),(318,700),(318,0),(318-t,0),(318-t,619),(104,450)]),box(111,0,480,h))
    put('2',570,curve((75,535),(100,747),(510,744),(492,510)),
        curve((492,510),(488,382),(173,190),(76,h/2)),box(76,0,505,h))
    put('3',570,three(700,570))
    put('4',570,stem(380,700),box(45,191,520,191+h),Polygon([(45,191),(45,191+h),(368,700),(437,700),(116,191+h)]))
    put('5',570,box(93,700-h,495,700),line(108,700,90,373),
        curve((90,373),(376,500),(556,329),(463,119)),curve((463,119),(390,-24),(182,1),(75,92)))
    put('6',570,ring(62,-10,510,432),curve((93,221),(57,518),(247,797),(470,636)))
    put('7',570,box(50,700-h,518,700),Polygon([(448,700-h),(518,700-h),(222,0),(153,0)]))
    put('8',570,ring(78,326,492,710),ring(55,-10,515,384))
    put('9',570,ring(62,268,510,710),curve((479,489),(515,182),(324,-97),(100,64)))
    for c,a in [(' ',265),('\u00a0',265),('\u202f',180),('\u2007',570)]:put(c,a)
    for c,ys in [('.', [0]),(':',[0,355])]:put(c,240,*[box(85,y,155,y+70) for y in ys])
    comma=contour((85,70),(155,70),(155,9),(155,-49,130,-89,87,-109),(61,-72),(95,-53,110,-30,112,0),(85,0))
    put(',',240,comma);put(';',240,comma,box(85,355,155,425))
    put('!',270,box(104,206,166,700),box(100,0,170,70))
    put('?',530,curve((68,562),(125,769),(488,713),(462,516)),
        curve((462,516),(447,414),(265,375),(265,213)),box(230,0,300,70))
    for c,a in [('-',380),('–',570),('—',850)]:put(c,a,box(48,282,a-48,282+h))
    put('_',590,box(32,-90,558,-90+h))
    put('=',590,box(56,409,534,409+h),box(56,171,534,171+h))
    put('+',590,box(56,282,534,282+h),box(295-h/2,72,295+h/2,548))
    put('/',410,line(41,-92,369,762,h));put('\\',410,line(41,762,369,-92,h));put('|',250,box(97,-162,153,772))
    for c,sign in [('(',1),(')',-1)]:
        s=curve((264,762),(49,535),(49,63),(264,-162),h)
        if sign<0:s=scale(s,xfact=-1,yfact=1,origin=(170,0))
        put(c,340,s)
    for c,sign in [('[',1),(']',-1)]:
        s=unary_union([box(98,-162,98+h,762),box(98,762-h,284,762),box(98,-162,284,-162+h)])
        if sign<0:s=scale(s,xfact=-1,yfact=1,origin=(170,0))
        put(c,340,s)
    brace=unary_union([curve((318,762),(111,762),(277,383),(66,300),h),curve((66,300),(277,217),(111,-162),(318,-162),h)])
    put('{',400,brace);put('}',400,scale(brace,xfact=-1,yfact=1,origin=(200,0)))
    put('<',570,route([(483,551),(82,300),(483,49)],h));put('>',570,route([(87,551),(488,300),(87,49)],h))
    put('"',345,box(85,534,85+h,720),box(228,534,228+h,720));put("'",220,box(82,534,82+h,720))
    put('`',290,line(83,731,207,625,h));put('^',490,route([(62,482),(245,713),(428,482)],h))
    put('~',620,curve((61,266),(186,450),(434,150),(559,334),h))
    put('*',490,line(245,694,245,353,h),line(85,609,405,424,h),line(85,424,405,609,h))
    put('#',660,line(238,720,145,-20,h),line(515,720,422,-20,h),box(48,439,611,439+h),box(20,202,583,202+h))
    put('%',850,ring(49,397,337,710),ring(513,-10,801,303),line(151,-5,699,705,h))
    put('$',640,g['S'][1],box(304,-110,336,802))
    amp=unary_union([curve((638,34),(416,179),(134,461),(153,601)),curve((153,601),(172,744),(435,745),(453,588)),
        curve((453,588),(470,448),(111,350),(105,172)),curve((105,172),(91,-35),(415,-46),(545,139)),line(545,139,638,352)])
    put('&',720,amp)
    put('@',955,ring(39,-61,891,757).difference(box(670,-80,1000,273)),ring(227,121,638,563),box(638-t,192,638,563),curve((608,205),(633,68),(790,140),(799,333)))
    put('·',250,box(94,271,156,333));put('…',720,*[box(x,0,x+70,70) for x in [85,325,565]])
    for c,base in [('‘',"'"),('’',"'"),('“','"'),('”','"')]:alias(c,base)
    put('«',650,route([(292,493),(88,273),(292,53)],h),route([(563,493),(359,273),(563,53)],h))
    put('»',650,route([(87,493),(291,273),(87,53)],h),route([(358,493),(562,273),(358,53)],h))
    put('€',660,g['C'][1],box(23,421,443,421+h),box(23,222,414,222+h))
    put('₽',620,g['P'][1],box(31,310,352,310+h),box(31,159,352,159+h))
    put('°',360,ring(59,470,301,712));put('×',580,line(90,503,490,99,h),line(90,99,490,503,h));alias('−','=')
    put('−',590,box(56,282,534,282+h))
    arrow=unary_union([box(49,300-h/2,771,300+h/2),route([(533,533),(771,300),(533,67)],h)])
    put('→',820,arrow);put('←',820,scale(arrow,xfact=-1,yfact=1,origin=(410,0)))
    command=[box(209,130,209+h,570),box(461-h,130,461,570),box(130,209,570,209+h),box(130,461-h,570,461)]
    for x,y in [(137,137),(563,137),(137,563),(563,563)]:command.append(ring(x-91,y-91,x+91,y+91))
    put('⌘',700,*command)

    # Accents are new geometry over the corresponding new base contours.
    for c,base in [('І','I'),('і','i')]:alias(c,base)
    for c,base in [('Є','Э'),('є','э')]:
        a,s=g[base];put(c,a,scale(s,xfact=-1,yfact=1,origin=(a/2,0)))
    for c,base in [('Ї','I'),('ї','i')]:
        a,s=g[base];s=s.intersection(box(-100,-300,1000,600 if c=='ї' else 740))
        y=630 if c=='ї' else 795
        put(c,a,s,box(a/2-84,y,a/2-26,y+62),box(a/2+26,y,a/2+84,y+62))
    accents={'acute':[(200,622),(326,749)],'grave':[(200,749),(326,622)],
        'circumflex':[(147,624),(265,744),(383,624)],'caron':[(147,744),(265,624),(383,744)]}
    combinations={'á':('a','acute'),'à':('a','grave'),'â':('a','circumflex'),'ã':('a','tilde'),
        'é':('e','acute'),'è':('e','grave'),'ê':('e','circumflex'),'í':('i','acute'),'ì':('i','grave'),
        'ó':('o','acute'),'ò':('o','grave'),'ô':('o','circumflex'),'õ':('o','tilde'),'ú':('u','acute'),
        'ù':('u','grave'),'û':('u','circumflex'),'ý':('y','acute'),'ñ':('n','tilde'),
        'č':('c','caron'),'š':('s','caron'),'ž':('z','caron')}
    for c,(base,accent) in combinations.items():
        for char,source,offset in [(c,base,0),(c.upper(),base.upper(),180)]:
            a,s=g[source]
            if source=='i':s=stem(83)
            mark=curve((128,669),(211,753),(319,589),(402,673),h*.77) if accent=='tilde' else route(accents[accent],h*.77)
            put(char,a,s,translate(mark,xoff=(a-530)/2,yoff=offset))
    for c,base in [('ä','a'),('ë','e'),('ï','i'),('ö','o'),('ü','u'),('ÿ','y')]:
        for char,source,y in [(c,base,630),(c.upper(),base.upper(),795)]:
            a,s=g[source]
            if source=='i':s=stem(83)
            put(char,a,s,box(a/2-91,y,a/2-33,y+62),box(a/2+33,y,a/2+91,y+62))
    for c,base in [('ç','c'),('Ç','C')]:
        a,s=g[base];put(c,a,s,curve((a*.5,-3),(a*.28,-85),(a*.7,-85),(a*.46,-185),h*.77))
    for c,base in [('ø','o'),('Ø','O')]:
        a,s=g[base];put(c,a,s,line(66,-28,a-66,(548 if c=='ø' else 728),h*.77))
    if weight == 500:
        g = {c:(a,s.buffer(7,join_style='mitre',mitre_limit=2)) if not s.is_empty else (a,s)
             for c,(a,s) in g.items()}
    return g
