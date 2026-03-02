import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { BLOG_POSTS } from '@/data/blogs';

function formatDate(dateString: string): string {
  // Convert "10 februari 2025" to a more readable format
  return dateString;
}

const Blogs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">
                Blogs
              </span>
              <h1 className="text-display text-cream mt-4 mb-6">Blogs</h1>
              <div className="w-16 h-0.5 bg-accent mb-6" />
            </div>
          </div>
        </section>

        {/* Blogs Content - Directly after hero, no padding */}
        <section className="pb-12 md:pb-16 lg:pb-20">
          <div className="container mx-auto px-6">
      <div className="space-y-10">
        <p className="text-lead-dark">
          Ontdek onze nieuwste artikelen, tips en inzichten over beauty, wellness en gezondheid. Van gezichtsbehandelingen tot massages,
          van haarverzorging tot wellness — blijf op de hoogte van de laatste trends en behandelmethoden.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-card border border-border rounded-sm p-6 hover:shadow-xl transition-all duration-500 hover-glow flex flex-col"
            >
              <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                <Calendar className="w-3 h-3" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              {post.category && (
                <span className="inline-block text-xs tracking-wider uppercase text-accent font-medium mb-2">
                  {post.category}
                </span>
              )}
                    <h2 className="font-heading text-xl text-foreground mb-3 line-clamp-2">{post.title}</h2>
              <p className="text-body mb-5 flex-grow line-clamp-3">{post.excerpt}</p>
              <Link
                to={`/blogs/${post.id}`}
                className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300 mt-auto"
              >
                Lees verder
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="p-6 bg-muted rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-foreground">Wil je iets specifieks terugzien?</p>
            <p className="text-small">Stuur je onderwerp/idee door — dan zetten we het in de contentplanning.</p>
          </div>
          <Button asChild variant="outline" className="tracking-wider uppercase">
            <Link to="/contact">Stuur een suggestie</Link>
          </Button>
        </div>
      </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;

