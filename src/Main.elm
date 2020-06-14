port module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onCheck, onInput)
import Html.Keyed
import Html.Lazy exposing (lazy, lazy2)
import List
import Set as S exposing (Set)
import Json.Encode as E
import Json.Decode as D

main : Program E.Value Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = updateWithStorage
        , subscriptions = always Sub.none
        }

type alias Model = { 
    availableRecipes: List Recipe,
    obtained: Set String,
    filter: String
  }

type alias Recipe = {
    id: String,
    source: List Source,
    name: String,
    sourceStrings: List String
  }

type Source = Villager Personality | Other String

showSource : Source -> String
showSource s = case s of
  Villager p -> "From " ++ showPersonality p ++ " villager"
  Other description -> description

type Personality = Cranky | Jock | Lazy | Normal | Peppy | Sisterly | Smug | Snooty | Any
showPersonality : Personality -> String
showPersonality p = case p of 
    Cranky -> "Cranky"
    Jock -> "Jock"
    Lazy -> "Lazy"
    Normal -> "Normal"
    Peppy -> "Peppy"
    Sisterly -> "Sisterly"
    Smug -> "Smug"
    Snooty -> "Snooty"
    Any -> "any"

type Msg = Obtain Recipe | Unobtain Recipe | Filter String

init : E.Value -> (Model, Cmd Msg)
init flags = 
    let obtainedStorage = case D.decodeValue decoder flags of
                            Ok s -> S.fromList s
                            Err _ -> S.empty
    in (
      { availableRecipes = List.map addSourceString availableRecipes
      , obtained = obtainedStorage
      , filter = ""
      },
      Cmd.none
    )

view : Model -> Html Msg
view model =
  div [] [
    lazy navBar model.filter,
    lazy body model
  ]

body : Model -> Html Msg
body model =
  let (have, need) = List.partition ((\r -> S.member r.id model.obtained)) model.availableRecipes
      keywords = List.filter ((/=) "") (String.split " " (String.toLower model.filter))
      section title recipes checked = [h3 [] [text title], recipesView checked recipes keywords]
  in div [class "container"] (section "To obtain" need False ++ section "Obtained" have True)

navBar : String -> Html Msg
navBar filterText =
  nav [class "navbar navbar-light bg-light"]
    [
      span [class "navbar-brand"] [text "ACNH DIY Recipe Tracker"],
      Html.form [class "form-inline"] [
        label [class "my-1 mr-2", for "searchRecipes"]
          [text "Search:"],
        input [onInput Filter, class "form-control", type_ "search", id "searchRecipes"]
          [text filterText]
      ]
    ]

recipesView : Bool -> List Recipe -> List String -> Html Msg
recipesView obtained recipes filter =
  Html.Keyed.node "div"
    [class "row row-cols-2 row-cols-md-4"]
    (List.map (keyedRecipeView obtained) (List.filter (matches filter) recipes))

matches : List String -> Recipe -> Bool
matches keywords recipe =
  let fields = List.map String.toLower (recipe.name :: recipe.sourceStrings)
  in case keywords of
       [] -> True
       _  -> List.all (\k -> List.any (String.contains k) fields) keywords

keyedRecipeView : Bool -> Recipe -> (String, Html Msg)
keyedRecipeView obtained recipe = (recipe.id, lazy2 recipeView obtained recipe)

recipeView : Bool -> Recipe -> Html Msg
recipeView obtained recipe =
  div [class "col mb-4"] [
    div [class "card h-100"] [
      div [class "card-body"] [
        h5 [class "card-title"] [text recipe.name],
        p [] (case recipe.source of 
          [] -> [text "Other"]
          _  -> List.map text recipe.sourceStrings
        )
      ],
      div [class "card-footer bg-transparent"] [
        div [class "form-check"] [
          label [class "form-check-label"] [
            input [
              type_ "checkbox",
              class "form-check-input",
              onCheck (\val -> if val then Obtain recipe else Unobtain recipe),
              checked obtained
            ] [],
            text "Obtained"
          ]
        ]
      ]
    ]
  ]

update: Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  Obtain recipe -> ({ model | obtained = S.insert recipe.id model.obtained }, Cmd.none)
  Unobtain recipe -> ({ model | obtained = S.remove recipe.id model.obtained }, Cmd.none)
  Filter text -> ({ model | filter = text }, Cmd.none)

port setStorage : E.Value -> Cmd msg

updateWithStorage : Msg -> Model -> ( Model, Cmd Msg )
updateWithStorage msg oldModel =
  let
    ( newModel, cmds ) = update msg oldModel
  in
  ( newModel
  , Cmd.batch [ setStorage (encode newModel), cmds ]
  )

encode : Model -> E.Value
encode model = E.set E.string model.obtained

decoder : D.Decoder (List String)
decoder = D.list D.string

addSourceString baseRecipe = { 
    id = baseRecipe.id,
    name = baseRecipe.name,
    source = baseRecipe.source,
    sourceStrings = List.map showSource baseRecipe.source
  }

