import {html} from 'htm/preact';
import {Component} from 'preact';

export class PageHeader extends Component {
  render() {
    return html`
      <header class="page-header">
        <h1>
          <img alt="Fangs Logo" src="/assets/fangs-128-opaque.png" />
          Fangs
        </h1>
      </header>
    `;
  }
}
