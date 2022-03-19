## Pokemon Booster Pack Sim
The goal of this project is to create a visceral experience for 'pull rates'(probabilities) for Pokemon booster packs and sets. The idea came to me after a cool new set released and I wanted to find out what my chances were of pulling the cards I was interested in.

API used : https://docs.pokemontcg.io/

# TODO
must have
- style pack gen page
- gray out 'generate pack' if probabilities are invalid
- search for sets
- show all button -> staggered flip animation, jumps to rare (replaces jump to rare)
- make 'scroll to top' easier to use

- error handling
    - promo sets
- featured sets w/ accuracy
    - correct card distribution per set
    - accurate booster pack (10 cards, 1 basic energy, => 5 common, 3 uncommon, [reverse slot/parallel slot], 1 rare, 1 energy)

nice to have
- Pack value from tcg price
- history of rares opened
- find a site with pull rates
- One reverse holo per pack
- Set cost of booster pack 
- Total spent from rolls

# bugs 
- when user presses 'generate pack' -> flash of unwanted image 

# Done
- card flip animation
- Save probability in storage
- style home page

# Features
- used static site generation to pre-render 140 pages (build time: )