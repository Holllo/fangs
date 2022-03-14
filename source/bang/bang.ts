export interface BangParameters {
  baseUrl: string;
  id: string;
  name: string;
  searchUrl: string;
}

export default class Bang {
  public static parseId(input: string): string | undefined {
    const matches = /(?<id>![a-z\d]+\b)/i.exec(input) ?? undefined;
    if (matches?.groups === undefined) {
      return;
    }

    return matches.groups.id;
  }

  public static parseParameters(input: string, bang: BangParameters): Bang {
    const searchQuery = input.replace(bang.id, '').trim();
    const destination =
      searchQuery.length === 0
        ? bang.baseUrl
        : bang.searchUrl.replace(/{{bang}}/g, searchQuery);

    return new Bang(encodeURI(destination), bang);
  }

  public static validate(bang: BangParameters): boolean {
    if (bang.name.length === 0) {
      throw new Error('Bang name cannot be left empty');
    }

    if (!bang.id.startsWith('!')) {
      throw new Error('Bang identifier must start with an exclamation mark');
    }

    if (!/^![a-z\d]+$/i.test(bang.id)) {
      throw new Error('Bang identifier can only have letters and/or numbers');
    }

    try {
      // eslint-disable-next-line no-new
      new URL(bang.baseUrl);
    } catch {
      throw new Error('Bang base link must be a valid URL');
    }

    try {
      // eslint-disable-next-line no-new
      new URL(bang.searchUrl);
    } catch {
      throw new Error('Bang search link must be a valid URL');
    }

    if (!bang.searchUrl.includes('{{bang}}')) {
      throw new Error('Bang search link must include {{bang}}');
    }

    return true;
  }

  public destination: string;
  public parameters: BangParameters;

  constructor(destination: string, parameters: BangParameters) {
    this.destination = destination;
    this.parameters = parameters;
  }
}
