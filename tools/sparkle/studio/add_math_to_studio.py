# Adds ?subject=math to the ELA Video Studio (tools/video-studio.html).
# Run once from the optima-4th-ela repo root:  python3 add_math_to_studio.py tools/video-studio.html
import sys
p = sys.argv[1] if len(sys.argv) > 1 else 'tools/video-studio.html'
s = open(p, encoding='utf-8').read()
if 'subject=math' in s:
    print('already has math'); sys.exit()
def rep(a, b):
    global s
    assert s.count(a) == 1, (a[:60], s.count(a))
    s = s.replace(a, b)
rep('window.VS_SUBJ=/[?&]subject=science\\b/i.test(location.search)?"science":"ela";',
    'window.VS_SUBJ=/[?&]subject=science\\b/i.test(location.search)?"science":/[?&]subject=math\\b/i.test(location.search)?"math":"ela";')
rep("""document.write('<script src="video-shotlist'+(window.VS_SUBJ==="science"?"-science":"")+'.js"><\\/script>');""",
    """document.write('<script src="video-shotlist'+(window.VS_SUBJ==="science"?"-science":window.VS_SUBJ==="math"?"-math":"")+'.js"><\\/script>');""")
rep("var SCI = window.VS_SUBJ==='science';",
    "var MATH = window.VS_SUBJ==='math';\nvar SCI = window.VS_SUBJ==='science' || MATH; /* math uses the science flow: lesson plans, cards, teacher/ folder */")
rep("var REPO_NAME = SCI ? 'optima-4th-science' : 'optima-4th-ela';",
    "var REPO_NAME = MATH ? 'optima-4th-math' : SCI ? 'optima-4th-science' : 'optima-4th-ela';")
rep("  document.title='G4 Science Video Studio';", "  document.title=MATH?'G4 Math Video Studio':'G4 Science Video Studio';")
rep("    t('repoBtn',function(e){ e.textContent='📁 Connect optima-4th-science'; });",
    "    t('repoBtn',function(e){ e.textContent='📁 Connect '+REPO_NAME; });")
rep("e.textContent='Unzip into C:\\\\repos\\\\optima-4th-science and every file lands in the right folder.'; });",
    "e.textContent='Unzip into C:\\\\repos\\\\'+REPO_NAME+' and every file lands in the right folder.'; });")
rep("b.textContent='C:\\\\repos\\\\optima-4th-science'; });", "b.textContent='C:\\\\repos\\\\'+REPO_NAME; });")
rep("if (h) h.textContent='🔬 G4 Science Video Studio'; })();",
    "if (h) h.textContent=MATH?'🧮 G4 Math Video Studio':'🔬 G4 Science Video Studio'; })();")
rep("$('appTitle').textContent = freeMode ? '🎬 Video Studio' : (SCI ? '🔬 G4 Science Video Studio' : '🎬 G4 ELA Video Studio');",
    "$('appTitle').textContent = freeMode ? '🎬 Video Studio' : (MATH ? '🧮 G4 Math Video Studio' : SCI ? '🔬 G4 Science Video Studio' : '🎬 G4 ELA Video Studio');")
rep("document.title = freeMode ? 'Video Studio' : (SCI ? 'G4 Science Video Studio' : 'G4 ELA Video Studio');",
    "document.title = freeMode ? 'Video Studio' : (MATH ? 'G4 Math Video Studio' : SCI ? 'G4 Science Video Studio' : 'G4 ELA Video Studio');")
rep("  h.insertAdjacentElement('afterend',a); })();",
    "  h.insertAdjacentElement('afterend',a);\n  if(!MATH){var m=document.createElement('a');m.className='subjswitch';m.href=location.pathname+'?subject=math';m.textContent='↔ Math videos';a.insertAdjacentElement('afterend',m);} })();")
open(p, 'w', encoding='utf-8').write(s)
print('math subject added')
