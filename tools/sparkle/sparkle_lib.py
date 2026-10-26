"""Helpers for a lesson's make.py (tools/sparkle/lessons/<UU-LL>/make.py).

build_lesson.py runs make.py with `s` = the ORIGINAL lesson HTML and these helpers already defined.
make.py edits `s` (directly, or with the helpers). Every helper asserts its anchor appears exactly once,
so a changed page fails loudly instead of silently. build_lesson.py then injects the shared layer.
"""
import re


def block_end(s, i):
    """Index just past the <div> that starts at i (balanced)."""
    depth = 0
    for m in re.finditer(r'<div\b|</div>', s[i:]):
        depth += 1 if m.group(0).startswith('<div') else -1
        if depth == 0:
            return i + m.end()
    raise ValueError('unbalanced <div> at %d' % i)


def helpers(G):
    """Functions that read and write G['s'] (the page being built)."""
    def _one(a):
        n = G['s'].count(a)
        assert n == 1, 'anchor found %d times (need exactly 1): %r' % (n, a[:90])

    def rep(a, b):
        """Replace text that appears exactly once."""
        _one(a); G['s'] = G['s'].replace(a, b)

    def ins_before(marker, html):
        _one(marker); G['s'] = G['s'].replace(marker, html + marker, 1)

    def ins_after(marker, html):
        _one(marker); G['s'] = G['s'].replace(marker, marker + html, 1)

    def block(start_marker):
        """The whole <div> block that starts with start_marker."""
        _one(start_marker); i = G['s'].index(start_marker)
        return G['s'][i:block_end(G['s'], i)]

    def replace_block(start_marker, new):
        """Replace the whole <div> block that starts with start_marker; returns the old block."""
        _one(start_marker); s = G['s']; i = s.index(start_marker); j = block_end(s, i)
        old = s[i:j]; G['s'] = s[:i] + new + s[j:]
        return old

    def remove_block(start_marker):
        return replace_block(start_marker, '')

    def sub(pattern, repl, count=1, flags=re.S):
        """Regex replace (repl may be a function); must match at least once."""
        new, n = re.subn(pattern, repl, G['s'], count=count, flags=flags)
        assert n >= 1, 'pattern not found: %r' % pattern[:90]
        G['s'] = new

    def answer_boxes_save():
        """Make the page's restore + gather include the per-part answer boxes (call once when the lesson uses box())."""
        sub(r"document\.querySelectorAll\('textarea\.journal-box'\)\.forEach\(t=>\{let v=localStorage",
            lambda m: "document.querySelectorAll('textarea.journal-box, input.ans-box').forEach(t=>{let v=localStorage")
        sub(r"document\.querySelectorAll\('textarea\.journal-box'\)\.forEach\(t=>\{out\+=t\.dataset\.label\+'\\n'\+\(t\.value\.trim\(\)\|\|'\[No answer yet\]'\)\+'\\n\\n'\}\);",
            lambda m: GATHER_FIX)

    return dict(rep=rep, ins_before=ins_before, ins_after=ins_after, block=block, replace_block=replace_block,
                remove_block=remove_block, sub=sub, answer_boxes_save=answer_boxes_save)


# ── small HTML builders ──
def game(quest):
    """A game window. The quest id must exist in PQ_DATA.quests."""
    return '\n<div class="pq-slot" data-quest="%s"></div>\n' % quest


slot = game


def video(name):
    """A teacher-video slot: think | learn | do | wrap. Invisible until a video exists."""
    return '<div class="pq-vslot" data-slot="%s"></div>' % name


def tip(who, text):
    """A pixel tip-giver. `who` = opti or a PQ_DATA npc id with a look (atlas, felix, hazel, cora, amy…)."""
    return '<div class="mk-tip" data-who="%s">%s</div>' % (who, text)


def model(name, extra=''):
    """A mount for PQ_LESSON.models[name]."""
    return '<div data-mk-model="%s"%s></div>' % (name, extra)


BOARD = '\n<div class="mk-board-mount"></div>'
TOWN = '<div class="pq-town-strip" aria-hidden="true"></div>'


def box(bid, aria, unit='', dot=''):
    """One answer box in Show What You Know. Saves as the student types; gathered into the journal."""
    return ('<input class="ans-box" id="ans-%s" type="text" inputmode="numeric" autocomplete="off" aria-label="%s" '
            'oninput="autoSave(this,\'dot-%s\')"/>%s') % (bid, aria, dot or bid[0], (' ' + unit) if unit else '')


def part(label, html):
    """One lettered part: part('Problem 1 (a)', '(a) 6 m = ' + box('1a', 'Problem 1 a, centimeters', 'cm'))."""
    return '<div class="ans-part" data-label="%s">%s</div>' % (label, html)


def problem(n, title, parts_html, intro=''):
    """A SWYK problem with its parts. A big text box only for a real short-answer question."""
    return ('<div class="q-block"><p class="q-text"><span class="q-num">%s</span><strong>%s</strong> %s<span class="saved-dot" id="dot-%s"></span></p>'
            '<div class="ans-parts">%s</div></div>') % (n, title, intro, n, parts_html)


GATHER_FIX = (
    "document.querySelectorAll('textarea.journal-box, .ans-part').forEach(t=>{if(t.classList.contains('ans-part')){let c=t.cloneNode(true),empty=false;"
    "c.querySelectorAll('input').forEach((x,k)=>{let v=t.querySelectorAll('input')[k].value.trim();if(!v)empty=true;x.replaceWith(v||'___')});"
    "out+=t.dataset.label+'\\n'+c.textContent.replace(/^\\([a-z]\\)\\s*/,'').trim()+(empty?'  [not finished]':'')+'\\n\\n';return;}"
    "out+=t.dataset.label+'\\n'+(t.value.trim()||'[No answer yet]')+'\\n\\n'});")
