export function formatPokemonName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getPokemonImageUrl(url: string) {
  const pokemonId = url.split('/').filter(Boolean).pop();

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
}
