# tileboard

Simple dashboard tool inspired by the now-defunct tipboard.

It has been rewriten from React to [Svelte](https://svelte.dev/) (the most amazing UI framework)

## Key Concepts

### Configuration

A configuration is used to define which tiles are located on the board.

* `tiles` defines the array of tiles in the board.
* `direction` (optional, default `row`) either `row` or `column` to define in which direction tiles should appear.
* `defaultTimeout` (optional, default `30000`) defines in milliseconds how long a tile should wait before showing the timeout message.

The tile configuration takes the following properties:

* `id` is used to update the tile
* `type` is the type of tile to render. It should match a name from the [App component](https://github.com/francoislg/tileboard/blob/master/App/App.svelte)
* `title` (optional) is rendered in the layout, in the header.
* `props` (optional) are properties passed down to the component. For instance, the `CheckboxMatrix` component has [columnLabels and rowLabels](https://github.com/francoislg/tileboard/blob/master/App/tiles/CheckboxMatrix.svelte)
* `layout` (optional) dictates how to render the tile. For instance, the [RectangleTile](https://github.com/francoislg/tileboard/blob/master/App/layout/RectangleTile.svelte) renders the title at the top, and keeps a full-width content div right under it.
* `layoutProps` (optional) are passed down to the layout component. For instance, the `RectangleTile` component takes [width, height, and break](https://github.com/francoislg/tileboard/blob/master/App/layout/RectangleTile.svelte).
* `initialValue` (optional) can be used to initialise the tile with some value.

### Tile Update

Each tile type has its own value typing.

* `CheckboxMatrix` takes a 2 dimensional array of either booleans or the [ICheckboxValue](https://github.com/francoislg/tileboard/blob/master/App/tiles/Checkbox.ts) format.
* `Checkbox` takes a simple boolean or the [ICheckboxValue](https://github.com/francoislg/tileboard/blob/master/App/tiles/Checkbox.ts) format.
* `LabeledList` takes an [Array<{label: string, value: string}>](https://github.com/francoislg/tileboard/blob/master/App/tiles/LabeledList.svelte#L3)

## Running the server with Docker

This repository automatically builds a docker ready for usage.

`docker pull flguillemette/tileboard:latest` will bring you the latest version.

You can then run this docker by exposing the `7272` (http) and `7273` (socket) ports. You must also define the `API_KEY` environment variable that will be used by your calls to the API.

For instance, running your docker could look like:

```cmd
docker run -e API_KEY=abc123 -p "7272:7272" -p "7273:7273" flguillemette/tileboard:latest
```

## Example

Say you want a simple tile that takes two rows and two columns and renders a 2x2 matrix of checkboxes.

You can create the configuration using the following request:

```
POST /config
Authorization: Bearer <TOKEN>
{
    "tiles": [{
        "id": "matrix-tile",
        "type": "checkboxMatrix",
        "title": "Matrix Example",
        "props": {
            "columnLabels: ["1", "2"],
            "rowLabels": ["a", "b"]
        },
        layoutProps: {
            width: 2,
            height: 2
        }
    }]
}
```

This will give you the following tile:

![Example Matrix 1](/screenshots/example-matrix-1.png)

You can now update its value multiple times by using the following request:

```
POST /update/matrix-tile
Authorization: Bearer <TOKEN>
{
    "value": [
        [true, true],
        [false, true]
    ]
}
```

This will give you the following tile:

![Example Matrix 2](/screenshots/example-matrix-2.png)

## Developping

`npm run start` runs the server locally in watch mode, allowing you to execute requests against it. It will refresh the server when a change is made to the code.

### Adding a new tile

To add a new tile, create a new `svelte` file `tiles` folder. To have access to it's props and state, you must get an instance of the store for this specific tile.

Then, add a reference to this component in the `src/factories.tsx` file so that it is properly wired to the `type` attribute of the tile configuration.
