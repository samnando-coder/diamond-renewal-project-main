import { Link } from 'react-router-dom';
import { SimpleContentPage } from './_SimpleContentPage';

const Afspraak = () => {
  return (
    <SimpleContentPage eyebrow="Afspraak" title="Afspraak maken">
      <p className="text-body mb-8">Plan je afspraak eenvoudig online via onze widget.</p>

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <iframe
          title="Salonized booking widget"
          src="https://widget.salonized.com/widget?color=%23cea527&language=nl&company=kR28FWHdJXS2PRP38KMUSALg"
          style={{ border: 0, width: '100%', height: '80vh' }}
          loading="lazy"
        />
      </div>

      <div className="mt-8">
        <Link to="/contact" className="text-accent hover:underline text-sm font-medium">
          Vragen? Ga naar contact →
        </Link>
      </div>
    </SimpleContentPage>
  );
};

export default Afspraak;

