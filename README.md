# Zone Manager

This is a simple application I wrote for the Swiss Civil Protection Service of Lucerne.

It's used to maintain an accurate list of which people are in which zone using simple drag and drop operations.

## Usage

A ready to run copy is hosted at https://demo.ayra.ch/zone-manager/

You can click on the name of a zone to configure it.
By default, only the red zone has a warning and alert configured.

You can click on a card in order to name it, and to see its history.

If you need more cards, you can click the "+" button at the bottom.
Note that you currently cannot delete cards again.

You can use the "Reset" button to delete all data.

**Data is only stored in your browser**.
Do not delete browser data or you lose your state.

## Self hosting

1. Clone this repository
2. Run "build.bat" to compile the typescript files (needs global typescript compiler installation)
3. Copy `index.html`, `site.css` and the `js` folder to your web server