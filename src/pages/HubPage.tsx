import Nav from '../components/Nav';
import Hero from '../components/Hero';
import GameGrid from '../components/GameGrid';
import Footer from '../components/Footer';

export default function HubPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <GameGrid />
      </main>
      <Footer />
    </>
  );
}
