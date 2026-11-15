# Aligns every clause of the script (split at , . ? ! :) to the pauses in the narration audio.
import re,json,subprocess
md=open('../scripts/001-earth-2-0.md').read()
nar=md.split('\n---\n')[1]
paras=[p.strip() for p in nar.split('\n\n') if p.strip()]
cl=[]  # (para, sentence_idx, text, kind of boundary after it: 's' sentence end, 'c' comma)
si=0
for pi,p in enumerate(paras):
    for s in re.split(r'(?<=[.?!])\s+',p):
        if not s: continue
        parts=[x for x in re.split(r'(?<=[,:])\s+',s) if x]
        for k,x in enumerate(parts): cl.append([pi,si,x,'s' if k==len(parts)-1 else 'c'])
        si+=1
out=subprocess.run(['ffmpeg','-hide_banner','-i','narration-001.mp3','-af','silencedetect=n=-32dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',out)]; en=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',out)]
sil=[(a,b) for a,b in zip(st,en) if a>0.05]; dur=513.72
K=len(cl); M=len(sil)
def nch(x):
    x=re.sub(r'TRAPPIST-1e','trappist one e',x); x=re.sub(r'TRAPPIST-1','trappist one',x); x=re.sub(r'LHS 1140 b','l h s eleven forty b',x); x=re.sub(r'Voyager 1','voyager one',x)
    return len(re.sub(r'[^A-Za-z]','',x))+1
ch=[nch(c[2]) for c in cl]; cum=[0]
for c in ch: cum.append(cum[-1]+c)
V=dur-sum(b-a for a,b in sil); rate=V/cum[-1]
# nodes: (boundary i in 0..K, silence j in -1..M) ; boundary 0 = start (j=-1), boundary K = end (j=M)
segs=[(0,0)]+sil+[(dur,dur)]   # index j+1
def voiced(j0,j1): # voiced time between silence j0 end and silence j1 start (indices in segs)
    return segs[j1][0]-segs[j0][1]-sum(b-a for a,b in segs[j0+1:j1])
INF=1e18; dp={(0,0):(0,None)}
MAXI=5; MAXJ=5
for i in range(1,K+1):
    for j in range(1,M+2):
        if (i==K)!=(j==M+1): continue
        best=(INF,None)
        for di in range(1,MAXI+1):
            i0=i-di
            if i0<0: break
            for dj in range(1,MAXJ+1):
                j0=j-dj
                if j0<0: break
                if (i0,j0) not in dp: continue
                exp=rate*(cum[i]-cum[i0]); vd=voiced(j0,j)
                c=dp[(i0,j0)][0]+(vd-exp)**2/exp*8
                c+=sum(6.0 if cl[k-1][3]=='s' else 0.6 for k in range(i0+1,i))   # boundaries with no pause
                c+=sum(1.0+4*(segs[q][1]-segs[q][0]) for q in range(j0+1,j))       # pauses with no punctuation
                if c<best[0]: best=(c,(i0,j0))
        if best[0]<INF: dp[(i,j)]=best
node=(K,M+1); match={}
while node!=(0,0):
    match[node[0]]=node[1]; node=dp[node][1]
# clause end times: matched boundaries get the pause; unmatched interpolate by chars between matched neighbours
ends=[None]*(K+1); ends[0]=(0,0)
for i,j in match.items(): ends[i]=segs[j]
res=[]; last=0
for i in range(1,K+1):
    if ends[i] is None:
        nxt=next(k for k in range(i+1,K+1) if ends[k] is not None)
        t0=ends[last][1]; t1=ends[nxt][0]; f=(cum[i]-cum[last])/(cum[nxt]-cum[last]); t=t0+(t1-t0)*f; e=(t,t)
    else: e=ends[i]; last=i
    res.append(e)
clauses=[];prev=0.0
for k,c in enumerate(cl):
    clauses.append({'k':k,'para':c[0],'sent':c[1],'start':round(prev,2),'end':round(res[k][0],2),'text':c[2]}); prev=res[k][1]
sent={}
for c in clauses:
    s=sent.setdefault(c['sent'],{'i':c['sent'],'para':c['para'],'start':c['start'],'end':c['end'],'text':''}); s['end']=c['end']; s['text']=(s['text']+' '+c['text']).strip()
json.dump({'sentences':list(sent.values()),'clauses':clauses},open('timing-001.json','w'),indent=1)
um=sum(1 for i in range(1,K) if i not in match and cl[i-1][3]=='s')
err=[abs((c['end']-c['start'])-rate*ch[k])/(rate*ch[k]) for k,c in enumerate(clauses)]
print('clauses',K,'pauses',M,'matched',len(match),'sentence ends without a pause',um,'median rel err %.2f'%sorted(err)[len(err)//2],'p90 %.2f'%sorted(err)[int(len(err)*.9)])
for s in list(sent.values())[:26]: print(s['start'],s['end'],s['text'][:58])