availableRecipes = [
    { id = "acorn-pochette", source = [Other "Seasonal: autumn, from balloons"], name = "Acorn Pochette" },
    { id = "acoustic-guitar", source = [Villager Smug], name = "Acoustic Guitar" },
    { id = "angled-signpost", source = [Villager Lazy], name = "Angled Signpost" },
    { id = "apple-chair", source = [Villager Sisterly], name = "Apple Chair" },
    { id = "apple-dress", source = [Villager Sisterly], name = "Apple Dress" },
    { id = "apple-hat", source = [Villager Sisterly], name = "Apple Hat" },
    { id = "apple-rug", source = [Villager Sisterly], name = "Apple Rug" },
    { id = "apple-umbrella", source = [Villager Sisterly], name = "Apple Umbrella" },
    { id = "apple-wall", source = [Villager Sisterly], name = "Apple Wall" },
    { id = "aquarius-urn", source = [Other "Celeste"], name = "Aquarius Urn" },
    { id = "aries-rocking-chair", source = [Other "Celeste"], name = "Aries Rocking Chair" },
    { id = "armor-shoes", source = [Villager Cranky], name = "Armor Shoes" },
    { id = "aroma-pot", source = [Villager Snooty], name = "Aroma Pot" },
    { id = "asteroid", source = [Other "Celeste"], name = "Asteroid" },
    { id = "astronaut-suit", source = [Other "Celeste"], name = "Astronaut Suit" },
    { id = "autumn-wall", source = [Other "Seasonal: autumn, from balloons"], name = "Autumn Wall" },
    { id = "axe", source = [], name = "Axe" },
    { id = "backyard-lawn", source = [Villager Peppy], name = "Backyard Lawn" },
    { id = "bamboo-basket", source = [Villager Snooty], name = "Bamboo Basket" },
    { id = "bamboo-bench", source = [Villager Normal], name = "Bamboo Bench" },
    { id = "bamboo-candleholder", source = [Villager Snooty], name = "Bamboo Candleholder" },
    { id = "bamboo-doll", source = [Other "Seasonal: spring, from balloons"], name = "Bamboo Doll" },
    { id = "bamboo-drum", source = [Villager Jock], name = "Bamboo Drum" },
    { id = "bamboo-floor-lamp", source = [Villager Normal], name = "Bamboo Floor Lamp" },
    { id = "bamboo-flooring", source = [Villager Cranky], name = "Bamboo Flooring" },
    { id = "bamboo-hat", source = [Villager Cranky], name = "Bamboo Hat" },
    { id = "bamboo-lattice-fence", source = [Other "Nook Stop"], name = "Bamboo Lattice Fence" },
    { id = "bamboo-lunch-box", source = [Villager Snooty], name = "Bamboo Lunch Box" },
    { id = "bamboo-noodle-slide", source = [Other "Seasonal: spring, from balloons"], name = "Bamboo Noodle Slide" },
    { id = "bamboo-partition", source = [Villager Cranky], name = "Bamboo Partition" },
    { id = "bamboo-shelf", source = [Villager Snooty], name = "Bamboo Shelf" },
    { id = "bamboo-speaker", source = [Villager Snooty], name = "Bamboo Speaker" },
    { id = "bamboo-sphere", source = [Villager Normal], name = "Bamboo Sphere" },
    { id = "bamboo-stool", source = [Villager Snooty], name = "Bamboo Stool" },
    { id = "bamboo-stopblock", source = [Villager Jock], name = "Bamboo Stopblock" },
    { id = "bamboo-wall", source = [Villager Cranky], name = "Bamboo Wall" },
    { id = "bamboo-wall-decoration", source = [Villager Jock], name = "Bamboo Wall Decoration" },
    { id = "bamboo-wand", source = [Other "Seasonal: spring, from balloons"], name = "Bamboo Wand" },
    { id = "bamboo-grove-wall", source = [Other "Seasonal: spring, from balloons"], name = "Bamboo-grove Wall" },
    { id = "bamboo-shoot-lamp", source = [Other "Seasonal: spring, from balloons"], name = "Bamboo-shoot Lamp" },
    { id = "barbed-wire-fence", source = [Other "Nook Stop"], name = "Barbed-wire Fence" },
    { id = "barbell", source = [Villager Jock], name = "Barbell" },
    { id = "barrel", source = [Villager Cranky], name = "Barrel" },
    { id = "basement-flooring", source = [Villager Smug], name = "Basement Flooring" },
    { id = "basket-pack", source = [Other "Seasonal: spring, from balloons"], name = "Basket Pack" },
    { id = "beekeepers-hive", source = [Villager Jock], name = "Beekeeper's Hive" },
    { id = "big-festive-tree", source = [Other "Seasonal: festive, from balloons"], name = "Big Festive Tree" },
    { id = "birdbath", source = [Villager Snooty], name = "Birdbath" },
    { id = "birdcage", source = [Villager Sisterly], name = "Birdcage" },
    { id = "birdhouse", source = [Villager Peppy], name = "Birdhouse" },
    { id = "blossom-viewing-lantern", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Blossom-viewing Lantern" },
    { id = "blue-rose-crown", source = [Villager Any], name = "Blue Rose Crown" },
    { id = "blue-rose-wreath", source = [Villager Any], name = "Blue Rose Wreath" },
    { id = "bone-doorplate", source = [Villager Lazy], name = "Bone Doorplate" },
    { id = "bonfire", source = [Villager Cranky], name = "Bonfire" },
    { id = "bonsai-shelf", source = [Villager Cranky], name = "Bonsai Shelf" },
    { id = "boomerang", source = [Villager Lazy], name = "Boomerang" },
    { id = "brick-fence", source = [Other "Nook Stop"], name = "Brick Fence" },
    { id = "brick-oven", source = [Other "Nook's Cranny: Wildest Dreams DIY"], name = "Brick Oven" },
    { id = "brick-well", source = [Other "Nook Stop"], name = "Brick Well" },
    { id = "brown-herringbone-wall", source = [Villager Sisterly], name = "Brown Herringbone Wall" },
    { id = "bunny-day-arch", source = [Other "Seasonal: bunny day"], name = "Bunny Day Arch" },
    { id = "bunny-day-bag", source = [Other "Seasonal: bunny day"], name = "Bunny Day Bag" },
    { id = "bunny-day-bed", source = [Other "Seasonal: bunny day"], name = "Bunny Day Bed" },
    { id = "bunny-day-crown", source = [Other "Seasonal: bunny day"], name = "Bunny Day Crown" },
    { id = "bunny-day-fence", source = [Other "Seasonal: bunny day"], name = "Bunny Day Fence" },
    { id = "bunny-day-festive-balloons", source = [Other "Seasonal: bunny day"], name = "Bunny Day Festive Balloons" },
    { id = "bunny-day-flooring", source = [Other "Seasonal: bunny day"], name = "Bunny Day Flooring" },
    { id = "bunny-day-glowy-garland", source = [Other "Seasonal: bunny day"], name = "Bunny Day Glowy Garland" },
    { id = "bunny-day-lamp", source = [Other "Seasonal: bunny day"], name = "Bunny Day Lamp" },
    { id = "bunny-day-merry-balloons", source = [Other "Seasonal: bunny day"], name = "Bunny Day Merry Balloons" },
    { id = "bunny-day-rug", source = [Other "Seasonal: bunny day"], name = "Bunny Day Rug" },
    { id = "bunny-day-stool", source = [Other "Seasonal: bunny day"], name = "Bunny Day Stool" },
    { id = "bunny-day-table", source = [Other "Seasonal: bunny day"], name = "Bunny Day Table" },
    { id = "bunny-day-vanity", source = [Other "Seasonal: bunny day"], name = "Bunny Day Vanity" },
    { id = "bunny-day-wall", source = [Other "Seasonal: bunny day"], name = "Bunny Day Wall" },
    { id = "bunny-day-wall-clock", source = [Other "Seasonal: bunny day"], name = "Bunny Day Wall Clock" },
    { id = "bunny-day-wand", source = [Other "Seasonal: bunny day"], name = "Bunny Day Wand" },
    { id = "bunny-day-wardrobe", source = [Other "Seasonal: bunny day"], name = "Bunny Day Wardrobe" },
    { id = "bunny-day-wreath", source = [Other "Seasonal: bunny day"], name = "Bunny Day Wreath" },
    { id = "butter-churn", source = [Villager Snooty], name = "Butter Churn" },
    { id = "cabin-wall", source = [Villager Peppy], name = "Cabin Wall" },
    { id = "campfire", source = [], name = "Campfire" },
    { id = "cancer-table", source = [Other "Celeste"], name = "Cancer Table" },
    { id = "capricorn-ornament", source = [Other "Celeste"], name = "Capricorn Ornament" },
    { id = "cardboard-bed", source = [Villager Lazy], name = "Cardboard Bed" },
    { id = "cardboard-chair", source = [Villager Lazy], name = "Cardboard Chair" },
    { id = "cardboard-sofa", source = [Villager Peppy], name = "Cardboard Sofa" },
    { id = "cardboard-table", source = [Villager Peppy], name = "Cardboard Table" },
    { id = "cherry-dress", source = [Villager Peppy], name = "Cherry Dress" },
    { id = "cherry-hat", source = [Villager Peppy], name = "Cherry Hat" },
    { id = "cherry-lamp", source = [Villager Peppy], name = "Cherry Lamp" },
    { id = "cherry-rug", source = [Villager Peppy], name = "Cherry Rug" },
    { id = "cherry-speakers", source = [Villager Peppy], name = "Cherry Speakers" },
    { id = "cherry-umbrella", source = [Villager Peppy], name = "Cherry Umbrella" },
    { id = "cherry-wall", source = [Villager Peppy], name = "Cherry Wall" },
    { id = "cherry-blossom-bonsai", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Cherry-blossom Bonsai" },
    { id = "cherry-blossom-branches", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Cherry-blossom Branches" },
    { id = "cherry-blossom-clock", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Cherry-blossom Clock" },
    { id = "cherry-blossom-flooring", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Cherry-blossom Flooring" },
    { id = "cherry-blossom-pochette", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Cherry-blossom Pochette" },
    { id = "cherry-blossom-pond-stone", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Cherry-blossom Pond Stone" },
    { id = "cherry-blossom-umbrella", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Cherry-blossom Umbrella" },
    { id = "cherry-blossom-wand", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Cherry-blossom Wand" },
    { id = "cherry-blossom-petal-pile", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Cherry-blossom-petal Pile" },
    { id = "cherry-blossom-trees-wall", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Cherry-blossom-trees Wall" },
    { id = "chic-cosmos-wreath", source = [Villager Any], name = "Chic Cosmos Wreath" },
    { id = "chic-mum-crown", source = [Villager Any], name = "Chic Mum Crown" },
    { id = "chic-rose-crown", source = [Villager Any], name = "Chic Rose Crown" },
    { id = "chic-tulip-crown", source = [Villager Any], name = "Chic Tulip Crown" },
    { id = "chic-windflower-wreath", source = [Villager Any], name = "Chic Windflower Wreath" },
    { id = "chocolate-herringbone-wall", source = [Villager Smug], name = "Chocolate Herringbone Wall" },
    { id = "clackercart", source = [Villager Lazy], name = "Clackercart" },
    { id = "classic-pitcher", source = [Villager Snooty], name = "Classic Pitcher" },
    { id = "classic-library-wall", source = [Villager Normal], name = "Classic-library Wall" },
    { id = "clothesline", source = [Villager Cranky], name = "Clothesline" },
    { id = "coconut-juice", source = [Villager Snooty], name = "Coconut Juice" },
    { id = "coconut-wall-planter", source = [Villager Snooty], name = "Coconut Wall Planter" },
    { id = "colored-leaves-flooring", source = [Other "Seasonal: autumn, from balloons"], name = "Colored-leaves Flooring" },
    { id = "cool-hyacinth-crown", source = [Villager Any], name = "Cool Hyacinth Crown" },
    { id = "cool-hyacinth-wreath", source = [Villager Any], name = "Cool Hyacinth Wreath" },
    { id = "cool-pansy-crown", source = [Villager Any], name = "Cool Pansy Crown" },
    { id = "cool-pansy-wreath", source = [Villager Any], name = "Cool Pansy Wreath" },
    { id = "cool-windflower-crown", source = [Villager Any], name = "Cool Windflower Crown" },
    { id = "cool-windflower-wreath", source = [Villager Any], name = "Cool Windflower Wreath" },
    { id = "corral-fence", source = [Other "Nook Stop"], name = "Corral Fence" },
    { id = "cosmos-crown", source = [Villager Any], name = "Cosmos Crown" },
    { id = "cosmos-shower", source = [Villager Snooty], name = "Cosmos Shower" },
    { id = "cosmos-wand", source = [Other "Celeste"], name = "Cosmos Wand" },
    { id = "cosmos-wreath", source = [Villager Any], name = "Cosmos Wreath" },
    { id = "country-fence", source = [Other "Nook Stop"], name = "Country Fence" },
    { id = "crescent-moon-chair", source = [Other "Celeste"], name = "Crescent-moon Chair" },
    { id = "crest-doorplate", source = [Villager Smug], name = "Crest Doorplate" },
    { id = "crewed-spaceship", source = [Other "Celeste"], name = "Crewed Spaceship" },
    { id = "cute-lily-crown", source = [Villager Any], name = "Cute Lily Crown" },
    { id = "cute-rose-crown", source = [Villager Any], name = "Cute Rose Crown" },
    { id = "cutting-board", source = [Villager Normal], name = "Cutting Board" },
    { id = "dark-bamboo-rug", source = [Villager Cranky], name = "Dark Bamboo Rug" },
    { id = "dark-cosmos-crown", source = [Villager Any], name = "Dark Cosmos Crown" },
    { id = "dark-lily-crown", source = [Villager Any], name = "Dark Lily Crown" },
    { id = "dark-lily-wreath", source = [Villager Any], name = "Dark Lily Wreath" },
    { id = "dark-rose-wreath", source = [Villager Any], name = "Dark Rose Wreath" },
    { id = "dark-tulip-crown", source = [Villager Any], name = "Dark Tulip Crown" },
    { id = "dark-tulip-wreath", source = [Villager Any], name = "Dark Tulip Wreath" },
    { id = "dark-wooden-mosaic-wall", source = [Villager Sisterly], name = "Dark Wooden-mosaic Wall" },
    { id = "decoy-duck", source = [Villager Smug], name = "Decoy Duck" },
    { id = "deer-decoration", source = [Villager Lazy], name = "Deer Decoration" },
    { id = "deer-scare", source = [Villager Cranky], name = "Deer Scare" },
    { id = "destinations-signpost", source = [Other "Nook Stop"], name = "Destinations Signpost" },
    { id = "diy-workbench", source = [Villager Sisterly], name = "Diy Workbench" },
    { id = "document-stack", source = [Villager Smug], name = "Document Stack" },
    { id = "doghouse", source = [Villager Jock], name = "Doghouse" },
    { id = "drinking-fountain", source = [Other "Nook Stop"], name = "Drinking Fountain" },
    { id = "earth-egg-outfit", source = [Other "Seasonal: bunny day"], name = "Earth-egg Outfit" },
    { id = "earth-egg-shell", source = [Other "Seasonal: bunny day"], name = "Earth-egg Shell" },
    { id = "earth-egg-shoes", source = [Other "Seasonal: bunny day"], name = "Earth-egg Shoes" },
    { id = "egg-party-dress", source = [Other "Seasonal: bunny day"], name = "Egg Party Dress" },
    { id = "egg-party-hat", source = [Other "Seasonal: bunny day"], name = "Egg Party Hat" },
    { id = "fancy-lily-wreath", source = [Villager Any], name = "Fancy Lily Wreath" },
    { id = "fancy-mum-wreath", source = [Villager Any], name = "Fancy Mum Wreath" },
    { id = "fancy-rose-wreath", source = [Villager Any], name = "Fancy Rose Wreath" },
    { id = "festive-top-set", source = [Other "Seasonal: festive, from balloons"], name = "Festive Top Set" },
    { id = "festive-tree", source = [Other "Seasonal: festive, from balloons"], name = "Festive Tree" },
    { id = "firewood", source = [Villager Jock], name = "Firewood" },
    { id = "fish-bait", source = [Other "Inspiration: digging up clams"], name = "Fish Bait" },
    { id = "fishing-rod", source = [], name = "Fishing Rod" },
    { id = "flat-garden-rock", source = [Villager Snooty], name = "Flat Garden Rock" },
    { id = "flimsy-axe", source = [], name = "Flimsy Axe" },
    { id = "flimsy-fishing-rod", source = [], name = "Flimsy Fishing Rod" },
    { id = "flimsy-net", source = [], name = "Flimsy Net" },
    { id = "flimsy-shovel", source = [], name = "Flimsy Shovel" },
    { id = "flimsy-watering-can", source = [], name = "Flimsy Watering Can" },
    { id = "floral-swag", source = [Villager Normal], name = "Floral Swag" },
    { id = "flower-stand", source = [Villager Sisterly], name = "Flower Stand" },
    { id = "flying-saucer", source = [Other "Celeste"], name = "Flying Saucer" },
    { id = "forest-flooring", source = [Other "Seasonal: mushrooms, from balloons"], name = "Forest Flooring" },
    { id = "forest-wall", source = [Other "Seasonal: mushrooms, from balloons"], name = "Forest Wall" },
    { id = "fossil-doorplate", source = [Villager Jock], name = "Fossil Doorplate" },
    { id = "fountain", source = [Other "Nook Stop"], name = "Fountain" },
    { id = "frozen-arch", source = [Other "Seasonal: winter, from balloons"], name = "Frozen Arch" },
    { id = "frozen-bed", source = [Other "Seasonal: winter, from balloons"], name = "Frozen Bed" },
    { id = "frozen-chair", source = [Other "Seasonal: winter, from balloons"], name = "Frozen Chair" },
    { id = "frozen-counter", source = [Other "Seasonal: winter, from balloons"], name = "Frozen Counter" },
    { id = "frozen-partition", source = [Other "Seasonal: winter, from balloons"], name = "Frozen Partition" },
    { id = "frozen-pillar", source = [Other "Seasonal: winter, from balloons"], name = "Frozen Pillar" },
    { id = "frozen-sculpture", source = [Other "Seasonal: winter, from balloons"], name = "Frozen Sculpture" },
    { id = "frozen-table", source = [Other "Seasonal: winter, from balloons"], name = "Frozen Table" },
    { id = "frozen-tree", source = [Other "Seasonal: winter, from balloons"], name = "Frozen Tree" },
    { id = "frozen-treat-set", source = [Other "Seasonal: winter, from balloons"], name = "Frozen-treat Set" },
    { id = "fruit-basket", source = [Villager Cranky], name = "Fruit Basket" },
    { id = "fruit-wreath", source = [Villager Cranky], name = "Fruit Wreath" },
    { id = "frying-pan", source = [Other "Nook's Cranny: DIY For Beginners"], name = "Frying Pan" },
    { id = "galaxy-flooring", source = [Other "Celeste"], name = "Galaxy Flooring" },
    { id = "garbage-heap-flooring", source = [Other "Inspiration: fishing up trash"], name = "Garbage-heap Flooring" },
    { id = "garbage-heap-wall", source = [Other "Inspiration: fishing up trash"], name = "Garbage-heap Wall" },
    { id = "garden-bench", source = [Villager Snooty], name = "Garden Bench" },
    { id = "garden-rock", source = [Villager Lazy], name = "Garden Rock" },
    { id = "garden-wagon", source = [Villager Peppy], name = "Garden Wagon" },
    { id = "gemini-closet", source = [Other "Celeste"], name = "Gemini Closet" },
    { id = "giant-teddy-bear", source = [Villager Peppy], name = "Giant Teddy Bear" },
    { id = "gold-armor", source = [Villager Smug], name = "Gold Armor" },
    { id = "gold-bars", source = [Villager Snooty], name = "Gold Bars" },
    { id = "gold-helmet", source = [Villager Smug], name = "Gold Helmet" },
    { id = "gold-rose-crown", source = [Villager Any], name = "Gold Rose Crown" },
    { id = "gold-rose-wreath", source = [Villager Any], name = "Gold Rose Wreath" },
    { id = "gold-screen-wall", source = [Villager Smug], name = "Gold Screen Wall" },
    { id = "gold-armor-shoes", source = [Villager Smug], name = "Gold-armor Shoes" },
    { id = "golden-arowana-model", source = [Villager Lazy], name = "Golden Arowana Model" },
    { id = "golden-axe", source = [], name = "Golden Axe" },
    { id = "golden-candlestick", source = [Villager Smug], name = "Golden Candlestick" },
    { id = "golden-casket", source = [Villager Smug], name = "Golden Casket" },
    { id = "golden-dishes", source = [Villager Snooty], name = "Golden Dishes" },
    { id = "golden-dung-beetle", source = [Villager Lazy], name = "Golden Dung Beetle" },
    { id = "golden-flooring", source = [Villager Smug], name = "Golden Flooring" },
    { id = "golden-gears", source = [Villager Smug], name = "Golden Gears" },
    { id = "golden-net", source = [], name = "Golden Net" },
    { id = "golden-rod", source = [], name = "Golden Rod" },
    { id = "golden-seat", source = [Villager Snooty], name = "Golden Seat" },
    { id = "golden-shovel", source = [], name = "Golden Shovel" },
    { id = "golden-slingshot", source = [], name = "Golden Slingshot" },
    { id = "golden-toilet", source = [Villager Snooty], name = "Golden Toilet" },
    { id = "golden-wall", source = [Villager Smug], name = "Golden Wall" },
    { id = "golden-wand", source = [Other "Celeste"], name = "Golden Wand" },
    { id = "golden-watering-can", source = [], name = "Golden Watering Can" },
    { id = "gong", source = [Villager Cranky], name = "Gong" },
    { id = "grass-skirt", source = [Villager Normal], name = "Grass Skirt" },
    { id = "grass-standee", source = [Villager Normal], name = "Grass Standee" },
    { id = "green-grass-skirt", source = [Villager Peppy], name = "Green Grass Skirt" },
    { id = "green-leaf-pile", source = [Other "Seasonal: spring, from balloons"], name = "Green-leaf Pile" },
    { id = "hanging-terrarium", source = [Villager Peppy], name = "Hanging Terrarium" },
    { id = "hay-bed", source = [Other "Nook's Cranny: DIY For Beginners"], name = "Hay Bed" },
    { id = "hearth", source = [Other "Nook's Cranny: Wildest Dreams DIY"], name = "Hearth" },
    { id = "hedge", source = [Other "Seasonal: nature day"], name = "Hedge" },
    { id = "hedge-standee", source = [Villager Normal], name = "Hedge Standee" },
    { id = "holiday-candle", source = [Other "Seasonal: festive, from balloons"], name = "Holiday Candle" },
    { id = "honeycomb-flooring", source = [Villager Jock], name = "Honeycomb Flooring" },
    { id = "honeycomb-wall", source = [Villager Jock], name = "Honeycomb Wall" },
    { id = "hyacinth-crown", source = [Villager Any], name = "Hyacinth Crown" },
    { id = "hyacinth-lamp", source = [Villager Sisterly], name = "Hyacinth Lamp" },
    { id = "hyacinth-wand", source = [Other "Celeste"], name = "Hyacinth Wand" },
    { id = "hyacinth-wreath", source = [Villager Any], name = "Hyacinth Wreath" },
    { id = "ice-flooring", source = [Other "Seasonal: winter, from balloons"], name = "Ice Flooring" },
    { id = "ice-wall", source = [Other "Seasonal: winter, from balloons"], name = "Ice Wall" },
    { id = "ice-wand", source = [Other "Seasonal: winter, from balloons"], name = "Ice Wand" },
    { id = "iceberg-flooring", source = [Other "Seasonal: winter, from balloons"], name = "Iceberg Flooring" },
    { id = "iceberg-wall", source = [Other "Seasonal: winter, from balloons"], name = "Iceberg Wall" },
    { id = "illuminated-present", source = [Other "Seasonal: festive, from balloons"], name = "Illuminated Present" },
    { id = "illuminated-reindeer", source = [Other "Seasonal: festive, from balloons"], name = "Illuminated Reindeer" },
    { id = "illuminated-snowflakes", source = [Other "Seasonal: festive, from balloons"], name = "Illuminated Snowflakes" },
    { id = "illuminated-tree", source = [Other "Seasonal: festive, from balloons"], name = "Illuminated Tree" },
    { id = "imperial-fence", source = [Other "Nook Stop"], name = "Imperial Fence" },
    { id = "infused-water-dispenser", source = [Villager Cranky], name = "Infused-water Dispenser" },
    { id = "iron-armor", source = [Villager Cranky], name = "Iron Armor" },
    { id = "iron-closet", source = [Villager Sisterly], name = "Iron Closet" },
    { id = "iron-doorplate", source = [Villager Sisterly], name = "Iron Doorplate" },
    { id = "iron-fence", source = [Other "Nook Stop"], name = "Iron Fence" },
    { id = "iron-frame", source = [Villager Jock], name = "Iron Frame" },
    { id = "iron-garden-bench", source = [Villager Sisterly], name = "Iron Garden Bench" },
    { id = "iron-garden-chair", source = [Villager Sisterly], name = "Iron Garden Chair" },
    { id = "iron-garden-table", source = [Villager Sisterly], name = "Iron Garden Table" },
    { id = "iron-hanger-stand", source = [Villager Cranky], name = "Iron Hanger Stand" },
    { id = "iron-shelf", source = [Villager Sisterly], name = "Iron Shelf" },
    { id = "iron-wall-lamp", source = [Other "Nook's Cranny: Wildest Dreams DIY"], name = "Iron Wall Lamp" },
    { id = "iron-wall-rack", source = [Villager Smug], name = "Iron Wall Rack" },
    { id = "iron-wand", source = [Other "Celeste"], name = "Iron Wand" },
    { id = "iron-worktable", source = [Villager Sisterly], name = "Iron Worktable" },
    { id = "iron-and-stone-fence", source = [Other "Nook Stop"], name = "Iron-and-stone Fence" },
    { id = "ironwood-bed", source = [Villager Smug], name = "Ironwood Bed" },
    { id = "ironwood-cart", source = [Villager Smug], name = "Ironwood Cart" },
    { id = "ironwood-chair", source = [Villager Smug], name = "Ironwood Chair" },
    { id = "ironwood-clock", source = [Villager Smug], name = "Ironwood Clock" },
    { id = "ironwood-cupboard", source = [Villager Snooty], name = "Ironwood Cupboard" },
    { id = "ironwood-diy-workbench", source = [Villager Cranky], name = "Ironwood Diy Workbench" },
    { id = "ironwood-dresser", source = [Villager Snooty], name = "Ironwood Dresser" },
    { id = "ironwood-kitchenette", source = [Other "Nook's Cranny: Wildest Dreams DIY"], name = "Ironwood Kitchenette" },
    { id = "ironwood-low-table", source = [Villager Snooty], name = "Ironwood Low Table" },
    { id = "ironwood-table", source = [Villager Cranky], name = "Ironwood Table" },
    { id = "jail-bars", source = [Villager Cranky], name = "Jail Bars" },
    { id = "jingle-wall", source = [Other "Seasonal: festive, from balloons"], name = "Jingle Wall" },
    { id = "juicy-apple-tv", source = [Villager Sisterly], name = "Juicy-apple Tv" },
    { id = "jungle-flooring", source = [Villager Jock], name = "Jungle Flooring" },
    { id = "jungle-wall", source = [Villager Jock], name = "Jungle Wall" },
    { id = "kettle-bathtub", source = [Villager Cranky], name = "Kettle Bathtub" },
    { id = "kettlebell", source = [Villager Jock], name = "Kettlebell" },
    { id = "key-holder", source = [Villager Sisterly], name = "Key Holder" },
    { id = "knights-helmet", source = [Villager Cranky], name = "Knight's Helmet" },
    { id = "knitted-grass-backpack", source = [Villager Normal], name = "Knitted-grass Backpack" },
    { id = "ladder", source = [], name = "Ladder" },
    { id = "large-cardboard-boxes", source = [Villager Lazy], name = "Large Cardboard Boxes" },
    { id = "lattice-fence", source = [Other "Nook Stop"], name = "Lattice Fence" },
    { id = "leaf", source = [Villager Jock], name = "Leaf" },
    { id = "leaf-campfire", source = [Other "Seasonal: autumn, from balloons"], name = "Leaf Campfire" },
    { id = "leaf-mask", source = [Villager Peppy], name = "Leaf Mask" },
    { id = "leaf-stool", source = [Other "Seasonal: autumn, from balloons"], name = "Leaf Stool" },
    { id = "leaf-umbrella", source = [Villager Sisterly], name = "Leaf Umbrella" },
    { id = "leaf-egg-outfit", source = [Other "Seasonal: bunny day"], name = "Leaf-egg Outfit" },
    { id = "leaf-egg-shell", source = [Other "Seasonal: bunny day"], name = "Leaf-egg Shell" },
    { id = "leaf-egg-shoes", source = [Other "Seasonal: bunny day"], name = "Leaf-egg Shoes" },
    { id = "leo-sculpture", source = [Other "Celeste"], name = "Leo Sculpture" },
    { id = "libra-scale", source = [Other "Celeste"], name = "Libra Scale" },
    { id = "light-bamboo-rug", source = [Other "Seasonal: spring, from balloons"], name = "Light Bamboo Rug" },
    { id = "lily-crown", source = [Villager Any], name = "Lily Crown" },
    { id = "lily-record-player", source = [Villager Cranky], name = "Lily Record Player" },
    { id = "lily-wand", source = [Other "Celeste"], name = "Lily Wand" },
    { id = "lily-wreath", source = [Villager Any], name = "Lily Wreath" },
    { id = "log-bed", source = [Villager Peppy], name = "Log Bed" },
    { id = "log-bench", source = [Villager Normal], name = "Log Bench" },
    { id = "log-sofa", source = [Villager Normal], name = "Log Chair" },
    { id = "log-decorative-shelves", source = [Villager Normal], name = "Log Decorative Shelves" },
    { id = "log-dining-table", source = [Villager Cranky], name = "Log Dining Table" },
    { id = "log-extra-long-sofa", source = [Villager Normal], name = "Log Extra-long Sofa" },
    { id = "log-garden-lounge", source = [Villager Peppy], name = "Log Garden Lounge" },
    { id = "log-pack", source = [Villager Jock], name = "Log Pack" },
    { id = "log-round-table", source = [Villager Peppy], name = "Log Round Table" },
    { id = "log-stakes", source = [Villager Smug], name = "Log Stakes" },
    { id = "log-stool", source = [Villager Peppy], name = "Log Stool" },
    { id = "log-wall-mounted-clock", source = [Villager Lazy], name = "Log Wall-mounted Clock" },
    { id = "lovely-cosmos-crown", source = [Villager Any], name = "Lovely Cosmos Crown" },
    { id = "lucky-gold-cat", source = [Villager Snooty], name = "Lucky Gold Cat" },
    { id = "lunar-lander", source = [Other "Celeste"], name = "Lunar Lander" },
    { id = "lunar-rover", source = [Other "Inspiration: fishing up trash"], name = "Lunar Rover" },
    { id = "lunar-surface", source = [Other "Celeste"], name = "Lunar Surface" },
    { id = "magazine-rack", source = [Villager Peppy], name = "Magazine Rack" },
    { id = "manga-library-wall", source = [Villager Peppy], name = "Manga-library Wall" },
    { id = "manhole-cover", source = [Other "Nook Stop"], name = "Manhole Cover" },
    { id = "maple-leaf-pochette", source = [Other "Seasonal: autumn, from balloons"], name = "Maple-leaf Pochette" },
    { id = "maple-leaf-pond-stone", source = [Other "Seasonal: autumn, from balloons"], name = "Maple-leaf Pond Stone" },
    { id = "maple-leaf-umbrella", source = [Other "Seasonal: autumn, from balloons"], name = "Maple-leaf Umbrella" },
    { id = "matryoshka", source = [Villager Lazy], name = "Matryoshka" },
    { id = "medicine", source = [], name = "Medicine" },
    { id = "medium-cardboard-boxes", source = [Villager Lazy], name = "Medium Cardboard Boxes" },
    { id = "mini-diy-workbench", source = [Other "Nook's Cranny: Test Your DIY Skills"], name = "Mini DIY Workbench" },
    { id = "modeling-clay", source = [Villager Cranky], name = "Modeling Clay" },
    { id = "modern-wood-wall", source = [Villager Snooty], name = "Modern Wood Wall" },
    { id = "money-flooring", source = [Villager Snooty], name = "Money Flooring" },
    { id = "moon", source = [Other "Celeste"], name = "Moon" },
    { id = "mossy-garden-rock", source = [Villager Lazy], name = "Mossy Garden Rock" },
    { id = "mountain-standee", source = [Villager Jock], name = "Mountain Standee" },
    { id = "mum-crown", source = [Villager Any], name = "Mum Crown" },
    { id = "mum-cushion", source = [Villager Peppy], name = "Mum Cushion" },
    { id = "mum-wreath", source = [Villager Any], name = "Mum Wreath" },
    { id = "mums-wand", source = [Other "Celeste"], name = "Mums Wand" },
    { id = "mush-lamp", source = [Other "Seasonal: mushrooms, from balloons"], name = "Mush Lamp" },
    { id = "mush-log", source = [Other "Seasonal: mushrooms, from balloons"], name = "Mush Log" },
    { id = "mush-low-stool", source = [Other "Seasonal: mushrooms, from balloons"], name = "Mush Low Stool" },
    { id = "mush-parasol", source = [Other "Seasonal: mushrooms, from balloons"], name = "Mush Parasol" },
    { id = "mush-partition", source = [Other "Seasonal: mushrooms, from balloons"], name = "Mush Partition" },
    { id = "mush-table", source = [Other "Seasonal: mushrooms, from balloons"], name = "Mush Table" },
    { id = "mush-umbrella", source = [Other "Seasonal: mushrooms, from balloons"], name = "Mush Umbrella" },
    { id = "mush-wall", source = [Other "Seasonal: mushrooms, from balloons"], name = "Mush Wall" },
    { id = "mushroom-wand", source = [Other "Seasonal: mushrooms, from balloons"], name = "Mushroom Wand" },
    { id = "mushroom-wreath", source = [Other "Seasonal: mushrooms, from balloons"], name = "Mushroom Wreath" },
    { id = "music-stand", source = [Villager Lazy], name = "Music Stand" },
    { id = "natural-garden-chair", source = [Villager Peppy], name = "Natural Garden Chair" },
    { id = "natural-garden-table", source = [Villager Normal], name = "Natural Garden Table" },
    { id = "natural-mum-wreath", source = [Villager Any], name = "Natural Mum Wreath" },
    { id = "natural-square-table", source = [Villager Normal], name = "Natural Square Table" },
    { id = "net", source = [], name = "Net" },
    { id = "nova-light", source = [Other "Celeste"], name = "Nova Light" },
    { id = "ocarina", source = [Other "Nook's Cranny: DIY For Beginners"], name = "Ocarina" },
    { id = "oil-barrel-bathtub", source = [Villager Jock], name = "Oil Barrel Bathtub" },
    { id = "old-fashioned-washtub", source = [Other "Nook's Cranny: DIY For Beginners"], name = "Old-fashioned Washtub" },
    { id = "orange-dress", source = [Villager Lazy], name = "Orange Dress" },
    { id = "orange-end-table", source = [Villager Lazy], name = "Orange End Table" },
    { id = "orange-hat", source = [Villager Lazy], name = "Orange Hat" },
    { id = "orange-rug", source = [Villager Lazy], name = "Orange Rug" },
    { id = "orange-umbrella", source = [Villager Lazy], name = "Orange Umbrella" },
    { id = "orange-wall", source = [Villager Lazy], name = "Orange Wall" },
    { id = "orange-wall-mounted-clock", source = [Villager Lazy], name = "Orange Wall-mounted Clock" },
    { id = "ornament-mobile", source = [Other "Seasonal: festive, from balloons"], name = "Ornament Mobile" },
    { id = "ornament-wreath", source = [Other "Seasonal: festive, from balloons"], name = "Ornament Wreath" },
    { id = "outdoor-bath", source = [Other "Nook Stop"], name = "Outdoor Bath" },
    { id = "outdoor-picnic-set", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Outdoor Picnic Set" },
    { id = "palm-tree-lamp", source = [Villager Snooty], name = "Palm-tree Lamp" },
    { id = "pan-flute", source = [Other "Seasonal: spring, from balloons"], name = "Pan Flute" },
    { id = "pansy-crown", source = [Villager Any], name = "Pansy Crown" },
    { id = "pansy-table", source = [Villager Normal], name = "Pansy Table" },
    { id = "pansy-wand", source = [Other "Celeste"], name = "Pansy Wand" },
    { id = "pansy-wreath", source = [Villager Any], name = "Pansy Wreath" },
    { id = "paw-print-doorplate", source = [Villager Peppy], name = "Paw-print Doorplate" },
    { id = "peach-chair", source = [Villager Normal], name = "Peach Chair" },
    { id = "peach-dress", source = [Villager Normal], name = "Peach Dress" },
    { id = "peach-hat", source = [Villager Normal], name = "Peach Hat" },
    { id = "peach-rug", source = [Villager Normal], name = "Peach Rug" },
    { id = "peach-surprise-box", source = [Villager Normal], name = "Peach Surprise Box" },
    { id = "peach-umbrella", source = [Villager Normal], name = "Peach Umbrella" },
    { id = "peach-wall", source = [Villager Normal], name = "Peach Wall" },
    { id = "pear-bed", source = [Villager Jock], name = "Pear Bed" },
    { id = "pear-dress", source = [Villager Jock], name = "Pear Dress" },
    { id = "pear-hat", source = [Villager Jock], name = "Pear Hat" },
    { id = "pear-rug", source = [Villager Jock], name = "Pear Rug" },
    { id = "pear-umbrella", source = [Villager Jock], name = "Pear Umbrella" },
    { id = "pear-wall", source = [Villager Jock], name = "Pear Wall" },
    { id = "pear-wardrobe", source = [Villager Jock], name = "Pear Wardrobe" },
    { id = "pile-of-leaves", source = [Other "Seasonal: autumn, from balloons"], name = "Pile Of Leaves" },
    { id = "pile-of-zen-cushions", source = [Villager Cranky], name = "Pile Of Zen Cushions" },
    { id = "pine-bonsai-tree", source = [Other "Seasonal: autumn, from balloons"], name = "Pine Bonsai Tree" },
    { id = "pisces-lamp", source = [Other "Celeste"], name = "Pisces Lamp" },
    { id = "pitfall-seed", source = [Villager Jock], name = "Pitfall Seed" },
    { id = "plain-sink", source = [Other "Nook's Cranny: Wildest Dreams DIY"], name = "Plain Sink" },
    { id = "plain-wooden-shop-sign", source = [Villager Jock], name = "Plain Wooden Shop Sign" },
    { id = "pond-stone", source = [Villager Snooty], name = "Pond Stone" },
    { id = "pot", source = [Villager Cranky], name = "Pot" },
    { id = "potted-ivy", source = [Other "Nook's Cranny: Test Your DIY Skills"], name = "Potted Ivy" },
    { id = "pretty-cosmos-wreath", source = [Villager Any], name = "Pretty Cosmos Wreath" },
    { id = "pretty-tulip-wreath", source = [Villager Any], name = "Pretty Tulip Wreath" },
    { id = "purple-hyacinth-crown", source = [Villager Any], name = "Purple Hyacinth Crown" },
    { id = "purple-hyacinth-wreath", source = [Villager Any], name = "Purple Hyacinth Wreath" },
    { id = "purple-pansy-crown", source = [Villager Any], name = "Purple Pansy Crown" },
    { id = "purple-windflower-crown", source = [Villager Any], name = "Purple Windflower Crown" },
    { id = "raccoon-figurine", source = [Villager Cranky], name = "Raccoon Figurine" },
    { id = "recycled-boots", source = [Other "Inspiration: fishing up trash"], name = "Recycled Boots" },
    { id = "recycled-can-thumb-piano", source = [Other "Inspiration: fishing up trash"], name = "Recycled-can Thumb Piano" },
    { id = "red-leaf-pile", source = [Other "Seasonal: autumn, from balloons"], name = "Red-leaf Pile" },
    { id = "ringtoss", source = [Other "Nook's Cranny: Test Your DIY Skills"], name = "Ringtoss" },
    { id = "robot-hero", source = [Other "Nook Stop"], name = "Robot Hero" },
    { id = "rocket", source = [Other "Celeste"], name = "Rocket" },
    { id = "rocking-chair", source = [Other "Nook's Cranny: Test Your DIY Skills"], name = "Rocking Chair" },
    { id = "rocking-horse", source = [Villager Normal], name = "Rocking Horse" },
    { id = "rope-fence", source = [Other "Nook Stop"], name = "Rope Fence" },
    { id = "rose-bed", source = [Villager Smug], name = "Rose Bed" },
    { id = "rose-crown", source = [Villager Any], name = "Rose Crown" },
    { id = "rose-wand", source = [Other "Celeste"], name = "Rose Wand" },
    { id = "rose-wreath", source = [Villager Any], name = "Rose Wreath" },
    { id = "rustic-stone-wall", source = [Villager Snooty], name = "Rustic-stone Wall" },
    { id = "sagittarius-arrow", source = [Other "Celeste"], name = "Sagittarius Arrow" },
    { id = "sakura-wood-flooring", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Sakura-wood Flooring" },
    { id = "sakura-wood-wall", source = [Other "Seasonal: cherry blossoms, from balloons"], name = "Sakura-wood Wall" },
    { id = "sandy-beach-flooring", source = [Villager Jock], name = "Sandy-beach Flooring" },
    { id = "satellite", source = [Other "Celeste"], name = "Satellite" },
    { id = "sauna-heater", source = [Villager Lazy], name = "Sauna Heater" },
    { id = "scarecrow", source = [Villager Cranky], name = "Scarecrow" },
    { id = "scattered-papers", source = [Villager Smug], name = "Scattered Papers" },
    { id = "sci-fi-flooring", source = [Other "Celeste"], name = "Sci-fi Flooring" },
    { id = "sci-fi-wall", source = [Other "Celeste"], name = "Sci-fi Wall" },
    { id = "scorpio-lamp", source = [Other "Celeste"], name = "Scorpio Lamp" },
    { id = "shell-arch", source = [Villager Lazy], name = "Shell Arch" },
    { id = "shell-bed", source = [Villager Peppy], name = "Shell Bed" },
    { id = "shell-fountain", source = [Villager Lazy], name = "Shell Fountain" },
    { id = "shell-lamp", source = [Villager Sisterly], name = "Shell Lamp" },
    { id = "shell-partition", source = [Villager Sisterly], name = "Shell Partition" },
    { id = "shell-rug", source = [Villager Peppy], name = "Shell Rug" },
    { id = "shell-speaker", source = [Villager Sisterly], name = "Shell Speaker" },
    { id = "shell-stool", source = [Villager Sisterly], name = "Shell Stool" },
    { id = "shell-table", source = [Villager Peppy], name = "Shell Table" },
    { id = "shell-wand", source = [Other "Seasonal: summer, from balloons"], name = "Shell Wand" },
    { id = "shell-wreath", source = [Other "Seasonal: summer, from balloons"], name = "Shell Wreath" },
    { id = "shellfish-pochette", source = [Other "Seasonal: summer, from balloons"], name = "Shellfish Pochette" },
    { id = "shovel", source = [], name = "Shovel" },
    { id = "signpost", source = [Villager Lazy], name = "Signpost" },
    { id = "silo", source = [Other "Nook Stop"], name = "Silo" },
    { id = "simple-diy-workbench", source = [Villager Jock], name = "Simple DIY Workbench" },
    { id = "simple-mum-crown", source = [Villager Any], name = "Simple Mum Crown" },
    { id = "simple-well", source = [Other "Nook Stop"], name = "Simple Well" },
    { id = "simple-wooden-fence", source = [Other "Nook Stop"], name = "Simple Wooden Fence" },
    { id = "ski-slope-flooring", source = [Other "Seasonal: winter, from balloons"], name = "Ski-slope Flooring" },
    { id = "ski-slope-wall", source = [Other "Seasonal: winter, from balloons"], name = "Ski-slope Wall" },
    { id = "sky-egg-outfit", source = [Other "Seasonal: bunny day"], name = "Sky-egg Outfit" },
    { id = "sky-egg-shell", source = [Other "Seasonal: bunny day"], name = "Sky-egg Shell" },
    { id = "sky-egg-shoes", source = [Other "Seasonal: bunny day"], name = "Sky-egg Shoes" },
    { id = "sleigh", source = [Villager Cranky], name = "Sleigh" },
    { id = "slingshot", source = [], name = "Slingshot" },
    { id = "small-cardboard-boxes", source = [Villager Peppy], name = "Small Cardboard Boxes" },
    { id = "snazzy-pansy-wreath", source = [Villager Any], name = "Snazzy Pansy Wreath" },
    { id = "snowflake-pochette", source = [Other "Seasonal: winter, from balloons"], name = "Snowflake Pochette" },
    { id = "snowflake-wall", source = [Other "Seasonal: winter, from balloons"], name = "Snowflake Wall" },
    { id = "snowflake-wreath", source = [Other "Seasonal: winter, from balloons"], name = "Snowflake Wreath" },
    { id = "snowperson-head", source = [Other "Seasonal: winter, from balloons"], name = "Snowperson Head" },
    { id = "space-shuttle", source = [Other "Celeste"], name = "Space Shuttle" },
    { id = "spiky-fence", source = [Other "Nook Stop"], name = "Spiky Fence" },
    { id = "stack-of-books", source = [Villager Lazy], name = "Stack Of Books" },
    { id = "stacked-magazines", source = [Villager Peppy], name = "Stacked Magazines" },
    { id = "stacked-wood-wall", source = [Villager Jock], name = "Stacked-wood Wall" },
    { id = "stall", source = [Other "Nook Stop"], name = "Stall" },
    { id = "standard-umbrella-stand", source = [Villager Cranky], name = "Standard Umbrella Stand" },
    { id = "star-clock", source = [Other "Celeste"], name = "Star Clock" },
    { id = "star-head", source = [Other "Celeste"], name = "Star Head" },
    { id = "star-pochette", source = [Other "Celeste"], name = "Star Pochette" },
    { id = "star-wand", source = [Other "Celeste"], name = "Star Wand" },
    { id = "starry-garland", source = [Other "Celeste"], name = "Starry Garland" },
    { id = "starry-wall", source = [Other "Celeste"], name = "Starry Wall" },
    { id = "starry-sands-flooring", source = [Other "Seasonal: summer, from balloons"], name = "Starry-sands Flooring" },
    { id = "starry-sky-wall", source = [Other "Celeste"], name = "Starry-sky Wall" },
    { id = "steamer-basket-set", source = [Other "Seasonal: spring, from balloons"], name = "Steamer-basket Set" },
    { id = "steel-flooring", source = [Villager Smug], name = "Steel Flooring" },
    { id = "steel-frame-wall", source = [Villager Smug], name = "Steel-frame Wall" },
    { id = "stone-arch", source = [Other "Nook Stop"], name = "Stone Arch" },
    { id = "stone-axe", source = [], name = "Stone Axe" },
    { id = "stone-fence", source = [Other "Nook Stop"], name = "Stone Fence" },
    { id = "stone-lion-dog", source = [Villager Smug], name = "Stone Lion-dog" },
    { id = "stone-stool", source = [Other "Nook's Cranny: DIY For Beginners"], name = "Stone Stool" },
    { id = "stone-table", source = [Villager Lazy], name = "Stone Table" },
    { id = "stone-tablet", source = [Other "Nook Stop"], name = "Stone Tablet" },
    { id = "stone-wall", source = [Villager Smug], name = "Stone Wall" },
    { id = "stone-egg-outfit", source = [Other "Seasonal: bunny day"], name = "Stone-egg Outfit" },
    { id = "stone-egg-shell", source = [Other "Seasonal: bunny day"], name = "Stone-egg Shell" },
    { id = "stone-egg-shoes", source = [Other "Seasonal: bunny day"], name = "Stone-egg Shoes" },
    { id = "straw-fence", source = [Other "Nook Stop"], name = "Straw Fence" },
    { id = "straw-umbrella-hat", source = [Villager Smug], name = "Straw Umbrella Hat" },
    { id = "street-piano", source = [Villager Sisterly], name = "Street Piano" },
    { id = "succulent-plant", source = [Other "Inspiration: fishing up trash"], name = "Succulent Plant" },
    { id = "swinging-bench", source = [Other "Nook's Cranny: Test Your DIY Skills"], name = "Swinging Bench" },
    { id = "tabletop-festive-tree", source = [Other "Seasonal: festive, from balloons"], name = "Tabletop Festive Tree" },
    { id = "tall-garden-rock", source = [Villager Snooty], name = "Tall Garden Rock" },
    { id = "tall-lantern", source = [Villager Smug], name = "Tall Lantern" },
    { id = "taurus-bathtub", source = [Other "Celeste"], name = "Taurus Bathtub" },
    { id = "tea-table", source = [Villager Cranky], name = "Tea Table" },
    { id = "terrarium", source = [Villager Normal], name = "Terrarium" },
    { id = "three-tiered-snowperson", source = [Other "Seasonal: winter, from balloons"], name = "Three-tiered Snowperson" },
    { id = "tiki-torch", source = [Villager Cranky], name = "Tiki Torch" },
    { id = "timber-doorplate", source = [Villager Snooty], name = "Timber Doorplate" },
    { id = "tiny-library", source = [Villager Normal], name = "Tiny Library" },
    { id = "tire-stack", source = [Other "Inspiration: fishing up trash"], name = "Tire Stack" },
    { id = "tire-toy", source = [Other "Inspiration: fishing up trash"], name = "Tire Toy" },
    { id = "traditional-balancing-toy", source = [Other "Seasonal: autumn, from balloons"], name = "Traditional Balancing Toy" },
    { id = "traditional-straw-coat", source = [Villager Normal], name = "Traditional Straw Coat" },
    { id = "trash-bags", source = [Other "Inspiration: fishing up trash"], name = "Trash Bags" },
    { id = "tree-branch-wreath", source = [Villager Sisterly], name = "Tree Branch Wreath" },
    { id = "tree-standee", source = [Villager Jock], name = "Tree Standee" },
    { id = "tree-branch-wand", source = [Other "Celeste"], name = "Tree-branch Wand" },
    { id = "trees-bounty-arch", source = [Other "Seasonal: autumn, from balloons"], name = "Tree's Bounty Arch" },
    { id = "trees-bounty-big-tree", source = [Other "Seasonal: autumn, from balloons"], name = "Tree's Bounty Big Tree" },
    { id = "trees-bounty-lamp", source = [Other "Seasonal: autumn, from balloons"], name = "Tree's Bounty Lamp" },
    { id = "trees-bounty-little-tree", source = [Other "Seasonal: autumn, from balloons"], name = "Tree's Bounty Little Tree" },
    { id = "trees-bounty-mobile", source = [Other "Seasonal: autumn, from balloons"], name = "Tree's Bounty Mobile" },
    { id = "trophy-case", source = [Villager Jock], name = "Trophy Case" },
    { id = "tropical-vista", source = [Other "Seasonal: summer, from balloons"], name = "Tropical Vista" },
    { id = "tulip-crown", source = [Villager Any], name = "Tulip Crown" },
    { id = "tulip-surprise-box", source = [Villager Jock], name = "Tulip Surprise Box" },
    { id = "tulip-wand", source = [Other "Celeste"], name = "Tulip Wand" },
    { id = "tulip-wreath", source = [Villager Any], name = "Tulip Wreath" },
    { id = "ukulele", source = [Villager Smug], name = "Ukulele" },
    { id = "underwater-flooring", source = [Other "Seasonal: summer, from balloons"], name = "Underwater Flooring" },
    { id = "underwater-wall", source = [Other "Seasonal: summer, from balloons"], name = "Underwater Wall" },
    { id = "unglazed-dish-set", source = [Villager Snooty], name = "Unglazed Dish Set" },
    { id = "vaulting-pole", source = [], name = "Vaulting Pole" },
    { id = "vertical-board-fence", source = [Other "Nook Stop"], name = "Vertical-board Fence" },
    { id = "virgo-harp", source = [Other "Celeste"], name = "Virgo Harp" },
    { id = "wand", source = [Other "Celeste"], name = "Wand" },
    { id = "water-flooring", source = [Other "Seasonal: summer, from balloons"], name = "Water Flooring" },
    { id = "water-pump", source = [Villager Lazy], name = "Water Pump" },
    { id = "water-egg-outfit", source = [Other "Seasonal: bunny day"], name = "Water-egg Outfit" },
    { id = "water-egg-shell", source = [Other "Seasonal: bunny day"], name = "Water-egg Shell" },
    { id = "water-egg-shoes", source = [Other "Seasonal: bunny day"], name = "Water-egg Shoes" },
    { id = "watering-can", source = [], name = "Watering Can" },
    { id = "wave-breaker", source = [Other "Nook Stop"], name = "Wave Breaker" },
    { id = "western-style-stone", source = [Villager Normal], name = "Western-style Stone" },
    { id = "wild-log-bench", source = [Villager Jock], name = "Wild Log Bench" },
    { id = "wild-wood-wall", source = [Villager Cranky], name = "Wild-wood Wall" },
    { id = "windflower-crown", source = [Villager Any], name = "Windflower Crown" },
    { id = "windflower-fan", source = [Villager Lazy], name = "Windflower Fan" },
    { id = "windflower-wand", source = [Other "Celeste"], name = "Windflower Wand" },
    { id = "windflower-wreath", source = [Villager Any], name = "Windflower Wreath" },
    { id = "wobbling-zipper-toy", source = [Other "Seasonal: bunny day"], name = "Wobbling Zipper Toy" },
    { id = "wood-egg-outfit", source = [Other "Seasonal: bunny day"], name = "Wood-egg Outfit" },
    { id = "wood-egg-shell", source = [Other "Seasonal: bunny day"], name = "Wood-egg Shell" },
    { id = "wood-egg-shoes", source = [Other "Seasonal: bunny day"], name = "Wood-egg Shoes" },
    { id = "wooden-bookshelf", source = [Villager Lazy], name = "Wooden Bookshelf" },
    { id = "wooden-bucket", source = [Villager Smug], name = "Wooden Bucket" },
    { id = "wooden-chair", source = [Villager Snooty], name = "Wooden Chair" },
    { id = "wooden-chest", source = [Villager Lazy], name = "Wooden Chest" },
    { id = "wooden-double-bed", source = [Villager Smug], name = "Wooden Double Bed" },
    { id = "wooden-end-table", source = [Villager Snooty], name = "Wooden End Table" },
    { id = "wooden-fish", source = [Other "Nook's Cranny: Wildest Dreams DIY"], name = "Wooden Fish" },
    { id = "wooden-full-length-mirror", source = [Villager Peppy], name = "Wooden Full-length Mirror" },
    { id = "wooden-low-table", source = [Villager Smug], name = "Wooden Low Table" },
    { id = "wooden-mini-table", source = [Villager Sisterly], name = "Wooden Mini Table" },
    { id = "wooden-simple-bed", source = [Villager Lazy], name = "Wooden Simple Bed" },
    { id = "wooden-stool", source = [Villager Peppy], name = "Wooden Stool" },
    { id = "wooden-table", source = [Villager Sisterly], name = "Wooden Table" },
    { id = "wooden-table-mirror", source = [Villager Sisterly], name = "Wooden Table Mirror" },
    { id = "wooden-toolbox", source = [Villager Normal], name = "Wooden Toolbox" },
    { id = "wooden-wardrobe", source = [], name = "Wooden Wardrobe" },
    { id = "wooden-waste-bin", source = [Villager Sisterly], name = "Wooden Waste Bin" },
    { id = "wooden-block-bed", source = [Villager Normal], name = "Wooden-block Bed" },
    { id = "wooden-block-bench", source = [Villager Sisterly], name = "Wooden-block Bench" },
    { id = "wooden-block-bookshelf", source = [Other "Nook's Cranny: Test Your DIY Skills"], name = "Wooden-block Bookshelf" },
    { id = "wooden-block-chair", source = [Other "Nook's Cranny: Test Your DIY Skills"], name = "Wooden-block Chair" },
    { id = "wooden-block-chest", source = [Villager Normal], name = "Wooden-block Chest" },
    { id = "wooden-block-stereo", source = [], name = "Wooden-block Stereo" },
    { id = "wooden-block-stool", source = [Villager Peppy], name = "Wooden-block Stool" },
    { id = "wooden-block-table", source = [Villager Sisterly], name = "Wooden-block Table" },
    { id = "wooden-block-toy", source = [Other "Nook's Cranny: DIY For Beginners"], name = "Wooden-block Toy" },
    { id = "wooden-block-wall-clock", source = [Villager Peppy], name = "Wooden-block Wall Clock" },
    { id = "wooden-knot-wall", source = [Villager Smug], name = "Wooden-knot Wall" },
    { id = "wooden-mosaic-wall", source = [Villager Normal], name = "Wooden-mosaic Wall" },
    { id = "wooden-plank-sign", source = [Villager Cranky], name = "Wooden-plank Sign" },
    { id = "woodland-wall", source = [Villager Normal], name = "Woodland Wall" },
    { id = "yellow-leaf-pile", source = [Other "Seasonal: autumn, from balloons"], name = "Yellow-leaf Pile" },
    { id = "zen-fence", source = [Other "Nook Stop"], name = "Zen Fence" },
    { id = "zen-style-stone", source = [Villager Lazy], name = "Zen-style Stone" }
  ]