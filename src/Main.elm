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
    { id = "acorn-pochette", source = [], name = "Acorn Pochette" },
    { id = "acoustic-guitar", source = [Villager Smug], name = "Acoustic Guitar" },
    { id = "angled-signpost", source = [Villager Lazy], name = "Angled Signpost" },
    { id = "apple-chair", source = [Villager Sisterly], name = "Apple Chair" },      
    { id = "apple-dress", source = [Villager Sisterly], name = "Apple Dress" },      
    { id = "apple-hat", source = [Villager Sisterly], name = "Apple Hat" },
    { id = "apple-rug", source = [Villager Sisterly], name = "Apple Rug" },
    { id = "apple-umbrella", source = [Villager Sisterly], name = "Apple Umbrella" },
    { id = "apple-wall", source = [Villager Sisterly], name = "Apple Wall" },        
    { id = "aquarius-urn", source = [], name = "Aquarius Urn" },
    { id = "aries-rocking-chair", source = [], name = "Aries Rocking Chair" },       
    { id = "armor-shoes", source = [Villager Cranky], name = "Armor Shoes" },        
    { id = "aroma-pot", source = [Villager Snooty], name = "Aroma Pot" },
    { id = "asteroid", source = [], name = "Asteroid" },
    { id = "astronaut-suit", source = [], name = "Astronaut Suit" },
    { id = "autumn-wall", source = [], name = "Autumn Wall" },
    { id = "axe", source = [], name = "Axe" },
    { id = "backyard-lawn", source = [Villager Peppy], name = "Backyard Lawn" },
    { id = "bamboo-basket", source = [Villager Snooty], name = "Bamboo Basket" },
    { id = "bamboo-bench", source = [Villager Normal], name = "Bamboo Bench" },
    { id = "bamboo-candleholder", source = [Villager Snooty], name = "Bamboo Candleholder" },
    { id = "bamboo-doll", source = [], name = "Bamboo Doll" },
    { id = "bamboo-drum", source = [Villager Jock], name = "Bamboo Drum" },
    { id = "bamboo-floor-lamp", source = [Villager Normal], name = "Bamboo Floor Lamp" },
    { id = "bamboo-flooring", source = [Villager Cranky], name = "Bamboo Flooring" },
    { id = "bamboo-hat", source = [Villager Cranky], name = "Bamboo Hat" },
    { id = "bamboo-lattice-fence", source = [], name = "Bamboo Lattice Fence" },
    { id = "bamboo-lunch-box", source = [Villager Snooty], name = "Bamboo Lunch Box" },
    { id = "bamboo-noodle-slide", source = [], name = "Bamboo Noodle Slide" },
    { id = "bamboo-partition", source = [Villager Cranky], name = "Bamboo Partition" },
    { id = "bamboo-shelf", source = [Villager Snooty], name = "Bamboo Shelf" },
    { id = "bamboo-speaker", source = [Villager Snooty], name = "Bamboo Speaker" },
    { id = "bamboo-sphere", source = [Villager Normal], name = "Bamboo Sphere" },
    { id = "bamboo-stool", source = [Villager Snooty], name = "Bamboo Stool" },
    { id = "bamboo-stopblock", source = [Villager Jock], name = "Bamboo Stopblock" },
    { id = "bamboo-wall", source = [Villager Cranky], name = "Bamboo Wall" },
    { id = "bamboo-wall-decoration", source = [Villager Jock], name = "Bamboo Wall Decoration" },
    { id = "bamboo-wand", source = [], name = "Bamboo Wand" },
    { id = "bamboo-grove-wall", source = [], name = "Bamboo-grove Wall" },
    { id = "bamboo-shoot-lamp", source = [], name = "Bamboo-shoot Lamp" },
    { id = "barbed-wire-fence", source = [], name = "Barbed-wire Fence" },
    { id = "barbell", source = [Villager Jock], name = "Barbell" },
    { id = "barrel", source = [Villager Cranky], name = "Barrel" },
    { id = "basement-flooring", source = [Villager Smug], name = "Basement Flooring" },
    { id = "basket-pack", source = [], name = "Basket Pack" },
    { id = "beekeepers-hive", source = [Villager Jock], name = "Beekeeper's Hive" },
    { id = "big-festive-tree", source = [], name = "Big Festive Tree" },
    { id = "birdbath", source = [Villager Snooty], name = "Birdbath" },
    { id = "birdcage", source = [Villager Sisterly], name = "Birdcage" },
    { id = "birdhouse", source = [Villager Peppy], name = "Birdhouse" },
    { id = "blossom-viewing-lantern", source = [], name = "Blossom-viewing Lantern" },
    { id = "blue-rose-crown", source = [], name = "Blue Rose Crown" },
    { id = "blue-rose-wreath", source = [], name = "Blue Rose Wreath" },
    { id = "bone-doorplate", source = [Villager Lazy], name = "Bone Doorplate" },
    { id = "bonfire", source = [Villager Cranky], name = "Bonfire" },
    { id = "bonsai-shelf", source = [Villager Cranky], name = "Bonsai Shelf" },
    { id = "boomerang", source = [Villager Lazy], name = "Boomerang" },
    { id = "brick-fence", source = [], name = "Brick Fence" },
    { id = "brick-oven", source = [], name = "Brick Oven" },
    { id = "brick-well", source = [], name = "Brick Well" },
    { id = "brown-herringbone-wall", source = [Villager Sisterly], name = "Brown Herringbone Wall" },
    { id = "bunny-day-arch", source = [], name = "Bunny Day Arch" },
    { id = "bunny-day-bag", source = [], name = "Bunny Day Bag" },
    { id = "bunny-day-bed", source = [], name = "Bunny Day Bed" },
    { id = "bunny-day-crown", source = [], name = "Bunny Day Crown" },
    { id = "bunny-day-fence", source = [], name = "Bunny Day Fence" },
    { id = "bunny-day-festive-balloons", source = [], name = "Bunny Day Festive Balloons" },
    { id = "bunny-day-flooring", source = [], name = "Bunny Day Flooring" },
    { id = "bunny-day-glowy-garland", source = [], name = "Bunny Day Glowy Garland" },
    { id = "bunny-day-lamp", source = [], name = "Bunny Day Lamp" },
    { id = "bunny-day-merry-balloons", source = [], name = "Bunny Day Merry Balloons" },
    { id = "bunny-day-rug", source = [], name = "Bunny Day Rug" },
    { id = "bunny-day-stool", source = [], name = "Bunny Day Stool" },
    { id = "bunny-day-table", source = [], name = "Bunny Day Table" },
    { id = "bunny-day-vanity", source = [], name = "Bunny Day Vanity" },
    { id = "bunny-day-wall", source = [], name = "Bunny Day Wall" },
    { id = "bunny-day-wall-clock", source = [], name = "Bunny Day Wall Clock" },
    { id = "bunny-day-wand", source = [], name = "Bunny Day Wand" },
    { id = "bunny-day-wardrobe", source = [], name = "Bunny Day Wardrobe" },
    { id = "bunny-day-wreath", source = [], name = "Bunny Day Wreath" },
    { id = "butter-churn", source = [Villager Snooty], name = "Butter Churn" },
    { id = "cabin-wall", source = [Villager Peppy], name = "Cabin Wall" },
    { id = "campfire", source = [], name = "Campfire" },
    { id = "cancer-table", source = [], name = "Cancer Table" },
    { id = "capricorn-ornament", source = [], name = "Capricorn Ornament" },
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
    { id = "cherry-blossom-bonsai", source = [], name = "Cherry-blossom Bonsai" },
    { id = "cherry-blossom-branches", source = [], name = "Cherry-blossom Branches" },
    { id = "cherry-blossom-clock", source = [], name = "Cherry-blossom Clock" },
    { id = "cherry-blossom-flooring", source = [], name = "Cherry-blossom Flooring" },
    { id = "cherry-blossom-pochette", source = [], name = "Cherry-blossom Pochette" },
    { id = "cherry-blossom-pond-stone", source = [], name = "Cherry-blossom Pond Stone" },
    { id = "cherry-blossom-umbrella", source = [], name = "Cherry-blossom Umbrella" },
    { id = "cherry-blossom-wand", source = [], name = "Cherry-blossom Wand" },
    { id = "cherry-blossom-petal-pile", source = [], name = "Cherry-blossom-petal Pile" },
    { id = "cherry-blossom-trees-wall", source = [], name = "Cherry-blossom-trees Wall" },
    { id = "chic-cosmos-wreath", source = [], name = "Chic Cosmos Wreath" },
    { id = "chic-mum-crown", source = [], name = "Chic Mum Crown" },
    { id = "chic-rose-crown", source = [], name = "Chic Rose Crown" },
    { id = "chic-tulip-crown", source = [], name = "Chic Tulip Crown" },
    { id = "chic-windflower-wreath", source = [], name = "Chic Windflower Wreath" },
    { id = "chocolate-herringbone-wall", source = [Villager Smug], name = "Chocolate Herringbone Wall" },
    { id = "clackercart", source = [Villager Lazy], name = "Clackercart" },
    { id = "classic-pitcher", source = [Villager Snooty], name = "Classic Pitcher" },
    { id = "classic-library-wall", source = [Villager Normal], name = "Classic-library Wall" },
    { id = "clothesline", source = [Villager Cranky], name = "Clothesline" },
    { id = "coconut-juice", source = [Villager Snooty], name = "Coconut Juice" },
    { id = "coconut-wall-planter", source = [Villager Snooty], name = "Coconut Wall Planter" },
    { id = "colored-leaves-flooring", source = [], name = "Colored-leaves Flooring" },
    { id = "cool-hyacinth-crown", source = [], name = "Cool Hyacinth Crown" },
    { id = "cool-hyacinth-wreath", source = [], name = "Cool Hyacinth Wreath" },
    { id = "cool-pansy-crown", source = [], name = "Cool Pansy Crown" },
    { id = "cool-pansy-wreath", source = [], name = "Cool Pansy Wreath" },
    { id = "cool-windflower-crown", source = [], name = "Cool Windflower Crown" },
    { id = "cool-windflower-wreath", source = [], name = "Cool Windflower Wreath" },
    { id = "corral-fence", source = [], name = "Corral Fence" },
    { id = "cosmos-crown", source = [], name = "Cosmos Crown" },
    { id = "cosmos-shower", source = [Villager Snooty], name = "Cosmos Shower" },
    { id = "cosmos-wand", source = [], name = "Cosmos Wand" },
    { id = "cosmos-wreath", source = [], name = "Cosmos Wreath" },
    { id = "country-fence", source = [], name = "Country Fence" },
    { id = "crescent-moon-chair", source = [], name = "Crescent-moon Chair" },
    { id = "crest-doorplate", source = [Villager Smug], name = "Crest Doorplate" },
    { id = "crewed-spaceship", source = [], name = "Crewed Spaceship" },
    { id = "cute-lily-crown", source = [], name = "Cute Lily Crown" },
    { id = "cute-rose-crown", source = [], name = "Cute Rose Crown" },
    { id = "cutting-board", source = [Villager Normal], name = "Cutting Board" },
    { id = "dark-bamboo-rug", source = [Villager Cranky], name = "Dark Bamboo Rug" },
    { id = "dark-cosmos-crown", source = [], name = "Dark Cosmos Crown" },
    { id = "dark-lily-crown", source = [], name = "Dark Lily Crown" },
    { id = "dark-lily-wreath", source = [], name = "Dark Lily Wreath" },
    { id = "dark-rose-wreath", source = [], name = "Dark Rose Wreath" },
    { id = "dark-tulip-crown", source = [], name = "Dark Tulip Crown" },
    { id = "dark-tulip-wreath", source = [], name = "Dark Tulip Wreath" },
    { id = "dark-wooden-mosaic-wall", source = [Villager Sisterly], name = "Dark Wooden-mosaic Wall" },
    { id = "decoy-duck", source = [Villager Smug], name = "Decoy Duck" },
    { id = "deer-decoration", source = [Villager Lazy], name = "Deer Decoration" },
    { id = "deer-scare", source = [Villager Cranky], name = "Deer Scare" },
    { id = "destinations-signpost", source = [], name = "Destinations Signpost" },
    { id = "diy-workbench", source = [Villager Sisterly], name = "Diy Workbench" },
    { id = "document-stack", source = [Villager Smug], name = "Document Stack" },
    { id = "doghouse", source = [Villager Jock], name = "Doghouse" },
    { id = "drinking-fountain", source = [], name = "Drinking Fountain" },
    { id = "earth-egg-outfit", source = [], name = "Earth-egg Outfit" },
    { id = "earth-egg-shell", source = [], name = "Earth-egg Shell" },
    { id = "earth-egg-shoes", source = [], name = "Earth-egg Shoes" },
    { id = "egg-party-dress", source = [], name = "Egg Party Dress" },
    { id = "egg-party-hat", source = [], name = "Egg Party Hat" },
    { id = "fancy-lily-wreath", source = [], name = "Fancy Lily Wreath" },
    { id = "fancy-mum-wreath", source = [], name = "Fancy Mum Wreath" },
    { id = "fancy-rose-wreath", source = [], name = "Fancy Rose Wreath" },
    { id = "festive-top-set", source = [], name = "Festive Top Set" },
    { id = "festive-tree", source = [], name = "Festive Tree" },
    { id = "firewood", source = [Villager Jock], name = "Firewood" },
    { id = "fish-bait", source = [], name = "Fish Bait" },
    { id = "fishing-rod", source = [], name = "Fishing Rod" },
    { id = "flat-garden-rock", source = [Villager Snooty], name = "Flat Garden Rock" },
    { id = "flimsy-axe", source = [], name = "Flimsy Axe" },
    { id = "flimsy-fishing-rod", source = [], name = "Flimsy Fishing Rod" },
    { id = "flimsy-net", source = [], name = "Flimsy Net" },
    { id = "flimsy-shovel", source = [], name = "Flimsy Shovel" },
    { id = "flimsy-watering-can", source = [], name = "Flimsy Watering Can" },
    { id = "floral-swag", source = [Villager Normal], name = "Floral Swag" },
    { id = "flower-stand", source = [Villager Sisterly], name = "Flower Stand" },
    { id = "flying-saucer", source = [], name = "Flying Saucer" },
    { id = "forest-flooring", source = [], name = "Forest Flooring" },
    { id = "forest-wall", source = [], name = "Forest Wall" },
    { id = "fossil-doorplate", source = [Villager Jock], name = "Fossil Doorplate" },
    { id = "fountain", source = [], name = "Fountain" },
    { id = "frozen-arch", source = [], name = "Frozen Arch" },
    { id = "frozen-bed", source = [], name = "Frozen Bed" },
    { id = "frozen-chair", source = [], name = "Frozen Chair" },
    { id = "frozen-counter", source = [], name = "Frozen Counter" },
    { id = "frozen-partition", source = [], name = "Frozen Partition" },
    { id = "frozen-pillar", source = [], name = "Frozen Pillar" },
    { id = "frozen-sculpture", source = [], name = "Frozen Sculpture" },
    { id = "frozen-table", source = [], name = "Frozen Table" },
    { id = "frozen-tree", source = [], name = "Frozen Tree" },
    { id = "frozen-treat-set", source = [], name = "Frozen-treat Set" },
    { id = "fruit-basket", source = [Villager Cranky], name = "Fruit Basket" },
    { id = "fruit-wreath", source = [Villager Cranky], name = "Fruit Wreath" },
    { id = "frying-pan", source = [], name = "Frying Pan" },
    { id = "galaxy-flooring", source = [], name = "Galaxy Flooring" },
    { id = "garbage-heap-flooring", source = [], name = "Garbage-heap Flooring" },
    { id = "garbage-heap-wall", source = [], name = "Garbage-heap Wall" },
    { id = "garden-bench", source = [Villager Snooty], name = "Garden Bench" },
    { id = "garden-rock", source = [Villager Lazy], name = "Garden Rock" },
    { id = "garden-wagon", source = [Villager Peppy], name = "Garden Wagon" },
    { id = "gemini-closet", source = [], name = "Gemini Closet" },
    { id = "giant-teddy-bear", source = [Villager Peppy], name = "Giant Teddy Bear" },
    { id = "gold-armor", source = [Villager Smug], name = "Gold Armor" },
    { id = "gold-bars", source = [Villager Snooty], name = "Gold Bars" },
    { id = "gold-helmet", source = [Villager Smug], name = "Gold Helmet" },
    { id = "gold-rose-crown", source = [], name = "Gold Rose Crown" },
    { id = "gold-rose-wreath", source = [], name = "Gold Rose Wreath" },
    { id = "gold-screen-wall", source = [], name = "Gold Screen Wall" },
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
    { id = "golden-wand", source = [], name = "Golden Wand" },
    { id = "golden-watering-can", source = [], name = "Golden Watering Can" },
    { id = "gong", source = [Villager Cranky], name = "Gong" },
    { id = "grass-skirt", source = [Villager Normal], name = "Grass Skirt" },
    { id = "grass-standee", source = [Villager Normal], name = "Grass Standee" },
    { id = "green-grass-skirt", source = [Villager Peppy], name = "Green Grass Skirt" },
    { id = "green-leaf-pile", source = [], name = "Green-leaf Pile" },
    { id = "hanging-terrarium", source = [Villager Peppy], name = "Hanging Terrarium" },
    { id = "hay-bed", source = [], name = "Hay Bed" },
    { id = "hearth", source = [], name = "Hearth" },
    { id = "hedge", source = [], name = "Hedge" },
    { id = "hedge-standee", source = [Villager Normal], name = "Hedge Standee" },
    { id = "holiday-candle", source = [], name = "Holiday Candle" },
    { id = "honeycomb-flooring", source = [Villager Jock], name = "Honeycomb Flooring" },
    { id = "honeycomb-wall", source = [Villager Jock], name = "Honeycomb Wall" },
    { id = "hyacinth-crown", source = [], name = "Hyacinth Crown" },
    { id = "hyacinth-lamp", source = [Villager Sisterly], name = "Hyacinth Lamp" },
    { id = "hyacinth-wand", source = [], name = "Hyacinth Wand" },
    { id = "hyacinth-wreath", source = [], name = "Hyacinth Wreath" },
    { id = "ice-flooring", source = [], name = "Ice Flooring" },
    { id = "ice-wall", source = [], name = "Ice Wall" },
    { id = "ice-wand", source = [], name = "Ice Wand" },
    { id = "iceberg-flooring", source = [], name = "Iceberg Flooring" },
    { id = "iceberg-wall", source = [], name = "Iceberg Wall" },
    { id = "illuminated-present", source = [], name = "Illuminated Present" },
    { id = "illuminated-reindeer", source = [], name = "Illuminated Reindeer" },
    { id = "illuminated-snowflakes", source = [], name = "Illuminated Snowflakes" },
    { id = "illuminated-tree", source = [], name = "Illuminated Tree" },
    { id = "imperial-fence", source = [], name = "Imperial Fence" },
    { id = "infused-water-dispenser", source = [Villager Cranky], name = "Infused-water Dispenser" },
    { id = "iron-armor", source = [Villager Cranky], name = "Iron Armor" },
    { id = "iron-closet", source = [Villager Sisterly], name = "Iron Closet" },
    { id = "iron-doorplate", source = [Villager Sisterly], name = "Iron Doorplate" },
    { id = "iron-fence", source = [], name = "Iron Fence" },
    { id = "iron-frame", source = [Villager Jock], name = "Iron Frame" },
    { id = "iron-garden-bench", source = [Villager Sisterly], name = "Iron Garden Bench" },
    { id = "iron-garden-chair", source = [Villager Sisterly], name = "Iron Garden Chair" },
    { id = "iron-garden-table", source = [Villager Sisterly], name = "Iron Garden Table" },
    { id = "iron-hanger-stand", source = [Villager Cranky], name = "Iron Hanger Stand" },
    { id = "iron-shelf", source = [Villager Sisterly], name = "Iron Shelf" },
    { id = "iron-wall-lamp", source = [], name = "Iron Wall Lamp" },
    { id = "iron-wall-rack", source = [Villager Smug], name = "Iron Wall Rack" },
    { id = "iron-wand", source = [], name = "Iron Wand" },
    { id = "iron-worktable", source = [Villager Sisterly], name = "Iron Worktable" },
    { id = "iron-and-stone-fence", source = [], name = "Iron-and-stone Fence" },
    { id = "ironwood-bed", source = [Villager Smug], name = "Ironwood Bed" },
    { id = "ironwood-cart", source = [Villager Smug], name = "Ironwood Cart" },
    { id = "ironwood-chair", source = [Villager Smug], name = "Ironwood Chair" },
    { id = "ironwood-clock", source = [Villager Smug], name = "Ironwood Clock" },
    { id = "ironwood-cupboard", source = [Villager Snooty], name = "Ironwood Cupboard" },
    { id = "ironwood-diy-workbench", source = [Villager Cranky], name = "Ironwood Diy Workbench" },
    { id = "ironwood-dresser", source = [Villager Snooty], name = "Ironwood Dresser" },
    { id = "ironwood-kitchenette", source = [], name = "Ironwood Kitchenette" },
    { id = "ironwood-low-table", source = [Villager Snooty], name = "Ironwood Low Table" },
    { id = "ironwood-table", source = [Villager Cranky], name = "Ironwood Table" },
    { id = "jail-bars", source = [Villager Cranky], name = "Jail Bars" },
    { id = "jingle-wall", source = [], name = "Jingle Wall" },
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
    { id = "lattice-fence", source = [], name = "Lattice Fence" },
    { id = "leaf", source = [Villager Jock], name = "Leaf" },
    { id = "leaf-campfire", source = [], name = "Leaf Campfire" },
    { id = "leaf-mask", source = [Villager Peppy], name = "Leaf Mask" },
    { id = "leaf-stool", source = [], name = "Leaf Stool" },
    { id = "leaf-umbrella", source = [Villager Sisterly], name = "Leaf Umbrella" },
    { id = "leaf-egg-outfit", source = [], name = "Leaf-egg Outfit" },
    { id = "leaf-egg-shell", source = [], name = "Leaf-egg Shell" },
    { id = "leaf-egg-shoes", source = [], name = "Leaf-egg Shoes" },
    { id = "leo-sculpture", source = [], name = "Leo Sculpture" },
    { id = "libra-scale", source = [], name = "Libra Scale" },
    { id = "light-bamboo-rug", source = [], name = "Light Bamboo Rug" },
    { id = "lily-crown", source = [], name = "Lily Crown" },
    { id = "lily-record-player", source = [Villager Cranky], name = "Lily Record Player" },
    { id = "lily-wand", source = [], name = "Lily Wand" },
    { id = "lily-wreath", source = [], name = "Lily Wreath" },
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
    { id = "lovely-cosmos-crown", source = [], name = "Lovely Cosmos Crown" },
    { id = "lucky-gold-cat", source = [Villager Snooty], name = "Lucky Gold Cat" },
    { id = "lunar-lander", source = [], name = "Lunar Lander" },
    { id = "lunar-rover", source = [], name = "Lunar Rover" },
    { id = "lunar-surface", source = [], name = "Lunar Surface" },
    { id = "magazine-rack", source = [Villager Peppy], name = "Magazine Rack" },
    { id = "manga-library-wall", source = [Villager Peppy], name = "Manga-library Wall" },
    { id = "manhole-cover", source = [], name = "Manhole Cover" },
    { id = "maple-leaf-pochette", source = [], name = "Maple-leaf Pochette" },
    { id = "maple-leaf-pond-stone", source = [], name = "Maple-leaf Pond Stone" },
    { id = "maple-leaf-umbrella", source = [], name = "Maple-leaf Umbrella" },
    { id = "matryoshka", source = [Villager Lazy], name = "Matryoshka" },
    { id = "medicine", source = [], name = "Medicine" },
    { id = "medium-cardboard-boxes", source = [Villager Lazy], name = "Medium Cardboard Boxes" },
    { id = "mini-diy-workbench", source = [], name = "Mini DIY Workbench" },
    { id = "modeling-clay", source = [Villager Cranky], name = "Modeling Clay" },
    { id = "modern-wood-wall", source = [Villager Snooty], name = "Modern Wood Wall" },
    { id = "money-flooring", source = [Villager Snooty], name = "Money Flooring" },
    { id = "moon", source = [], name = "Moon" },
    { id = "mossy-garden-rock", source = [Villager Lazy], name = "Mossy Garden Rock" },
    { id = "mountain-standee", source = [Villager Jock], name = "Mountain Standee" },
    { id = "mum-crown", source = [], name = "Mum Crown" },
    { id = "mum-cushion", source = [Villager Peppy], name = "Mum Cushion" },
    { id = "mum-wreath", source = [], name = "Mum Wreath" },
    { id = "mums-wand", source = [], name = "Mums Wand" },
    { id = "mush-lamp", source = [], name = "Mush Lamp" },
    { id = "mush-log", source = [], name = "Mush Log" },
    { id = "mush-low-stool", source = [], name = "Mush Low Stool" },
    { id = "mush-parasol", source = [], name = "Mush Parasol" },
    { id = "mush-partition", source = [], name = "Mush Partition" },
    { id = "mush-table", source = [], name = "Mush Table" },
    { id = "mush-umbrella", source = [], name = "Mush Umbrella" },
    { id = "mush-wall", source = [], name = "Mush Wall" },
    { id = "mushroom-wand", source = [], name = "Mushroom Wand" },
    { id = "mushroom-wreath", source = [], name = "Mushroom Wreath" },
    { id = "music-stand", source = [Villager Lazy], name = "Music Stand" },
    { id = "natural-garden-chair", source = [Villager Peppy], name = "Natural Garden Chair" },
    { id = "natural-garden-table", source = [Villager Normal], name = "Natural Garden Table" },
    { id = "natural-mum-wreath", source = [], name = "Natural Mum Wreath" },
    { id = "natural-square-table", source = [Villager Normal], name = "Natural Square Table" },
    { id = "net", source = [], name = "Net" },
    { id = "nova-light", source = [], name = "Nova Light" },
    { id = "ocarina", source = [], name = "Ocarina" },
    { id = "oil-barrel-bathtub", source = [], name = "Oil Barrel Bathtub" },
    { id = "old-fashioned-washtub", source = [], name = "Old-fashioned Washtub" },
    { id = "orange-dress", source = [Villager Lazy], name = "Orange Dress" },
    { id = "orange-end-table", source = [Villager Lazy], name = "Orange End Table" },
    { id = "orange-hat", source = [Villager Lazy], name = "Orange Hat" },
    { id = "orange-rug", source = [Villager Lazy], name = "Orange Rug" },
    { id = "orange-umbrella", source = [Villager Lazy], name = "Orange Umbrella" },
    { id = "orange-wall", source = [Villager Lazy], name = "Orange Wall" },
    { id = "orange-wall-mounted-clock", source = [Villager Lazy], name = "Orange Wall-mounted Clock" },
    { id = "ornament-mobile", source = [], name = "Ornament Mobile" },
    { id = "ornament-wreath", source = [], name = "Ornament Wreath" },
    { id = "outdoor-bath", source = [], name = "Outdoor Bath" },
    { id = "outdoor-picnic-set", source = [], name = "Outdoor Picnic Set" },
    { id = "palm-tree-lamp", source = [Villager Snooty], name = "Palm-tree Lamp" },
    { id = "pan-flute", source = [], name = "Pan Flute" },
    { id = "pansy-crown", source = [], name = "Pansy Crown" },
    { id = "pansy-table", source = [Villager Normal], name = "Pansy Table" },
    { id = "pansy-wand", source = [], name = "Pansy Wand" },
    { id = "pansy-wreath", source = [], name = "Pansy Wreath" },
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
    { id = "pile-of-leaves", source = [], name = "Pile Of Leaves" },
    { id = "pile-of-zen-cushions", source = [Villager Cranky], name = "Pile Of Zen Cushions" },
    { id = "pine-bonsai-tree", source = [], name = "Pine Bonsai Tree" },
    { id = "pisces-lamp", source = [], name = "Pisces Lamp" },
    { id = "pitfall-seed", source = [Villager Jock], name = "Pitfall Seed" },
    { id = "plain-sink", source = [], name = "Plain Sink" },
    { id = "plain-wooden-shop-sign", source = [Villager Jock], name = "Plain Wooden Shop Sign" },
    { id = "pond-stone", source = [Villager Snooty], name = "Pond Stone" },
    { id = "pot", source = [Villager Cranky], name = "Pot" },
    { id = "potted-ivy", source = [], name = "Potted Ivy" },
    { id = "pretty-cosmos-wreath", source = [], name = "Pretty Cosmos Wreath" },
    { id = "pretty-tulip-wreath", source = [], name = "Pretty Tulip Wreath" },
    { id = "purple-hyacinth-crown", source = [], name = "Purple Hyacinth Crown" },
    { id = "purple-hyacinth-wreath", source = [], name = "Purple Hyacinth Wreath" },
    { id = "purple-pansy-crown", source = [], name = "Purple Pansy Crown" },
    { id = "purple-windflower-crown", source = [], name = "Purple Windflower Crown" },
    { id = "raccoon-figurine", source = [Villager Cranky], name = "Raccoon Figurine" },
    { id = "recycled-boots", source = [], name = "Recycled Boots" },
    { id = "recycled-can-thumb-piano", source = [], name = "Recycled-can Thumb Piano" },
    { id = "red-leaf-pile", source = [], name = "Red-leaf Pile" },
    { id = "ringtoss", source = [], name = "Ringtoss" },
    { id = "robot-hero", source = [], name = "Robot Hero" },
    { id = "rocket", source = [], name = "Rocket" },
    { id = "rocking-chair", source = [], name = "Rocking Chair" },
    { id = "rocking-horse", source = [Villager Normal], name = "Rocking Horse" },
    { id = "rope-fence", source = [], name = "Rope Fence" },
    { id = "rose-bed", source = [Villager Smug], name = "Rose Bed" },
    { id = "rose-crown", source = [], name = "Rose Crown" },
    { id = "rose-wand", source = [], name = "Rose Wand" },
    { id = "rose-wreath", source = [], name = "Rose Wreath" },
    { id = "rustic-stone-wall", source = [Villager Snooty], name = "Rustic-stone Wall" },
    { id = "sagittarius-arrow", source = [], name = "Sagittarius Arrow" },
    { id = "sakura-wood-flooring", source = [], name = "Sakura-wood Flooring" },
    { id = "sakura-wood-wall", source = [], name = "Sakura-wood Wall" },
    { id = "sandy-beach-flooring", source = [Villager Jock], name = "Sandy-beach Flooring" },
    { id = "satellite", source = [], name = "Satellite" },
    { id = "sauna-heater", source = [Villager Lazy], name = "Sauna Heater" },
    { id = "scarecrow", source = [Villager Cranky], name = "Scarecrow" },
    { id = "scattered-papers", source = [Villager Smug], name = "Scattered Papers" },
    { id = "sci-fi-flooring", source = [], name = "Sci-fi Flooring" },
    { id = "sci-fi-wall", source = [], name = "Sci-fi Wall" },
    { id = "scorpio-lamp", source = [], name = "Scorpio Lamp" },
    { id = "shell-arch", source = [Villager Lazy], name = "Shell Arch" },
    { id = "shell-bed", source = [Villager Peppy], name = "Shell Bed" },
    { id = "shell-fountain", source = [Villager Lazy], name = "Shell Fountain" },
    { id = "shell-lamp", source = [Villager Sisterly], name = "Shell Lamp" },
    { id = "shell-partition", source = [Villager Sisterly], name = "Shell Partition" },
    { id = "shell-rug", source = [Villager Peppy], name = "Shell Rug" },
    { id = "shell-speaker", source = [Villager Sisterly], name = "Shell Speaker" },
    { id = "shell-stool", source = [Villager Sisterly], name = "Shell Stool" },
    { id = "shell-table", source = [Villager Peppy], name = "Shell Table" },
    { id = "shell-wand", source = [], name = "Shell Wand" },
    { id = "shell-wreath", source = [], name = "Shell Wreath" },
    { id = "shellfish-pochette", source = [], name = "Shellfish Pochette" },
    { id = "shovel", source = [], name = "Shovel" },
    { id = "signpost", source = [Villager Lazy], name = "Signpost" },
    { id = "silo", source = [], name = "Silo" },
    { id = "simple-diy-workbench", source = [Villager Jock], name = "Simple DIY Workbench" },
    { id = "simple-mum-crown", source = [], name = "Simple Mum Crown" },
    { id = "simple-well", source = [], name = "Simple Well" },
    { id = "simple-wooden-fence", source = [], name = "Simple Wooden Fence" },
    { id = "ski-slope-flooring", source = [], name = "Ski-slope Flooring" },
    { id = "ski-slope-wall", source = [], name = "Ski-slope Wall" },
    { id = "sky-egg-outfit", source = [], name = "Sky-egg Outfit" },
    { id = "sky-egg-shell", source = [], name = "Sky-egg Shell" },
    { id = "sky-egg-shoes", source = [], name = "Sky-egg Shoes" },
    { id = "sleigh", source = [Villager Cranky], name = "Sleigh" },
    { id = "slingshot", source = [], name = "Slingshot" },
    { id = "small-cardboard-boxes", source = [Villager Peppy], name = "Small Cardboard Boxes" },
    { id = "snazzy-pansy-wreath", source = [], name = "Snazzy Pansy Wreath" },
    { id = "snowflake-pochette", source = [], name = "Snowflake Pochette" },
    { id = "snowflake-wall", source = [], name = "Snowflake Wall" },
    { id = "snowflake-wreath", source = [], name = "Snowflake Wreath" },
    { id = "snowperson-head", source = [], name = "Snowperson Head" },
    { id = "space-shuttle", source = [], name = "Space Shuttle" },
    { id = "spiky-fence", source = [], name = "Spiky Fence" },
    { id = "stack-of-books", source = [Villager Lazy], name = "Stack Of Books" },
    { id = "stacked-magazines", source = [Villager Peppy], name = "Stacked Magazines" },
    { id = "stacked-wood-wall", source = [Villager Jock], name = "Stacked-wood Wall" },
    { id = "stall", source = [], name = "Stall" },
    { id = "standard-umbrella-stand", source = [Villager Cranky], name = "Standard Umbrella Stand" },
    { id = "star-clock", source = [], name = "Star Clock" },
    { id = "star-head", source = [], name = "Star Head" },
    { id = "star-pochette", source = [], name = "Star Pochette" },
    { id = "star-wand", source = [], name = "Star Wand" },
    { id = "starry-garland", source = [], name = "Starry Garland" },
    { id = "starry-wall", source = [], name = "Starry Wall" },
    { id = "starry-sands-flooring", source = [], name = "Starry-sands Flooring" },
    { id = "starry-sky-wall", source = [], name = "Starry-sky Wall" },
    { id = "steamer-basket-set", source = [], name = "Steamer-basket Set" },
    { id = "steel-flooring", source = [Villager Smug], name = "Steel Flooring" },
    { id = "steel-frame-wall", source = [Villager Smug], name = "Steel-frame Wall" },
    { id = "stone-arch", source = [], name = "Stone Arch" },
    { id = "stone-axe", source = [], name = "Stone Axe" },
    { id = "stone-fence", source = [], name = "Stone Fence" },
    { id = "stone-lion-dog", source = [Villager Smug], name = "Stone Lion-dog" },
    { id = "stone-stool", source = [], name = "Stone Stool" },
    { id = "stone-table", source = [Villager Lazy], name = "Stone Table" },
    { id = "stone-tablet", source = [], name = "Stone Tablet" },
    { id = "stone-wall", source = [Villager Smug], name = "Stone Wall" },
    { id = "stone-egg-outfit", source = [], name = "Stone-egg Outfit" },
    { id = "stone-egg-shell", source = [], name = "Stone-egg Shell" },
    { id = "stone-egg-shoes", source = [], name = "Stone-egg Shoes" },
    { id = "straw-fence", source = [], name = "Straw Fence" },
    { id = "straw-umbrella-hat", source = [Villager Smug], name = "Straw Umbrella Hat" },
    { id = "street-piano", source = [Villager Sisterly], name = "Street Piano" },
    { id = "succulent-plant", source = [], name = "Succulent Plant" },
    { id = "swinging-bench", source = [], name = "Swinging Bench" },
    { id = "tabletop-festive-tree", source = [], name = "Tabletop Festive Tree" },
    { id = "tall-garden-rock", source = [Villager Snooty], name = "Tall Garden Rock" },
    { id = "tall-lantern", source = [Villager Smug], name = "Tall Lantern" },
    { id = "taurus-bathtub", source = [], name = "Taurus Bathtub" },
    { id = "tea-table", source = [Villager Cranky], name = "Tea Table" },
    { id = "terrarium", source = [Villager Normal], name = "Terrarium" },
    { id = "three-tiered-snowperson", source = [], name = "Three-tiered Snowperson" },
    { id = "tiki-torch", source = [Villager Cranky], name = "Tiki Torch" },
    { id = "timber-doorplate", source = [Villager Snooty], name = "Timber Doorplate" },
    { id = "tiny-library", source = [Villager Normal], name = "Tiny Library" },
    { id = "tire-stack", source = [], name = "Tire Stack" },
    { id = "tire-toy", source = [], name = "Tire Toy" },
    { id = "traditional-balancing-toy", source = [], name = "Traditional Balancing Toy" },
    { id = "traditional-straw-coat", source = [Villager Normal], name = "Traditional Straw Coat" },
    { id = "trash-bags", source = [], name = "Trash Bags" },
    { id = "tree-branch-wreath", source = [Villager Sisterly], name = "Tree Branch Wreath" },
    { id = "tree-standee", source = [Villager Jock], name = "Tree Standee" },
    { id = "tree-branch-wand", source = [], name = "Tree-branch Wand" },
    { id = "trees-bounty-arch", source = [], name = "Tree's Bounty Arch" },
    { id = "trees-bounty-big-tree", source = [], name = "Tree's Bounty Big Tree" },
    { id = "trees-bounty-lamp", source = [], name = "Tree's Bounty Lamp" },
    { id = "trees-bounty-little-tree", source = [], name = "Tree's Bounty Little Tree" },
    { id = "trees-bounty-mobile", source = [], name = "Tree's Bounty Mobile" },
    { id = "trophy-case", source = [Villager Jock], name = "Trophy Case" },
    { id = "tropical-vista", source = [], name = "Tropical Vista" },
    { id = "tulip-crown", source = [], name = "Tulip Crown" },
    { id = "tulip-surprise-box", source = [Villager Jock], name = "Tulip Surprise Box" },
    { id = "tulip-wand", source = [], name = "Tulip Wand" },
    { id = "tulip-wreath", source = [], name = "Tulip Wreath" },
    { id = "ukulele", source = [Villager Smug], name = "Ukulele" },
    { id = "underwater-flooring", source = [], name = "Underwater Flooring" },
    { id = "underwater-wall", source = [], name = "Underwater Wall" },
    { id = "unglazed-dish-set", source = [Villager Snooty], name = "Unglazed Dish Set" },
    { id = "vaulting-pole", source = [], name = "Vaulting Pole" },
    { id = "vertical-board-fence", source = [], name = "Vertical-board Fence" },
    { id = "virgo-harp", source = [], name = "Virgo Harp" },
    { id = "wand", source = [], name = "Wand" },
    { id = "water-flooring", source = [], name = "Water Flooring" },
    { id = "water-pump", source = [Villager Lazy], name = "Water Pump" },
    { id = "water-egg-outfit", source = [], name = "Water-egg Outfit" },
    { id = "water-egg-shell", source = [], name = "Water-egg Shell" },
    { id = "water-egg-shoes", source = [], name = "Water-egg Shoes" },
    { id = "watering-can", source = [], name = "Watering Can" },
    { id = "wave-breaker", source = [], name = "Wave Breaker" },
    { id = "western-style-stone", source = [Villager Normal], name = "Western-style Stone" },
    { id = "wild-log-bench", source = [Villager Jock], name = "Wild Log Bench" },
    { id = "wild-wood-wall", source = [Villager Cranky], name = "Wild-wood Wall" },
    { id = "windflower-crown", source = [], name = "Windflower Crown" },
    { id = "windflower-fan", source = [Villager Lazy], name = "Windflower Fan" },
    { id = "windflower-wand", source = [], name = "Windflower Wand" },
    { id = "windflower-wreath", source = [], name = "Windflower Wreath" },
    { id = "wobbling-zipper-toy", source = [], name = "Wobbling Zipper Toy" },
    { id = "wood-egg-outfit", source = [], name = "Wood-egg Outfit" },
    { id = "wood-egg-shell", source = [], name = "Wood-egg Shell" },
    { id = "wood-egg-shoes", source = [], name = "Wood-egg Shoes" },
    { id = "wooden-bookshelf", source = [Villager Lazy], name = "Wooden Bookshelf" },
    { id = "wooden-bucket", source = [Villager Smug], name = "Wooden Bucket" },
    { id = "wooden-chair", source = [Villager Snooty], name = "Wooden Chair" },
    { id = "wooden-chest", source = [Villager Lazy], name = "Wooden Chest" },
    { id = "wooden-double-bed", source = [Villager Smug], name = "Wooden Double Bed" },
    { id = "wooden-end-table", source = [Villager Snooty], name = "Wooden End Table" },
    { id = "wooden-fish", source = [], name = "Wooden Fish" },
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
    { id = "wooden-block-bookshelf", source = [], name = "Wooden-block Bookshelf" },
    { id = "wooden-block-chair", source = [], name = "Wooden-block Chair" },
    { id = "wooden-block-chest", source = [Villager Normal], name = "Wooden-block Chest" },
    { id = "wooden-block-stereo", source = [], name = "Wooden-block Stereo" },
    { id = "wooden-block-stool", source = [Villager Peppy], name = "Wooden-block Stool" },
    { id = "wooden-block-table", source = [Villager Sisterly], name = "Wooden-block Table" },
    { id = "wooden-block-toy", source = [], name = "Wooden-block Toy" },
    { id = "wooden-block-wall-clock", source = [Villager Peppy], name = "Wooden-block Wall Clock" },
    { id = "wooden-knot-wall", source = [Villager Smug], name = "Wooden-knot Wall" },
    { id = "wooden-mosaic-wall", source = [Villager Normal], name = "Wooden-mosaic Wall" },
    { id = "wooden-plank-sign", source = [Villager Cranky], name = "Wooden-plank Sign" },
    { id = "woodland-wall", source = [Villager Normal], name = "Woodland Wall" },
    { id = "yellow-leaf-pile", source = [], name = "Yellow-leaf Pile" },
    { id = "zen-fence", source = [], name = "Zen Fence" },
    { id = "zen-style-stone", source = [Villager Lazy], name = "Zen-style Stone" }
  ]