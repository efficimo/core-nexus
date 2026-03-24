export function Footer() {
  return (
    <footer>
      <p>Tenir la Ligne Zero. Corriger l'irreparable.</p>
      <span>
        <img src={`${import.meta.env.BASE_URL}images/cdw-big.gif`} alt="necessary ad" />
        <img
          src={`${import.meta.env.BASE_URL}images/barnes-and-noble-big.gif`}
          alt="absolutely vital ad"
        />
        <img src={`${import.meta.env.BASE_URL}images/cars.com.gif`} alt="absolutely vital ad" />
      </span>
    </footer>
  );
}
