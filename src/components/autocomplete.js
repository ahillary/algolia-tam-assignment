import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';

// Instant Search Widgets
import { configure, hits, index, searchBox } from 'instantsearch.js/es/widgets';

// Autocomplete Template
import autocompleteProductTemplate from '../templates/autocomplete-product';
import {
  connectHits,
  connectRefinementList,
} from 'instantsearch.js/es/connectors';

/**
 * @class Autocomplete
 * @description Instant Search class to display content in the page's autocomplete
 */
class Autocomplete {
  /**
   * @constructor
   */
  constructor() {
    this._registerClient();
    this._registerWidgets();
    this._startSearch();
  }

  /**
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @return {void}
   */
  _registerClient() {
    this._searchClient = algoliasearch(
      'L5U38G4GCH',
      'f13830a1a7420fd39ccd46fd957b303d'
    );

    this._searchInstance = instantsearch({
      indexName: 'SpencerWilliams',
      searchClient: this._searchClient,
    });
  }

  /**
   * @private
   * Adds widgets to the Algolia instant search instance
   * @return {void}
   */
  _registerWidgets() {
    // Customize UI of the Query Suggestion Hits
    const renderQSHits = ({ widgetParams, hits }, isFirstRender) => {
      const container = document.querySelector(widgetParams.container);
      container.innerHTML = `<ul>
        ${hits
          .map(
            item =>
              `<li>${instantsearch.highlight({
                hit: item,
                attribute: 'query',
              })}</li>`
          )
          .join('')}
      </ul>`;
    };

    const QSHits = connectHits(renderQSHits);

    // Customize UI of the category column
    const renderFederatedRefinement = (
      { widgetParams, items },
      isFirstRender
    ) => {
      const container = document.querySelector(widgetParams.container);
      container.innerHTML = `<ul>
        ${items.map(item => `<li>${item.label}</li>`).join('')}
      </ul>`;
    };

    const federatedRefinement = connectRefinementList(
      renderFederatedRefinement
    );

    // Add the widgets
    this._searchInstance.addWidgets([
      searchBox({
        container: '#searchbox',
        placeholder: 'Search for items',
        showReset: true,
        showSubmit: true,
        showLoadingIndicator: true,
      }),
      index({
        indexName: 'SpencerWilliams',
        indexId: this._searchClient,
      }).addWidgets([
        configure({
          hitsPerPage: 3,
        }),
        hits({
          container: '#autocomplete-hits',
          templates: {
            item: autocompleteProductTemplate,
          },
        }),
      ]),

      // the search suggestions made using Algolia dashboard after uploading Spencer & Williams data
      index({
        indexName: 'SpencerWilliamsSearchSuggestions',
      }).addWidgets([
        configure({
          hitsPerPage: 7,
        }),
        QSHits({
          container: '#suggestions',
        }),
      ]),

      // categories was not asked for from Spencer and Williams, but left as an additional feature unless they request it removed
      federatedRefinement({
        attribute: 'categories',
        container: '#categories',
        limit: 5,
      }),
    ]);
  }

  /**
   * @private
   * Starts instant search after widgets are registered
   * @return {void}
   */
  _startSearch() {
    this._searchInstance.start();
  }
}

export default Autocomplete;
