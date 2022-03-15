import {html} from 'htm/preact';
import {Component} from 'preact';
import browser from 'webextension-polyfill';

import Bang, {BangParameters} from '../../bang/bang.js';

type Props = Record<string, unknown>;

type State = {
  editorBang: BangParameters;
  editorError: string | undefined;
  bangs: BangParameters[];
};

export class PageMain extends Component<Props, State> {
  emptyBang: BangParameters;

  constructor(props: Props) {
    super(props);

    this.emptyBang = {
      baseUrl: '',
      id: '',
      name: '',
      searchUrl: '',
    };

    this.state = {
      bangs: [],
      editorBang: {...this.emptyBang},
      editorError: undefined,
    };
  }

  async componentDidMount() {
    const localStorage = await browser.storage.local.get();

    const bangs = Object.entries(localStorage)
      .filter(([key, _bang]) => key.startsWith('!'))
      .map(([_key, bang]) => bang as BangParameters);

    this.setState({bangs: this.state.bangs.concat(bangs)});
  }

  editBang = (event: Event, key: keyof BangParameters) => {
    const input = event.target as HTMLInputElement;
    this.state.editorBang[key] = input.value;

    let editorError;
    try {
      Bang.validate(this.state.editorBang);
    } catch (error: unknown) {
      editorError = (error as Error).message;
    }

    this.setState({
      editorBang: this.state.editorBang,
      editorError,
    });
  };

  removeBang = async () => {
    const id = this.state.editorBang.id;
    if (!id.startsWith('!')) {
      return;
    }

    await browser.storage.local.remove(id);

    const bangs = this.state.bangs;
    const existingIndex = bangs.findIndex((bang) => bang.id === id);
    if (existingIndex !== -1) {
      bangs.splice(existingIndex, 1);
    }

    this.setState({
      bangs,
      editorBang: {...this.emptyBang},
    });
  };

  saveBang = async () => {
    const bang = this.state.editorBang;

    try {
      if (Bang.validate(bang)) {
        const update: Record<string, BangParameters> = {};
        update[bang.id] = bang;
        await browser.storage.local.set(update);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.setState({
          editorError: error.message,
        });
      } else {
        throw error;
      }

      return;
    }

    const bangs = this.state.bangs;
    const existingIndex = bangs.findIndex(({id}) => id === bang.id);
    if (existingIndex === -1) {
      bangs.push({...bang});
    } else {
      bangs[existingIndex] = {...bang};
    }

    this.setState({
      bangs,
      editorError: undefined,
    });
  };

  render() {
    const {bangs, editorError} = this.state;

    const availableBangs = bangs.map((bang) => {
      const active = bang.id === this.state.editorBang.id ? 'active' : '';
      const onClick = () => {
        this.setState({
          editorBang: {...bang},
        });
      };

      return html`
        <li>
          <button class="${active}" onClick=${onClick}>
            ${bang.name}<span class="bang-id">${bang.id}</span>
          </button>
        </li>
      `;
    });

    if (availableBangs.length === 0) {
      availableBangs.push(
        html`
          <li class="no-bangs">You don't have any bangs yet, go add some!</li>
        `,
      );
    }

    const parametersOrder: Array<[keyof BangParameters, string, string]> = [
      ['name', 'Name', 'Example'],
      ['id', 'Identifier', '!example'],
      ['baseUrl', 'Base Link', 'https://example.org'],
      ['searchUrl', 'Search Link', 'https://example.org/?search={{bang}}'],
    ];

    const editorInputs: HtmComponent[] = [];
    for (const [key, label, placeholder] of parametersOrder) {
      const id = `bang-${key}`;
      const value = this.state.editorBang[key];
      const onInput = (event: Event) => {
        this.editBang(event, key);
      };

      editorInputs.push(html`
        <div class="input-group">
          <label for=${id}>${label}</label>
          <input
            id=${id}
            placeholder=${placeholder}
            value=${value}
            onInput=${onInput}
          />
        </div>
      `);
    }

    const validateError =
      editorError === undefined
        ? undefined
        : html`<p class="validate-error">${editorError}</p>`;

    return html`
      <main class="page-main">
        <details open class="bang-editor">
          <summary>Editor</summary>

          <div class="bang-editor-inner">
            ${editorInputs}

            <div class="button-group">
              <button class="button" onClick=${this.saveBang}>Save</button>
              <button class="button destructive" onClick=${this.removeBang}>
                Remove
              </button>
            </div>
            ${validateError}
          </div>
        </details>

        <details open class="bang-list">
          <summary>Your Bangs</summary>

          <ul>
            ${availableBangs}
          </ul>
        </details>

        <details class="usage">
          <summary>How do I use Fangs?</summary>

          <p>Adding new Bangs:</p>
          <ul>
            <li>Fill out all info in the Editor and click Save!</li>
            <li>
              The "Identifier" is what you'll use to activate the bang in your
              searches.
            </li>
            <li>
              The "Base Link" is where you want to go when you don't include any
              search terms.
            </li>
            <li>
              The "Search Link" is where you want to go when you do include
              something to search for, and the link must have "{{bang}}" in it
              to insert your search text.
            </li>
          </ul>

          <p>Editing existing Bangs:</p>
          <ul>
            <li>
              Click on the Bang from the "Your Bangs" list to insert it into the
              editor.
            </li>
            <li>
              Editing a Bang with an Identifier that already exists will
              overwrite it with the new one.
            </li>
          </ul>

          <p>Removing Bangs:</p>
          <ul>
            <li>
              Click on the Bang you want to remove and then click the Remove
              button.
            </li>
          </ul>
        </details>
      </main>
    `;
  }
}
