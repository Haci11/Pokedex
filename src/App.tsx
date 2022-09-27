import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Pokemon } from "./Type";
import { Pokemons } from "./Type";

export default function App() {

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>("");

  useEffect(() => {
    const getPokemon = async () => {
      const res =  await axios.get("https://pokeapi.co/api/v2/pokemon/");

      setNextUrl(res.data.next);
      console.log("loading..");

      res.data.results.forEach(async (pokemon: Pokemons) => {
        const poke = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        setPokemons((p) => [...p, poke.data]);
      });
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
                <p>{pokemon.name}</p>
                <img src={pokemon.sprites.front_default} alt="pic" />
              </div>
            );
          })}
        </div>
        <button className="btn" onClick={nextPage}>
          Charger
        </button>
      </div>
    </div>
  );
}
