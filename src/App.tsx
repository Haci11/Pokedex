import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

type Pokemon = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
};

type Pokemons = {
  name: string;
  url: string;
};

export default function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPokemon = async () => {
      const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=20&offset=20"
      );

      setNextUrl(res.data.next);

      res.data.results.forEach(async (pokemon: Pokemons) => {
        const poke = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        setPokemons((p) => [...p, poke.data]);
      });
      setLoading(true);
    };
    getPokemon();
  }, []);

  const nextPage = async () => {
    let res = await axios.get(nextUrl);

    setNextUrl(res.data.next);

    res.data.results.forEach(async (pokemon: Pokemons) => {
      const poke = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      setPokemons((p) => [...p, poke.data]);
    });
  };


  return (
    <div className="App">
      <div className="container">
        <header className="pokemon-header"> Pokemon</header>
        <div className="card-body">
          {pokemons.map((pokemon) => {
            return (
              <div className="card">
                <li>{pokemon.name}</li>
                <img src={pokemon.sprites.front_default} alt="pic" />
              </div>
            );
          })}
        </div>
        <button onClick={nextPage}>Charger</button>
      </div>
    </div>
  );
}
