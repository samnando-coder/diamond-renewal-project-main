import { Fragment, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { SimpleContentPage } from './_SimpleContentPage';
import { getBlogPostById } from '@/data/blogs';

function formatDate(dateString: string): string {
  return dateString;
}

export default function BlogDetail() {
  const { id } = useParams();

  const post = useMemo(() => getBlogPostById(id ?? ''), [id]);
  const markdown = (post?.content?.trim() ? post.content : post?.excerpt ?? '').trim();

  const blocks = useMemo(() => {
    if (!markdown) return [];
    const lines = markdown
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      // filter out legacy emoji bullets like "????"
      .filter((l) => !/^(\?){3,}/.test(l));

    type Block =
      | { kind: 'heading'; level: number; text: string }
      | { kind: 'p'; text: string }
      | { kind: 'ul'; items: string[] }
      | { kind: 'ol'; items: string[] };

    const out: Block[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i]!;

      const heading = line.match(/^(#{1,4})\s+(.*)$/);
      if (heading) {
        out.push({ kind: 'heading', level: heading[1].length, text: heading[2] });
        i += 1;
        continue;
      }

      // Heuristic: legacy dumps sometimes miss ### for subheadings.
      // If a short line is followed by paragraph or list, and it doesn't look like a sentence, treat it as a subheading.
      const next = lines[i + 1];
      const looksLikeListNext = !!next && (/^-\s+/.test(next) || /^\d+\.\s+/.test(next));
      const looksLikeSentence = /[.!]$/.test(line);
      const looksLikeHeading =
        line.length <= 90 &&
        !looksLikeSentence &&
        (/\?$/.test(line) || /:$/.test(line) || looksLikeListNext);

      if (looksLikeHeading) {
        out.push({ kind: 'heading', level: 3, text: line.replace(/[:?]$/, '').trim() });
        i += 1;
        continue;
      }

      if (/^-\s+/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^-\s+/.test(lines[i]!)) {
          items.push(lines[i]!.replace(/^-+\s+/, '').trim());
          i += 1;
        }
        out.push({ kind: 'ul', items });
        continue;
      }

      if (/^\d+\.\s+/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i]!)) {
          items.push(lines[i]!.replace(/^\d+\.\s+/, '').trim());
          i += 1;
        }
        out.push({ kind: 'ol', items });
        continue;
      }

      // paragraph: consume until next structural line
      const parts: string[] = [];
      while (
        i < lines.length &&
        !/^(#{1,4})\s+/.test(lines[i]!) &&
        !/^-+\s+/.test(lines[i]!) &&
        !/^\d+\.\s+/.test(lines[i]!)
      ) {
        parts.push(lines[i]!);
        i += 1;
      }
      out.push({ kind: 'p', text: parts.join(' ') });
    }

    return out;
  }, [markdown]);

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return parts.map((p, idx) => {
      const m = p.match(/^\*\*([^*]+)\*\*$/);
      if (m) return <strong key={idx}>{m[1]}</strong>;
      return <Fragment key={idx}>{p}</Fragment>;
    });
  };

  if (!post) {
    return (
      <SimpleContentPage eyebrow="Blogs" title="Blog niet gevonden">
        <p className="text-body mb-6">
          Deze blog bestaat niet (meer) of de link is onjuist.
        </p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300"
        >
          Terug naar blogs
          <ArrowRight className="w-4 h-4" />
        </Link>
      </SimpleContentPage>
    );
  }

  return (
    <SimpleContentPage eyebrow="Blogs" title={post.title}>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          {post.category ? (
            <span className="inline-block text-xs tracking-wider uppercase text-accent font-medium">
              {post.category}
            </span>
          ) : null}
        </div>

        <div className="space-y-5">
          {blocks.map((b, idx) => {
            if (b.kind === 'heading') {
              const H =
                b.level === 1 ? 'h2' : b.level === 2 ? 'h3' : b.level === 3 ? 'h4' : ('h5' as const);
              const cls =
                b.level === 1
                  ? 'text-heading text-foreground mt-8'
                  : b.level === 2
                    ? 'font-heading text-2xl text-foreground mt-8'
                    : 'font-heading text-xl text-foreground mt-6';
              return (
                <H key={`${b.kind}:${idx}`} className={cls}>
                  {renderInline(b.text)}
                </H>
              );
            }
            if (b.kind === 'ul') {
              return (
                <ul key={`${b.kind}:${idx}`} className="list-disc pl-5 space-y-2 text-body">
                  {b.items.map((it) => (
                    <li key={it}>{renderInline(it)}</li>
                  ))}
                </ul>
              );
            }
            if (b.kind === 'ol') {
              return (
                <ol key={`${b.kind}:${idx}`} className="list-decimal pl-5 space-y-2 text-body">
                  {b.items.map((it) => (
                    <li key={it}>{renderInline(it)}</li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={`${b.kind}:${idx}`} className="text-body">
                {renderInline(b.text)}
              </p>
            );
          })}
        </div>

        <div className="pt-6 border-t border-border">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300"
          >
            Terug naar blogs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </SimpleContentPage>
  );
}

