import re,json,subprocess,bisect
md=open('../scripts/001-earth-2-0.md').read()
nar=md.split('\n---\n')[1]
paras=[p.strip() for p in nar.split('\n\n') if p.strip()]
sents=[]
for pi,p in enumerate(paras):
    for s in re.split(r'(?<=[.?!])\s+',p):
        if s: sents.append((pi,s))
out=subprocess.run(['ffmpeg','-hide_banner','-i','narration-001.mp3','-af','silencedetect=n=-32dB:d=0.15','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',out)]
en=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',out)]
sil=list(zip(st,en)); dur=513.72
# voiced-time axis: v(t) = t - silence before t
def voiced(t): return t-sum(min(b,t)-a for a,b in sil if a<t)
V=voiced(dur)
silv=[(voiced(a),a,b) for a,b in sil]   # voiced position of each silence
w=[len(re.sub(r'[^A-Za-z0-9]','',s)) for _,s in sents]; tot=sum(w)
# DP: choose increasing silence index for each of the N-1 boundaries minimising squared voiced error, bonus for long silences
N=len(sents); M=len(silv); INF=1e18
pred=[]; c=0
for i in range(N-1): c+=w[i]; pred.append(V*c/tot)
cost=[[INF]*M for _ in range(N-1)]; back=[[-1]*M for _ in range(N-1)]
def loc(i,j):
    d=silv[j][0]-pred[i]
    if abs(d)>6: return INF
    return d*d-2.0*(silv[j][2]-silv[j][1])
for j in range(M): cost[0][j]=loc(0,j)
for i in range(1,N-1):
    best=INF;bj=-1
    for j in range(M):
        if j>0 and cost[i-1][j-1]<best: best=cost[i-1][j-1]; bj=j-1
        l=loc(i,j)
        if best<INF and l<INF: cost[i][j]=best+l; back[i][j]=bj
j=min(range(M),key=lambda j:cost[N-2][j]); path=[j]
for i in range(N-2,0,-1): j=back[i][j]; path.append(j)
path.reverse()
res=[];prev=0.0
for i,(pi,s) in enumerate(sents):
    if i<N-1: a,b=sil[path[i]]; end=(a+b)/2; gap=b-a
    else: end=dur; gap=0
    res.append({'i':i,'para':pi,'start':round(prev,2),'end':round(end,2),'gap':round(gap,2),'text':s}); prev=end
json.dump(res,open('timing-001.json','w'),indent=1)
pb=[r['gap'] for k,r in enumerate(res[:-1]) if res[k+1]['para']!=r['para']]; sb=[r['gap'] for k,r in enumerate(res[:-1]) if res[k+1]['para']==r['para']]
print('mean gap at paragraph breaks %.2f, within paragraphs %.2f, unused silences mean %.2f'%(sum(pb)/len(pb),sum(sb)/len(sb), (sum(b-a for a,b in sil)-sum(pb)-sum(sb))/(M-N+1)))
rate=[(r['end']-r['start'])/max(1,w[k]) for k,r in enumerate(res)]
print('sec/char min %.3f max %.3f'%(min(rate),max(rate)))
for r in res[:26]: print(r['start'],r['end'],r['gap'],r['text'][:55])
